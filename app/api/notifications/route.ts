import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notification';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const notifications = await Notification.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const unreadCount = await Notification.countDocuments({ userId: user._id, isRead: false });

        return NextResponse.json({ 
            success: true, 
            data: {
                notifications,
                unreadCount
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        await Notification.updateMany(
            { userId: user._id, isRead: false },
            { $set: { isRead: true } }
        );

        return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
