import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Resource from '@/models/Resource';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const moduleId = searchParams.get('moduleId');

        if (!courseId) {
            return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
        }

        await connectToDatabase();

        const query: any = { courseId };
        if (moduleId) query.moduleId = moduleId;

        const resources = await Resource.find(query).sort({ order: 1, createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: resources });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { courseId, moduleId, title, description, type, url, isPublished } = body;

        if (!courseId || !moduleId || !title || !type || !url) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        const resource = await Resource.create({
            courseId,
            moduleId,
            title,
            description,
            type,
            url,
            isPublished: isPublished || false,
            order: body.order || 0
        });

        // Trigger notifications if published immediately
        if (resource.isPublished) {
            const Course = (await import('@/models/Course')).default;
            const Student = (await import('@/models/Student')).default;
            const User = (await import('@/models/User')).default;
            const Notification = (await import('@/models/Notification')).default;

            const course = await Course.findById(resource.courseId);
            if (course) {
                const students = await Student.find({ courseName: course.title }).select('email');
                const studentEmails = students.map(s => s.email);
                const users = await User.find({ email: { $in: studentEmails } }).select('_id');
                
                const notifications = users.map(u => ({
                    userId: u._id,
                    title: 'New Resource Published',
                    message: `A new resource "${resource.title}" has been published in ${course.title}.`,
                    link: `/student-dashboard/courses/${course.slug}/progress`
                }));

                if (notifications.length > 0) {
                    await Notification.insertMany(notifications);
                }
            }
        }

        return NextResponse.json({ success: true, data: resource });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
