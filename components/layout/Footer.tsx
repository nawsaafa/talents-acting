import Link from 'next/link';
import { Container } from './Container';

const footerLinks = {
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
  ],
  resources: [
    { href: '/talents', label: 'Browse Talents' },
    { href: '/faq', label: 'FAQ' },
    { href: '/blog', label: 'Blog' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white font-bold">
                  TA
                </div>
                <span className="text-xl font-semibold text-[var(--color-neutral-900)]">
                  Talents Acting
                </span>
              </Link>
              <p className="mt-4 text-sm text-[var(--color-neutral-600)]">
                Connecting talented actors, comedians, and performers with film professionals and
                opportunities.
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-neutral-900)] uppercase tracking-wide">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-neutral-900)] uppercase tracking-wide">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-neutral-900)] uppercase tracking-wide">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-[var(--color-neutral-200)] pt-8">
            <p className="text-center text-sm text-[var(--color-neutral-500)]">
              &copy; {currentYear} Talents Acting. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
