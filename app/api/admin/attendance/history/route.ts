import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Attendance from '@/models/Attendance';

/**
 * GET /api/attendance/history
 * Fetches attendance history for students, teachers, or staff.
 * Query Params: ?courseName=...&studentId=...&date=...
 */
export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) return unauthorizedResponse();

        const { searchParams } = new URL(req.url);
        const courseName = searchParams.get('courseName');
        const studentId = searchParams.get('studentId');
        const date = searchParams.get('date');

        await dbConnect();

        const filter: any = {};
        if (courseName) filter.courseName = courseName;
        
        // Authorization Logic
        if (user.role === 'student') {
            // Students can only see their OWN attendance
            filter.studentEmail = user.email;
        } else {
            // Admins, Teachers, Staff can see others
            if (studentId) filter.student = studentId;
            if (date) {
                const normalizedDate = new Date(date);
                normalizedDate.setHours(0, 0, 0, 0);
                filter.date = normalizedDate;
            }
        }

        const history = await Attendance.find(filter)
            .populate('student', 'fullName email avatar')
            .populate('markedBy', 'name role')
            .sort({ date: -1 })
            .lean();

        return NextResponse.json({ success: true, data: history });

    } catch (error: any) {
        console.error('Attendance History Error:', error);
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
    }
}
