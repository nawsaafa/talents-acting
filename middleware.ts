import createMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { locales, defaultLocale } from '@/i18n/config';

const { auth } = NextAuth(authConfig);

// Security headers to add to all responses
const securityHeaders = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
};

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

// Combine auth and intl middleware
export default auth((req) => {
  // Apply i18n middleware
  const response = intlMiddleware(req);

  // Add security headers to response
  if (response) {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // The authorized callback in authConfig handles route protection
  return response;
});

export const config = {
  matcher: [
    // Match all routes except static files and api routes (except auth)
    '/((?!_next/static|_next/image|favicon.ico|api(?!/auth)).*)',
  ],
};
