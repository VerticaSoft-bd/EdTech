import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TaskSubmission from '@/models/TaskSubmission';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ submissionId: string }> }) {
    try {
        const { submissionId } = await params;
        const user = await getAuthenticatedUser(req);
        if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { pointsEarned, feedback } = await req.json();
        await dbConnect();

        const submission = await TaskSubmission.findByIdAndUpdate(
            submissionId,
            {
                pointsEarned,
                feedback,
                status: 'Graded',
                gradedAt: new Date(),
                gradedBy: user._id,
            },
            { new: true, runValidators: true }
        );

        if (!submission) {
            return NextResponse.json({ success: false, message: 'Submission not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: submission });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
