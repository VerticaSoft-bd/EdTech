import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SeminarBooking from '@/models/SeminarBooking';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, profession, courseTitle } = body;

        if (!name || !email || !phone || !profession) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const newBooking = await SeminarBooking.create({
            name,
            email,
            phone,
            profession,
            courseTitle
        });

        return NextResponse.json({
            success: true,
            message: 'Booking created successfully',
            data: newBooking
        }, { status: 201 });

    } catch (error: any) {
        console.error('Seminar booking error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create booking', error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const bookings = await SeminarBooking.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: bookings
        });

    } catch (error: any) {
        console.error('Seminar fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch bookings', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
        }

        await connectToDatabase();
        await SeminarBooking.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Booking deleted successfully'
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: 'Deletion failed', error: error.message },
            { status: 500 }
        );
    }
}
