import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const url = request.nextUrl;

    if (url.pathname.startsWith('/api/draft')) {
        return NextResponse.next();
    }

    const cookies = request.cookies;

    const hasWordpressCookie = cookies.getAll().some(cookie =>
        cookie.name.startsWith('wordpress_logged_in_')
    );

    const hasDraftCookie = cookies.has('__prerender_bypass');

    if (hasWordpressCookie && !hasDraftCookie) {
        const currentPath = url.pathname + url.search;

        const redirectUrl = url.clone();
        redirectUrl.pathname = '/api/draft';
        redirectUrl.searchParams.set('redirect', currentPath);

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|.*\\.png$).*)',
    ],
}
