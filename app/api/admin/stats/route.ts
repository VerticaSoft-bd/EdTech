import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Student from '@/models/Student';

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        // Total Revenue from completed course purchases
        const revenueResult = await Transaction.aggregate([
            { $match: { type: 'course_purchase', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Revenue last 30 days
        const revenueThisMonth = await Transaction.aggregate([
            { $match: { type: 'course_purchase', status: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const revThisMonth = revenueThisMonth[0]?.total || 0;

        // Revenue previous 30 days
        const revenuePrevMonth = await Transaction.aggregate([
            { $match: { type: 'course_purchase', status: 'completed', createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const revPrevMonth = revenuePrevMonth[0]?.total || 0;

        const revenueChange = revPrevMonth > 0
            ? (((revThisMonth - revPrevMonth) / revPrevMonth) * 100).toFixed(1)
            : revThisMonth > 0 ? '+100' : '0';

        // Total Students
        const totalStudents = await Student.countDocuments();

        // Students this month
        const studentsThisMonth = await Student.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const studentsPrevMonth = await Student.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
        const studentChange = studentsPrevMonth > 0
            ? (((studentsThisMonth - studentsPrevMonth) / studentsPrevMonth) * 100).toFixed(1)
            : studentsThisMonth > 0 ? '+100' : '0';

        // Total Enrollments (completed course purchases)
        const totalEnrollments = await Transaction.countDocuments({ type: 'course_purchase', status: 'completed' });
        const enrollmentsThisMonth = await Transaction.countDocuments({ type: 'course_purchase', status: 'completed', createdAt: { $gte: thirtyDaysAgo } });
        const enrollmentsPrevMonth = await Transaction.countDocuments({ type: 'course_purchase', status: 'completed', createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
        const enrollmentChange = enrollmentsPrevMonth > 0
            ? (((enrollmentsThisMonth - enrollmentsPrevMonth) / enrollmentsPrevMonth) * 100).toFixed(1)
            : enrollmentsThisMonth > 0 ? '+100' : '0';

        // Pending Payments
        const pendingPayments = await Transaction.countDocuments({ type: 'course_purchase', status: 'pending' });

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
