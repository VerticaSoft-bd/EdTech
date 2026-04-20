import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();
        const task = await Task.findById(id).populate('courseId', 'title');
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: task });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getAuthenticatedUser(req);
        if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        
        // Clean up mcqQuestions if not MCQ type
        if (body.type && body.type !== 'MCQ') {
            body.mcqQuestions = [];
        }

        await dbConnect();

        const task = await Task.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: task });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getAuthenticatedUser(req);
        if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Task deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
