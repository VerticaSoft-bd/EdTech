import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Course from '@/models/Course';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Perform basic validation, ensuring critical fields exist
        if (!body.title || !body.category || !body.courseMode) {
            return NextResponse.json(
                { success: false, message: 'Please provide course title, category, and mode' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const newCourse = await Course.create(body);

        return NextResponse.json({
            success: true,
            message: 'Course created successfully',
            data: newCourse
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create Course Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during course creation' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        await connectToDatabase();

        // Ensure User model is registered for population
        User.modelName;

        const courses = await Course.find({ status: 'Active' })
            .populate('assignedTeachers', 'name email profileImage role')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: courses
        });
    } catch (error: any) {
        console.error("Fetch Courses Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred while fetching courses' },
            { status: 500 }
        );
    }
}
