import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, event: NextFetchEvent) {
    const { pathname, origin } = request.nextUrl;
    const authCookie = request.cookies.get('token');

    // Track Web Requests without blocking
    try {
        event.waitUntil(
            fetch(`${origin}/api/analytics/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: pathname,
                    method: request.method,
                    ip: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
                    userAgent: request.headers.get('user-agent') || 'unknown',
                }),
                keepalive: true,
            }).catch(() => {})
        );
    } catch (e) {
        // Ignore telemetry errors
    }

    // Handle "My Courses" redirect
    if (pathname === '/my-courses') {
        if (!authCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
            const { payload } = await jwtVerify(authCookie.value, secret);
            const userRole = payload.role as string;

            if (userRole === 'student') {
                return NextResponse.redirect(new URL('/student-dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 1. Unauthenticated users trying to access protected dashboard routes
    const isDashboardPath = pathname.startsWith('/dashboard');
    const isStudentDashboardPath = pathname.startsWith('/student-dashboard');
    const isTeacherDashboardPath = pathname.startsWith('/teacher-dashboard');

    if (isDashboardPath || isStudentDashboardPath || isTeacherDashboardPath) {
        if (!authCookie) {
            console.log(`Middleware: No token cookie, redirecting ${pathname} to /login`);
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // 2. Role-Based Access Control (RBAC)
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
            const { payload } = await jwtVerify(authCookie.value, secret);
            const userRole = payload.role as string;

            // Student Access Logic
            if (isStudentDashboardPath) {
                if (userRole === 'teacher') return NextResponse.redirect(new URL('/teacher-dashboard', request.url));
                if (userRole !== 'student') return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // Admin/Teacher Dashboard Access Logic
            if (isDashboardPath) {
                if (userRole === 'student') return NextResponse.redirect(new URL('/student-dashboard', request.url));
                // Allow admin, staff, and teacher (no redirect needed here as they are allowed)
            }
        } catch (error) {
            console.log(`Middleware: Token invalid/expired, redirecting ${pathname} to /login`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. Prevent authenticated users from visiting the login/signup pages
    if (pathname === '/login' || pathname === '/signup') {
        if (authCookie) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
                const { payload } = await jwtVerify(authCookie.value, secret);

                if (payload.role === 'student') {
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
