import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const authCookie = request.cookies.get('auth_token');
    const { pathname } = request.nextUrl;

    // 1. Protect all /dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!authCookie) {
            // Redirect unauthenticated users to the login page
            const loginUrl = new URL('/login', request.url);
            // Optionally pass the original URL as a 'callbackUrl' query param if you want them to return after logging in
            return NextResponse.redirect(loginUrl);
        }
    }

    // 2. Prevent authenticated users from visiting the login page
    if (pathname === '/login' || pathname === '/') {
        if (authCookie) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
