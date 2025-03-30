// middleware.js
import Cookies from 'js-cookie';
import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Define the protected routes
    if (pathname.startsWith('/game') || pathname.startsWith('/profile')) {
        // Retrieve the token from cookies
        const token = request.cookies.get('accessToken');
        // If token doesn't exist, redirect to /signin
        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = '/signin';
            return NextResponse.redirect(url);
        }
    }

    // For all other routes, continue
    return NextResponse.next();
}

// Specify which routes the middleware should run on
export const config = {
    matcher: ['/game/:path*', '/profile/:path*'],
};
