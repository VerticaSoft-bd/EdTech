import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { sendSMS } from '@/lib/sms';
import SiteSettings from '@/models/SiteSettings';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, mobileNo } = body;

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json(
                { success: false, message: 'A user with this email already exists' },
                { status: 409 }
            );
        }

        // Create the user (password hashing is handled by the pre-save hook in models/User.ts)
        const user = await User.create({
            name,
            email,
            password,
            mobileNo
        });

        // Send welcome SMS
        if (mobileNo) {
            const settings = await SiteSettings.findOne().lean();
            const template = (settings as any)?.smsTemplates?.newUserStudent || 
                             (settings as any)?.smsTemplates?.['newUserStudent'] ||
                             `Congratulations [NAME]! Your account has been created successfully. Welcome to EdTech.`;
            const smsMessage = template.replace(/\[NAME\]/g, name);
            await sendSMS(mobileNo, smsMessage);
        }

        // Remove password from response for security
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // Generate JWT token for auto-login
        const token = await signToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Set token in HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            message: 'User registered and logged in successfully',
            data: userWithoutPassword,
            token
        }, { status: 201 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
