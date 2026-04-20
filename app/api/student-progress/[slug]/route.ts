import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import Course from '@/models/Course';
import Attendance from '@/models/Attendance';
import Task from '@/models/Task';
import TaskSubmission from '@/models/TaskSubmission';
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

        // 3. Fetch attendance history
        const attendance = await Attendance.find({ 
            studentEmail: user.email, 
            courseName: course.title 
        })
        .sort({ date: -1 })
        .populate('markedBy', 'name role')
        .lean();

        // 4. Fetch tasks for this course
        const tasks = await Task.find({ 
            courseId: course._id,
            status: 'Published'
        }).sort({ createdAt: -1 }).lean();

        // 5. Fetch submissions for these tasks by this student
        const taskIds = tasks.map((t: any) => t._id);
        const submissions = await TaskSubmission.find({
            taskId: { $in: taskIds },
            studentId: user._id
        }).lean();
        
        // 6. Fetch resources for this course
        const Resource = (await import('@/models/Resource')).default;
        const resources = await Resource.find({ 
            courseId: course._id,
            isPublished: true 
        }).sort({ order: 1 }).lean();

        // Combine tasks with submission status
        const tasksWithSubmissions = tasks.map((task: any) => {
            const submission = submissions.find((s: any) => String(s.taskId) === String(task._id));
            return {
                ...task,
                submission: submission || null
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                course,
                student,
                attendanceHistory: attendance,
                tasks: tasksWithSubmissions,
                resources
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
