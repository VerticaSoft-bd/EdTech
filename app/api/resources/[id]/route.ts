import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Resource from '@/models/Resource';
import Student from '@/models/Student';
import User from '@/models/User';
import Notification from '@/models/Notification';
import Course from '@/models/Course';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getAuthenticatedUser();
        if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        await connectToDatabase();

        const oldResource = await Resource.findById(id);
        if (!oldResource) {
            return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404 });
        }

        const resource = await Resource.findByIdAndUpdate(id, body, { new: true });

        // Trigger notifications if published now and wasn't before
        if (resource?.isPublished && !oldResource.isPublished) {
            const course = await Course.findById(resource.courseId);
            if (course) {
                // Find all students enrolled in this course
                const students = await Student.find({ courseName: course.title }).select('email');
                const studentEmails = students.map(s => s.email);
                
                // Find user records for these students
                const users = await User.find({ email: { $in: studentEmails } }).select('_id');
                
                // Create notifications for each user
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getAuthenticatedUser();
        if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        await Resource.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Resource deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
