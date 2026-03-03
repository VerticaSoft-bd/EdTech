import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

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
        });

        // Remove password from response for security
        const userWithoutPassword = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // Generate JWT token for auto-login
        const token = await signToken({
            userId: user._id.toString(),
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
