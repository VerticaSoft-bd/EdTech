import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

export async function GET() {
    try {
        await connectToDatabase();

        const alerts = [];

        // 1. Payment Overdue Alerts
        const overdueStudents = await Student.find({ dueAmount: { $gt: 0 } })
            .select('fullName dueAmount')
            .limit(5)
            .lean();
        
        overdueStudents.forEach(student => {
            alerts.push({
                id: `payment-${student._id}`,
                student: student.fullName,
                issue: `Payment Pending (৳${student.dueAmount.toLocaleString()})`,
                status: "Locked",
                type: 'payment'
            });
        });

        // 2. Low Attendance Alerts (< 50%)
        // We only check students who have at least 5 classes scheduled
        const lowAttendanceStudents = await Student.find({
            totalClasses: { $gte: 5 },
            $expr: {
                $lt: [
                    { $divide: ["$attendedClasses", "$totalClasses"] },
                    0.5
                ]
            }
        })
        .select('fullName attendedClasses totalClasses')
        .limit(5)
        .lean();

        lowAttendanceStudents.forEach(student => {
            const percentage = ((student.attendedClasses / student.totalClasses) * 100).toFixed(0);
            alerts.push({
                id: `attendance-${student._id}`,
                student: student.fullName,
                issue: `Attendance < 50% (Current: ${percentage}%)`,
                status: "Warning",
                type: 'attendance'
            });
        });

        // 3. Critical Progress Alerts (< 10%)
        const lowProgressStudents = await Student.find({
            progress: { $lt: 10 },
            createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Enrolled more than 7 days ago
        })
        .select('fullName progress')
        .limit(5)
        .lean();

        lowProgressStudents.forEach(student => {
            alerts.push({
                id: `progress-${student._id}`,
                student: student.fullName,
                issue: `Course Progress < 10%`,
                status: "Critical",
                type: 'progress'
            });
        });

        // Sort alerts: Critical > Locked > Warning
        const statusPriority: Record<string, number> = { "Critical": 1, "Locked": 2, "Warning": 3 };
        alerts.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

        return NextResponse.json({
            success: true,
            data: alerts.slice(0, 10) // Return top 10 most critical alerts
        });

    } catch (error: any) {
        console.error("Fetch Alerts Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
