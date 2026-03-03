import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // 1. Unauthenticated users trying to access dashboard routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/student-dashboard')) {
        if (!authCookie) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // 2. Role-Based Access Control (RBAC)
        try {
            // Decode the token using `jose` which is Edge-compatible
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
            const { payload } = await jwtVerify(authCookie.value, secret);
            const userRole = payload.role as string;

            // If a 'student' or 'teacher' tries to access the main Admin dashboard or any other admin pages
            if ((userRole === 'student' || userRole === 'teacher') && pathname.startsWith('/dashboard')) {
                // Force them to only see their student dashboard
                return NextResponse.redirect(new URL('/student-dashboard', request.url));
            }

            // If an Admin tries to access the student-dashboard, redirect them to the main admin dashboard
            if (userRole !== 'student' && userRole !== 'teacher' && pathname.startsWith('/student-dashboard')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

        } catch (error) {
            // Token is invalid or expired
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 3. Prevent authenticated users from visiting the login/signup pages
    if (pathname === '/login' || pathname === '/signup') {
        if (authCookie) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
                const { payload } = await jwtVerify(authCookie.value, secret);

                if (payload.role === 'student' || payload.role === 'teacher') {
                    return NextResponse.redirect(new URL('/student-dashboard', request.url));
                } else {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            } catch (error) {
                // If token verify fails, just let them go to the login page to re-authenticate
            }
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
