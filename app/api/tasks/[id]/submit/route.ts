import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import TaskSubmission from '@/models/TaskSubmission';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: taskId } = await params;
        const user = await getAuthenticatedUser(req);
        if (!user || user.role !== 'student') {
            return NextResponse.json({ success: false, message: 'Only students can submit tasks' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        const task = await Task.findById(taskId);
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        // Handle MCQ auto-grading
        let pointsEarned = undefined;
        let status: 'Submitted' | 'Graded' | 'Late' = 'Submitted';
        
        if (task.type === 'MCQ' && body.mcqAnswers) {
            let correctCount = 0;
            task.mcqQuestions?.forEach((q, index) => {
                if (q.correctAnswer === body.mcqAnswers[index]) {
                    correctCount++;
                }
            });
            
            const totalQuestions = task.mcqQuestions?.length || 1;
            pointsEarned = Math.round((correctCount / totalQuestions) * task.points);
            status = 'Graded';
        }

        // Check if late (if deadline exists)
        if (task.deadline && new Date() > new Date(task.deadline)) {
            if (status !== 'Graded') {
              status = 'Late';
            }
        }

        const submission = await TaskSubmission.findOneAndUpdate(
            { taskId, studentId: user._id },
            {
                ...body,
                pointsEarned,
                status,
                submittedAt: new Date(),
            },
            { upsert: true, new: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: submission });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
