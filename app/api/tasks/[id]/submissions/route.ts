import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TaskSubmission from '@/models/TaskSubmission';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: taskId } = await params;
        const user = await getAuthenticatedUser(req);
        if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const submissions = await TaskSubmission.find({ taskId })
            .populate('studentId', 'name email image')
            .sort({ submittedAt: -1 });

        return NextResponse.json({ success: true, data: submissions });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
