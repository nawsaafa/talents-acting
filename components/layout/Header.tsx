'use client';

import Link from 'next/link';
import { Container } from './Container';
import { Navigation } from './Navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthStatus } from '@/components/auth';

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--color-neutral-200)] bg-[var(--background)]"
      role="banner"
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-lg"
            aria-label="Talents Acting - Go to homepage"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white font-bold"
              aria-hidden="true"
            >
              TA
            </div>
            <span className="text-xl font-semibold text-[var(--color-neutral-900)]">
              Talents Acting
            </span>
          </Link>

          {/* Navigation, Language Switcher, and Auth */}
          <nav className="flex items-center gap-4" role="navigation" aria-label="Main navigation">
            <Navigation />
            <LanguageSwitcher />
            <AuthStatus />
          </nav>
        </div>
      </Container>
    </header>
  );
}
