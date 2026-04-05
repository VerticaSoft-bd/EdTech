import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Attendance from '@/models/Attendance';
import Student from '@/models/Student';
import mongoose from 'mongoose';

/**
 * POST /api/admin/attendance/bulk
 * Marks attendance for multiple students at once.
 * Body: { courseName: string, date: string, students: [{ studentId: string, email: string, status: 'Present' | 'Absent' | 'Late' }] }
 */
export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        
        // As requested by the user to "unprotected koro" (since token might not be passing correctly)
        // We will allow the request but log if the user was found.
        // In a production environment, this should be strictly protected.
        if (!user && process.env.NODE_ENV === 'production') {
            console.error("Bulk Attendance: No authenticated user found in production.");
            return unauthorizedResponse();
        }

        // Fallback user ID if not authenticated (using a placeholder or the first admin found)
        const markedBy = (user?._id || new mongoose.Types.ObjectId("000000000000000000000000")) as any;

        const body = await req.json();
        const { courseName, date, students } = body;

        if (!courseName || !date || !Array.isArray(students)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Normalize date to midnight to ensure consistency
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const operations = students.map(s => ({
            updateOne: {
                filter: {
                    student: new mongoose.Types.ObjectId(s.studentId),
                    courseName,
                    date: attendanceDate
                },
                update: {
                    $set: {
                        studentEmail: s.email,
                        status: s.status,
                        markedBy: markedBy,
                        method: 'Manual' as const
                    }
                },
                upsert: true
            }
        }));

        // 1. Perform bulk write for attendance records
        await Attendance.bulkWrite(operations);

        // 2. Sync attendedClasses count in Student model for each student touched
        // This is done to ensure the dashboard charts stay performant
        const studentIds = students.map(s => new mongoose.Types.ObjectId(s.studentId));
        
        for (const sId of studentIds) {
            const count = await Attendance.countDocuments({
                student: sId,
                courseName,
                status: 'Present'
            });
            
            await Student.updateOne(
                { _id: sId },
                { $set: { attendedClasses: count } }
            );
        }

        return NextResponse.json({ 
            success: true, 
            message: `Attendance marked for ${students.length} students` 
        });

    } catch (error: any) {
        console.error('Bulk Attendance Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
