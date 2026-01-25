import createMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { locales, defaultLocale } from '@/i18n/config';

const { auth } = NextAuth(authConfig);

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

  // The authorized callback in authConfig handles route protection
  return response;
});

export const config = {
  matcher: [
    // Match all routes except static files and api routes (except auth)
    '/((?!_next/static|_next/image|favicon.ico|api(?!/auth)).*)',
  ],
};
