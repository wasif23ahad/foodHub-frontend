import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/admin', '/provider', '/cart', '/checkout', '/orders', '/profile'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    if (!isProtected) return NextResponse.next();

    // Check for our custom JWT token cookie
    const sessionToken = request.cookies.get('token');

    if (!sessionToken) {
        const loginUrl = new URL(`/login`, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
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
