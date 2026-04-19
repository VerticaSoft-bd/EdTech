import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { sendSMS } from '@/lib/sms';

export async function POST(request: Request) {
    try {
        const { mobileNo, action, otp, newPassword } = await request.json();
        await connectToDatabase();

        if (action === 'request-otp') {
            if (!mobileNo) {
                return NextResponse.json({ success: false, message: 'Please provide a mobile number' }, { status: 400 });
            }

            const user = await User.findOne({ mobileNo });
            if (!user) {
                return NextResponse.json({ success: false, message: 'No user found with this mobile number' }, { status: 404 });
            }

            // Generate 6-digit OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Set OTP and expiry (10 minutes)
            user.resetPasswordOTP = generatedOtp;
            user.resetPasswordOTPExpire = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();

            // Send SMS
            const smsResult = await sendSMS(mobileNo, `Your EdTech password reset OTP is ${generatedOtp}. It will expire in 10 minutes.`);

            if (!smsResult.success) {
                return NextResponse.json({ success: false, message: 'Failed to send SMS. Please try again.' }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'OTP sent successfully' });
        }

        if (action === 'reset-password') {
            if (!mobileNo || !otp || !newPassword) {
                return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
            }

            const user = await User.findOne({ 
                mobileNo, 
                resetPasswordOTP: otp,
                resetPasswordOTPExpire: { $gt: Date.now() }
            });

            if (!user) {
                return NextResponse.json({ success: false, message: 'Invalid or expired OTP' }, { status: 400 });
            }

            // Update password
            user.password = newPassword;
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            await user.save();

            return NextResponse.json({ success: true, message: 'Password reset successfully' });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}
