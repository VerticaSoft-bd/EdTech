import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import Course from '@/models/Course';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Ensure critical fields exist
        if (!body.fullName || !body.email || !body.mobileNo || !body.courseName) {
            return NextResponse.json(
                { success: false, message: 'Please provide required fields: Full Name, Email, Mobile No, and Course Name' },
                { status: 400 }
            );
        }

        // Must accept privacy policy
        if (!body.privacyPolicyAccepted) {
            return NextResponse.json(
                { success: false, message: 'You must accept the privacy policy' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Fetch course details to get courseMode
        const courseData = await Course.findOne({ title: body.courseName });
        const courseMode = courseData?.courseMode || 'Online';

        // Check if student with same email exists
        const existingStudent = await Student.findOne({ email: body.email });
        if (existingStudent) {
            return NextResponse.json(
                { success: false, message: 'Student with this email already exists' },
                { status: 400 }
            );
        }

        const newStudent = await Student.create({
            ...body,
            courseMode
        });

        return NextResponse.json({
            success: true,
            message: 'Student created successfully',
            data: newStudent
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create Student Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during student registration' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const students = await Student.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: students
        });
    } catch (error: any) {
        console.error("Fetch Students Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred while fetching students' },
            { status: 500 }
        );
    }
}
