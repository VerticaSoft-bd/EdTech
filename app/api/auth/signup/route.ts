import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

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

        return NextResponse.json({
            success: true,
            message: 'User registered successfully. Please login.',
            data: userWithoutPassword
        }, { status: 201 });

    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
