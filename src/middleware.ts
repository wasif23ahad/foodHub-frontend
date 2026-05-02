import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/admin', '/provider', '/cart', '/checkout', '/orders', '/profile'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('token');

    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);

    // 1. Redirect unauthenticated users from protected routes
    if (isProtected && !sessionToken) {
        const loginUrl = new URL(`/login`, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Redirect authenticated users away from auth pages
    if (isAuthRoute && sessionToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/provider/:path*',
        '/cart',
        '/checkout/:path*',
        '/orders/:path*',
        '/profile/:path*',
    ],
};
