import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
        
        // Construct the full magic login URL
        const magicLoginUrl = new URL(`/api/auth/magic-login?token=${token}`, appUrl);
        
        // Redirect to the actual magic login handler
        return NextResponse.redirect(magicLoginUrl);
    } catch (error) {
        console.error("Short URL Redirect Error:", error);
        return NextResponse.redirect(new URL('/login?error=invalid_link', request.url));
    }
}
