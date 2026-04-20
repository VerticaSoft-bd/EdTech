import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
        }

        await connectToDatabase();

        // Find user with this magic token and check expiry
        const user = await User.findOne({
            magicLoginToken: token,
            magicLoginTokenExpires: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.redirect(new URL('/login?error=invalid_or_expired_token', request.url));
        }

        // Generate JWT Token
        const jwtToken = await signToken({
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            name: user.name
        });

        // Clear the token so it's single-use (optional, but safer)
        user.magicLoginToken = undefined;
        user.magicLoginTokenExpires = undefined;
        await user.save();

        // Redirect to dashboard with setup flag
        const response = NextResponse.redirect(new URL('/student-dashboard?setup=true', request.url));

        // Set HTTP-Only Cookie on the response
        response.cookies.set({
            name: 'token',
            value: jwtToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Lax is better for external redirect entry
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;

    } catch (error: any) {
        console.error("Magic Login Error:", error);
        return NextResponse.redirect(new URL('/login?error=internal_error', request.url));
    }
}
