import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const userSession = await getAuthenticatedUser();
        if (!userSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { newPassword, confirmPassword } = await req.json();
        
        if (!newPassword || !confirmPassword) {
            return NextResponse.json({ error: 'New password and confirmation are required' }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: userSession.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update password and reset attempts
        user.password = newPassword;
        user.passwordChangeAttempts = 0;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password changed successfully' });

    } catch (error: any) {
        console.error("Error changing password:", error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
