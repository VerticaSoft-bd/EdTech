import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Required for creating secure, server-side cookies
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide both email and password' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // 1. Check if user exists (We use +password because the model naturally hides it)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials. User not found.' },
                { status: 401 }
            );
        }

        // 2. Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials. Password incorrect.' },
                { status: 401 }
            );
        }

        // 3. Generate JWT Token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined in environment variables!");
            return NextResponse.json(
                { success: false, message: 'Internal Server Error: Missing JWT config' },
                { status: 500 }
            );
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '30d' } // Token lives for 30 days
        );

        // 4. Set HTTP-Only Cookie to automatically attach to future browser requests
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: token,
            httpOnly: true, // Prevents Javascript from reading it (XSS protection)
            secure: process.env.NODE_ENV === 'production', // Use secure cookies via HTTPS in production
            sameSite: 'strict', // Protects against CSRF attacks
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        });

        // 5. Send User Data Payload back to Frontend
        const userPayload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            staffPermissions: user.staffPermissions || [],
        };

        return NextResponse.json({
            success: true,
            message: 'Login successful.',
            data: userPayload,
            token: token
        }, { status: 200 });

    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during login' },
            { status: 500 }
        );
    }
}
