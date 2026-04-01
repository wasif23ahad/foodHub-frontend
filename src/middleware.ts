import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/admin', '/provider', '/cart', '/checkout', '/orders', '/profile'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
    if (!isProtected) return NextResponse.next();

    // BetterAuth sets a session cookie — check for its presence
    // The cookie name varies between HTTP (dev) and HTTPS (prod)
    const sessionCookie =
        request.cookies.get('better-auth.session_token') ||
        request.cookies.get('__Secure-better-auth.session_token');

    if (!sessionCookie) {
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
