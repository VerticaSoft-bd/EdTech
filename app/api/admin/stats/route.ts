import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Student from '@/models/Student';
import Course from '@/models/Course';
import Expense from '@/models/Expense';

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
        let teacherTransactionFilter: any = { 
            type: { $in: ['course_purchase', 'manual_payment'] }, 
            status: 'completed' 
        };

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
                     type: { $in: ['course_purchase', 'manual_payment'] },
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

        // Total Due Payment & Collection (Filtered by teacher if applicable)
        const studentDueFilter = userRole === 'teacher' 
            ? { $or: [{ courseId: { $in: teacherCourseIds } }, { courseName: { $in: teacherCourseTitles } }] }
            : {};
            
        const studentStats = await Student.aggregate([
            { $match: studentDueFilter },
            { $group: { 
                _id: null, 
                totalPaid: { $sum: '$paidAmount' },
                totalDue: { $sum: '$dueAmount' }
            } }
        ]);
        
        const totalCollection = studentStats[0]?.totalPaid || 0;
        const totalDuePayment = studentStats[0]?.totalDue || 0;

        // Total Revenue (Total Receivable: Collected + Due)
        const totalRevenue = totalCollection + totalDuePayment;

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

        // Enrollment filter (only course_purchase)
        const enrollmentFilter: any = { 
            type: 'course_purchase', 
            status: 'completed' 
        };
        if (userRole === 'teacher' && userId) {
            if (teacherCourseIds.length > 0) {
                enrollmentFilter.$or = [
                    { 'metadata.courseId': { $in: teacherCourseIds } },
                    { 'metadata.courseName': { $in: teacherCourseTitles } }
                ];
            } else {
                enrollmentFilter._id = null;
            }
        }

        // Total Enrollments (completed course purchases)
        const totalEnrollments = await Transaction.countDocuments(enrollmentFilter);
        const enrollmentsThisMonth = await Transaction.countDocuments({ ...enrollmentFilter, createdAt: { $gte: thirtyDaysAgo } });
        const enrollmentsPrevMonth = await Transaction.countDocuments({ ...enrollmentFilter, createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
        
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

        // Total Expenses (Admins only, but we'll return it and let UI handle visibility)
        const expenseResult = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalOfficeExpenses = expenseResult[0]?.total || 0;


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
                totalOfficeExpenses,
                totalDuePayment,
                totalGross: totalCollection
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
