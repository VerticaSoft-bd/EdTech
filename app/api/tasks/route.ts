import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('courseId');

        await dbConnect();

        let query: any = {};
        if (courseId) {
            query.courseId = courseId;
        }

        // If user is a teacher, they might want to see tasks they created.
        // For simplicity, we filter by course if provided.
        // If no courseId provided and it's a teacher, we might want to return all their tasks.
        if (user.role === 'teacher' && !courseId) {
            query.teacherId = user._id;
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: tasks });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        
        // Clean up mcqQuestions if not MCQ type to avoid validation errors
        if (body.type !== 'MCQ') {
            body.mcqQuestions = [];
        }

        await dbConnect();

        const task = await Task.create({
            ...body,
            teacherId: user._id,
        });

        return NextResponse.json({ success: true, data: task }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
