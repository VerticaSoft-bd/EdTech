import { SignJWT, jwtVerify } from 'jose';
import mongoose from 'mongoose';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-at-least-32-characters-long'
);

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // 7 days expiration
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

import { cookies, headers } from 'next/headers';

export async function getAuthenticatedUser(req?: NextRequest) {
    let token: string | undefined;

    if (req) {
        token = req.cookies.get('token')?.value || req.headers.get('authorization')?.split(' ')[1];
    } else {
        const cookieStore = await cookies();
        token = cookieStore.get('token')?.value;

        if (!token) {
            const headersList = await headers();
            token = headersList.get('authorization')?.split(' ')[1];
        }
    }

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload || !payload.id) return null;

    await dbConnect();

    // Ensure ID is a string to prevent CastErrors if token payload is malformed
    const userId = String(payload.id);

    try {
        const user = await User.findById(userId).select('-password');
        return user;
    } catch (error) {
        console.error('Auth User Fetch Error:', error);
        return null;
    }
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
