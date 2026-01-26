import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

const { auth } = NextAuth(authConfig);

// Supported locales
const locales = ['fr', 'en', 'ar'];
const defaultLocale = 'fr';

// Security headers to add to all responses
const securityHeaders = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
};

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && locales.includes(firstSegment)) {
    return firstSegment;
  }
  return null;
}

// Routes that are NOT locale-aware (don't add locale prefix)
const nonLocaleRoutes = [
  '/talents',
  '/admin',
  '/dashboard',
  '/login',
  '/register',
  '/verify-email',
  '/invite',
  '/payment',
  '/messages',
  '/collections',
  '/notifications',
  '/settings',
  '/contact-requests',
];

function isNonLocaleRoute(pathname: string): boolean {
  return nonLocaleRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

// Check if a pathname is a locale-prefixed non-locale route (e.g., /fr/talents)
function getLocalePrefixedNonLocaleRoute(
  pathname: string
): { locale: string; route: string } | null {
  for (const locale of locales) {
    const prefix = `/${locale}`;
    if (pathname.startsWith(prefix)) {
      const restPath = pathname.slice(prefix.length) || '/';
      if (isNonLocaleRoute(restPath)) {
        return { locale, route: restPath };
      }
    }
  }
  return null;
}

// Combine auth and locale middleware
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Skip locale handling for API routes
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Check if this is a locale-prefixed non-locale route (e.g., /fr/talents -> /talents)
  const localePrefixedRoute = getLocalePrefixedNonLocaleRoute(pathname);
  if (localePrefixedRoute) {
    const url = req.nextUrl.clone();
    url.pathname = localePrefixedRoute.route;
    const response = NextResponse.redirect(url);
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Skip locale handling for non-locale routes
  if (isNonLocaleRoute(pathname)) {
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Check if pathname already has a locale
  const pathnameLocale = getLocaleFromPathname(pathname);

  // If no locale in path, redirect to default locale (only for locale-aware routes)
  if (!pathnameLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    const response = NextResponse.redirect(url);

    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  // Continue with the request
  const response = NextResponse.next();

  // Add security headers to response
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
