import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { password } = await request.json();

        if (!password || password.length < 6) {
            return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
        }

        await connectToDatabase();

        // Update password and clear setup flag
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        dbUser.password = password;
        dbUser.needsPasswordSetup = false;
        await dbUser.save();

        return NextResponse.json({
            success: true,
            message: 'Password set successfully'
        });

    } catch (error: any) {
        console.error("Setup Password Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
