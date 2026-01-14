'use client';

import Link from 'next/link';
import { Container } from './Container';
import { Navigation } from './Navigation';
import { AuthStatus } from '@/components/auth';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-neutral-200)] bg-[var(--background)]">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white font-bold">
              TA
            </div>
            <span className="text-xl font-semibold text-[var(--color-neutral-900)]">
              Talents Acting
            </span>
          </Link>

          {/* Navigation and Auth */}
          <div className="flex items-center gap-6">
            <Navigation />
            <AuthStatus />
          </div>
        </div>
      </Container>
    </header>
  );
}
