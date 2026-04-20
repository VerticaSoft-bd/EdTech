import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Batch from '@/models/Batch';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const type = url.searchParams.get('type');
        const status = url.searchParams.get('status');

        // Determine user role and ID
        const { cookies } = await import('next/headers');
        const { jwtVerify } = await import('jose');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userRole = '';
        let userId = null;

        if (token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
                const { payload } = await jwtVerify(token, secret);
                userRole = payload.role as string;
                userId = payload.id;
            } catch (err) {
                // Ignore token errors
            }
        }

        const query: any = {};
        if (type) query.type = type;
        if (status) query.status = status;
        
        // If teacher, only show their assigned batches
        if (userRole === 'teacher' && userId) {
            query.teachers = userId;
        }

        const batches = await Batch.find(query).populate('teachers', 'name email avatar').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: batches });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Validation
        if (!body.name || !body.type || !body.schedule || !body.timing || body.totalSeats === undefined || !body.startDate) {
            return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
        }

        const newBatch = await Batch.create(body);

        return NextResponse.json({ success: true, data: newBatch }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
