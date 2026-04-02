import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Student from '@/models/Student';
import Course from '@/models/Course';

export async function GET() {
    try {
        await dbConnect();

        // 1. Authenticate & Determine Role
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userRole = 'admin';
        let userId = null;

        if (token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
                const { payload } = await jwtVerify(token, secret);
                userRole = payload.role as string;
                userId = payload.id;
            } catch (err) {
                console.error("Stats API: Invalid token", err);
            }
        }

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        let teacherCourseIds: string[] = [];
        let teacherCourseTitles: string[] = []; // If transactions store courseName, this could help.
        let teacherFilter: any = {};
        let teacherTransactionFilter: any = { type: 'course_purchase', status: 'completed' };

        if (userRole === 'teacher' && userId) {
            // Find courses assigned to this teacher
            const myCourses = await Course.find({ assignedTeachers: userId }).select('_id title').lean();
            teacherCourseIds = myCourses.map((c: any) => c._id.toString());
            teacherCourseTitles = myCourses.map((c: any) => c.title);
            
            // To filter students: 
            teacherFilter = { courseId: { $in: teacherCourseIds } };

            // To filter transactions (metadata.courseId or metadata.courseName)
            if (teacherCourseIds.length > 0) {
                 teacherTransactionFilter = {
                     type: 'course_purchase',
                     status: 'completed',
                     $or: [
                         { 'metadata.courseId': { $in: teacherCourseIds } },
                         { 'metadata.courseName': { $in: teacherCourseTitles } }
                     ]
                 };
            } else {
                 // Teacher has no courses, return 0 for everything
                 teacherTransactionFilter = { _id: null }; // Impossible condition
            }
        }

        // Total Revenue from completed course purchases
        // Total Revenue from completed course purchases
        const revenueResult = await Transaction.aggregate([
            { $match: teacherTransactionFilter },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Revenue last 30 days
        const revenueThisMonth = await Transaction.aggregate([
            { $match: { ...teacherTransactionFilter, createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const revThisMonth = revenueThisMonth[0]?.total || 0;

        // Revenue previous 30 days
        const revenuePrevMonth = await Transaction.aggregate([
            { $match: { ...teacherTransactionFilter, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const revPrevMonth = revenuePrevMonth[0]?.total || 0;

        const revenueChange = revPrevMonth > 0
            ? (((revThisMonth - revPrevMonth) / revPrevMonth) * 100).toFixed(1)
            : revThisMonth > 0 ? '+100' : '0';

        // Total Students
        const totalStudents = userRole === 'teacher' 
            ? await Student.countDocuments({ $or: [{ courseId: { $in: teacherCourseIds } }, { courseName: { $in: teacherCourseTitles } }] })
            : await Student.countDocuments();

        // Total Enrollments (completed course purchases)
        const totalEnrollments = userRole === 'teacher' && teacherCourseIds.length === 0 
             ? 0 
             : await Transaction.countDocuments(teacherTransactionFilter);
        const enrollmentsThisMonth = userRole === 'teacher' && teacherCourseIds.length === 0
             ? 0
             : await Transaction.countDocuments({ ...teacherTransactionFilter, createdAt: { $gte: thirtyDaysAgo } });
        const enrollmentsPrevMonth = userRole === 'teacher' && teacherCourseIds.length === 0
             ? 0
             : await Transaction.countDocuments({ ...teacherTransactionFilter, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
        const enrollmentChange = enrollmentsPrevMonth > 0
            ? (((enrollmentsThisMonth - enrollmentsPrevMonth) / enrollmentsPrevMonth) * 100).toFixed(1)
            : enrollmentsThisMonth > 0 ? '+100' : '0';

        // Students this month (approximated same as enrollments if teacher for simplicity, else calculate)
        const studentChange = enrollmentChange; // Simplifying this to match enrollments

        // Pending Payments
        const pendingPayments = userRole === 'teacher' && teacherCourseIds.length === 0
            ? 0
            : await Transaction.countDocuments({ 
                type: 'course_purchase', 
                status: 'pending',
                ...((userRole === 'teacher' && teacherCourseIds.length > 0) ? {
                    $or: [
                        { 'metadata.courseId': { $in: teacherCourseIds } },
                        { 'metadata.courseName': { $in: teacherCourseTitles } }
                    ]
                } : {})
            });

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue,
                revenueChange: `${Number(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
                totalStudents,
                studentChange: `${Number(studentChange) >= 0 ? '+' : ''}${studentChange}%`,
                totalEnrollments,
                enrollmentChange: `${Number(enrollmentChange) >= 0 ? '+' : ''}${enrollmentChange}%`,
                pendingPayments,
            }
        });
    } catch (error: any) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
