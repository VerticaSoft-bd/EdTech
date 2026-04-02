import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
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

        // Determine user role and ID
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userRole = 'student'; // Default safest
        let userId = null;

        if (token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
                const { payload } = await jwtVerify(token, secret);
                userRole = payload.role as string;
                userId = payload.id;
            } catch (err) {
                // Ignore parsing errors for public access
            }
        }

        let queryContext: any = { status: 'Active' };

        if (userRole === 'admin' || userRole === 'staff') {
            queryContext = {}; // Admins see all courses (Draft, Active, Archived)
        } else if (userRole === 'teacher' && userId) {
            queryContext = { assignedTeachers: userId }; // Teachers see all their assigned courses regardless of status
        }

        const courses = await Course.find(queryContext)
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
