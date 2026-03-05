import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: '',
            path: '/',
            maxAge: 0,
        });

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully.'
        }, { status: 200 });

    } catch (error: any) {
        console.error("Logout Error:", error);
        return NextResponse.json(
            { success: false, message: 'An error occurred during logout' },
            { status: 500 }
        );
    }
}
