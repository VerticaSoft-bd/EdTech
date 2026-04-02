import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Error in /api/users/me:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
