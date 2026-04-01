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

        const { password } = await req.json();
        if (!password) {
            return NextResponse.json({ error: 'Password is required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: userSession.email }).select('+password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check for lockout (3 failed attempts within 24 hours)
        const now = new Date();
        const lockoutPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (user.passwordChangeAttempts >= 3 && user.lastPasswordAttemptAt) {
            const timeSinceLastAttempt = now.getTime() - new Date(user.lastPasswordAttemptAt).getTime();
            if (timeSinceLastAttempt < lockoutPeriod) {
                const remainingTime = Math.ceil((lockoutPeriod - timeSinceLastAttempt) / (60 * 60 * 1000));
                return NextResponse.json({ 
                    error: `You have reached the maximum number of attempts (3). Please try again in ${remainingTime} hour(s).` 
                }, { status: 429 });
            } else {
                // Period has passed, reset counter
                user.passwordChangeAttempts = 0;
            }
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            // Increment attempts and update timestamp
            user.passwordChangeAttempts = (user.passwordChangeAttempts || 0) + 1;
            user.lastPasswordAttemptAt = now;
            await user.save();

            const remainingAttempts = 3 - user.passwordChangeAttempts;
            return NextResponse.json({ 
                error: remainingAttempts > 0 
                  ? `Incorrect password. ${remainingAttempts} attempts remaining.` 
                  : "Incorrect password. You are now locked out for 24 hours." 
            }, { status: 401 });
        }

        // Success: Reset attempts counter
        user.passwordChangeAttempts = 0;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password verified successfully' });

    } catch (error: any) {
        console.error("Error verifying password:", error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
