import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import Course from '@/models/Course';

interface Alert {
    id: string;
    student: string;
    issue: string;
    status: string;
    type: string;
}

export async function GET() {
    try {
        await connectToDatabase();

        // 0. Authenticate & Determine Role
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
                console.error("Alerts API: Invalid token", err);
            }
        }

        let teacherFilter: any = {};
        if (userRole === 'teacher' && userId) {
            const myCourses = await Course.find({ assignedTeachers: userId }).select('title').lean();
            const teacherCourseTitles = myCourses.map((c: any) => c.title);
            
            if (teacherCourseTitles.length > 0) {
                teacherFilter = { courseName: { $in: teacherCourseTitles } };
            } else {
                return NextResponse.json({ success: true, data: [] });
            }
        }

        const alerts: Alert[] = [];

        // 1. Payment Overdue Alerts
        const overdueStudents = await Student.find({ ...teacherFilter, dueAmount: { $gt: 0 } })
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
        const lowAttendanceStudents = await Student.find({
            ...teacherFilter,
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
            ...teacherFilter,
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
            data: alerts.slice(0, 10)
        });

    } catch (error: any) {
        console.error("Fetch Alerts Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
