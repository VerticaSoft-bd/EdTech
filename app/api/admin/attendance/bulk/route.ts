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
        
        // Lenient Auth check as requested
        if (!user && process.env.NODE_ENV === 'production') {
            console.error("Bulk Attendance: No authenticated user found in production.");
            return unauthorizedResponse();
        }

        // Fallback user ID if not authenticated
        const markedBy = (user?._id || new mongoose.Types.ObjectId("000000000000000000000000")) as any;

        const body = await req.json();
        const { courseName, date, students } = body;

        if (!courseName || !date || !Array.isArray(students)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        
        // --- Date Validation: Only allow marking for today ---
        const todayStr = new Date().toISOString().split('T')[0];
        if (date !== todayStr) {
            return NextResponse.json({ 
                error: `Attendance can only be marked for the current date (${todayStr}). You provided ${date}.` 
            }, { status: 400 });
        }
        // ---------------------------------------------------

        // Normalize date to midnight to ensure consistency
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const now = new Date();
        const operations: any[] = [];
        const affectedStudentEmails: string[] = [];

        // Prepare operations with resilience for invalid ObjectIds
        for (const s of students) {
            let studentObjectId: mongoose.Types.ObjectId | null = null;
            
            // Validate ObjectId
            if (mongoose.Types.ObjectId.isValid(s.studentId)) {
                studentObjectId = new mongoose.Types.ObjectId(s.studentId);
            } else {
                // Fallback: Find student by email and courseName 
                // This handles cases like "std2" where ID might be a display string
                const foundStudent = await Student.findOne({ email: s.email, courseName });
                if (foundStudent) {
                    studentObjectId = foundStudent._id as mongoose.Types.ObjectId;
                }
            }

            if (studentObjectId) {
                operations.push({
                    updateOne: {
                        filter: {
                            student: studentObjectId,
                            courseName,
                            date: attendanceDate
                        },
                        update: {
                            $set: {
                                studentEmail: s.email,
                                status: s.status,
                                markedBy: markedBy,
                                attendedAt: now, // NEW: Capture the exact time of marking
                                method: 'Manual' as const
                            }
                        },
                        upsert: true
                    }
                });
                affectedStudentEmails.push(s.email);
            } else {
                console.warn(`Bulk Attendance: Could not resolve student for email ${s.email}`);
            }
        }

        if (operations.length === 0) {
            return NextResponse.json({ error: 'No valid students found to mark attendance' }, { status: 400 });
        }

        // 1. Perform bulk write for attendance records
        await Attendance.bulkWrite(operations);

        // 2. Sync attendedClasses and totalClasses count in Student model
        // We sync based on email + courseName to be extra safe
        await Promise.all(affectedStudentEmails.map(async (email) => {
            // Count total classes where this student was marked (Present, Absent, or Late)
            const totalHeld = await Attendance.countDocuments({
                studentEmail: email,
                courseName
            });

            // Count only Present records
            const attended = await Attendance.countDocuments({
                studentEmail: email,
                courseName,
                status: 'Present'
            });
            
            // Sync both fields to the Student model
            await Student.updateOne(
                { email, courseName },
                { 
                    $set: { 
                        attendedClasses: attended,
                        totalClasses: totalHeld 
                    } 
                }
            );
        }));

        return NextResponse.json({ 
            success: true, 
            message: `Attendance saved and updated for ${affectedStudentEmails.length} students` 
        });

    } catch (error: any) {
        console.error('Bulk Attendance Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
