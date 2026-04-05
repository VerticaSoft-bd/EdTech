import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Attendance from '@/models/Attendance';
import Transaction from '@/models/Transaction';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const user = await getAuthenticatedUser();

        if (!user || user.role !== 'student') {
            return NextResponse.json({ success: false, error: 'Unauthorized. Please log in as a student.' }, { status: 401 });
        }

        const body = await request.json();
        const { courseName, date, deviceInfo } = body;

        if (!courseName || !date) {
            return NextResponse.json({ success: false, error: 'Missing course or date information.' }, { status: 400 });
        }

        // 1. Verify Enrollment via Transactions
        const enrollment = await Transaction.findOne({
            user: user._id,
            'metadata.courseName': courseName,
            type: 'course_purchase',
            status: 'completed'
        });

        if (!enrollment) {
            // Check alternative enrollment structure (some might use studentEmail in metadata)
            const altEnrollment = await Transaction.findOne({
                'metadata.email': user.email,
                'metadata.courseName': courseName,
                type: 'course_purchase',
                status: 'completed'
            });
            
            if (!altEnrollment) {
                return NextResponse.json({ success: false, error: 'You are not enrolled in this course.' }, { status: 403 });
            }
        }

        // 2. Check if attendance already marked
        const checkDate = new Date(date);
        const startOfDay = new Date(new Date(checkDate).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(checkDate).setHours(23, 59, 59, 999));

        const existing = await Attendance.findOne({
            student: user._id,
            courseName: courseName,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existing) {
            return NextResponse.json({ success: true, message: 'Attendance already marked for today.', data: existing });
        }

        // 3. Mark Attendance
        const attendance = await Attendance.create({
            student: user._id,
            studentEmail: user.email,
            courseName,
            date: new Date(date),
            status: 'Present',
            markedBy: user._id, // Self-marked
            method: 'Self',
            deviceInfo: deviceInfo || {}
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Attendance marked successfully!', 
            data: attendance 
        });

    } catch (error: any) {
        console.error("Check-in Error:", error);
        return NextResponse.json({ success: false, error: error.message || 'Server error during check-in' }, { status: 500 });
    }
}
