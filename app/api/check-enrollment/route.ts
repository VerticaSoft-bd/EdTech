import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.email || !body.courseName) {
            return NextResponse.json({
                success: false,
                isEnrolled: false,
                message: 'Email and courseName are required.'
            }, { status: 400 });
        }

        await connectToDatabase();

        // Check if student with this email is already registered for this course using case-insensitive exactly matching regex
        const existingStudent = await Student.findOne({
            email: new RegExp(`^${body.email.trim()}$`, 'i'),
            courseName: new RegExp(`^${body.courseName.trim()}$`, 'i')
        });

        if (existingStudent) {
            return NextResponse.json({
                success: true,
                isEnrolled: true,
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            isEnrolled: false,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Enrollment Check Error:", error);
        return NextResponse.json({
            success: false,
            isEnrolled: false,
            message: 'An error occurred while checking enrollment status.'
        }, { status: 500 });
    }
}
