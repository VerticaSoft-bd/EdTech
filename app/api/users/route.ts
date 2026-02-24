import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ['admin', 'student', 'teacher', 'staff'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { success: false, message: 'Invalid role provided' },
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
            role,
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
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully.`,
            data: userWithoutPassword
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create User Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during user creation' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        await connectToDatabase();

        // Build query based on role if provided
        const query = role ? { role } : {};

        // Fetch users, excluding password field, sort by newest first
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: users
        });
    } catch (error: any) {
        console.error("Fetch Users Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred while fetching users' },
            { status: 500 }
        );
    }
}
