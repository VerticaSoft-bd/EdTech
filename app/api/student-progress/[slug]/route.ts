import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import Course from '@/models/Course';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // 1. Fetch course details
        const course = await Course.findOne({ slug }).lean();
        if (!course) {
            return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
        }

        // 2. Fetch student enrollment for this user and course
        const student = await Student.findOne({ 
            email: user.email, 
            courseName: course.title 
        }).lean();

        if (!student) {
            return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });
        }

        // 3. Fetch attendance history, populating markedBy to get teacher info
        // We need to ensure the User model is registered
        const attendance = await Attendance.find({ 
            studentEmail: user.email, 
            courseName: course.title 
        })
        .sort({ date: -1 })
        .populate('markedBy', 'name role')
        .lean();

        return NextResponse.json({
            success: true,
            data: {
                course,
                student,
                attendanceHistory: attendance
            }
        });

    } catch (error: any) {
        console.error("Fetch Student Progress Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message || 'An error occurred while fetching progress' 
        }, { status: 500 });
    }
}
