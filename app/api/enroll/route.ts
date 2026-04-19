import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import Batch from '@/models/Batch';
import { sendSMS } from '@/lib/sms';

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

        // Increment Batch enrollment if batchId is provided
        if (body.batchId) {
            await Batch.findByIdAndUpdate(body.batchId, { $inc: { enrolledStudents: 1 } });
        }

        // Send enrollment confirmation SMS
        if (newStudent.mobileNo) {
            await sendSMS(newStudent.mobileNo, `Congratulations ${newStudent.fullName}! You have successfully enrolled in ${newStudent.courseName}. Thank you for choosing EdTech.`);
        }

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
