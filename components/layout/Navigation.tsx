'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/talents', label: 'Talents' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav aria-label="Main navigation">
      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)] font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-light)] transition-colors duration-[var(--transition-fast)]"
          >
            Sign In
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="md:hidden p-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)]"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="absolute top-16 left-0 right-0 bg-[var(--background)] border-b border-[var(--color-neutral-200)] md:hidden"
        >
          <ul className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-50)] rounded-[var(--radius-md)] font-medium transition-colors duration-[var(--transition-fast)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block text-center px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-light)] transition-colors duration-[var(--transition-fast)]"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
