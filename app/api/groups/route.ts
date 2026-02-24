import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Group from '@/models/Group';

// Disable caching for real-time list updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Fetch all groups
export async function GET() {
    try {
        await connectToDatabase();
        const groups = await Group.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: groups });
    } catch (error: any) {
        console.error("GET Groups error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Create a new group
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Check if group with same name exists to avoid 500 error from MongoDB unique index
        const existingGroup = await Group.findOne({ name: body.name });
        if (existingGroup) {
            return NextResponse.json({ success: false, message: 'A group with this name already exists.' }, { status: 400 });
        }

        const group = await Group.create({
            name: body.name,
            description: body.description,
            status: body.status || 'Active'
        });

        return NextResponse.json({ success: true, data: group }, { status: 201 });
    } catch (error: any) {
        console.error("POST Group error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
