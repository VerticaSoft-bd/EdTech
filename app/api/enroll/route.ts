import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Check if student with this email already exists for THIS course
        const existingStudent = await Student.findOne({ email: body.email, courseName: body.courseName });
        if (existingStudent) {
            return NextResponse.json({
                success: false,
                message: 'You are already registered for this course.'
            }, { status: 400 });
        }

        const newStudent = await Student.create({
            ...body
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully enrolled!',
            data: newStudent
        }, { status: 201 });

    } catch (error: any) {
        console.error("Enrollment Error:", error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({ success: false, message: messages.join(', ') }, { status: 400 });
        }

        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'You are already registered for this course.' }, { status: 400 });
        }

        return NextResponse.json(
            { success: false, message: 'An error occurred during enrollment' },
            { status: 500 }
        );
    }
}
