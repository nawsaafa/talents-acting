'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface AdminSidebarProps {
  pendingCounts?: {
    talents: number;
    professionals: number;
    companies: number;
  };
}

export function AdminSidebar({ pendingCounts }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      label: 'Talents',
      href: '/admin/talents',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      badge: pendingCounts?.talents,
    },
    {
      label: 'Professionals',
      href: '/admin/professionals',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      badge: pendingCounts?.professionals,
    },
    {
      label: 'Companies',
      href: '/admin/companies',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      badge: pendingCounts?.companies,
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
    {
      label: 'Options',
      href: '/admin/options',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const totalPending =
    (pendingCounts?.talents || 0) +
    (pendingCounts?.professionals || 0) +
    (pendingCounts?.companies || 0);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[var(--color-charcoal)] to-[var(--color-black)] border-r border-[var(--color-surface-light)]/30 z-20 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[var(--color-surface-light)]/20">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-gold)]/20 group-hover:shadow-[var(--color-gold)]/40 transition-all duration-300">
            <svg
              className="w-5 h-5 text-[var(--color-black)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span
              className="text-xl font-bold text-[var(--color-gold)]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Admin
            </span>
            <span className="text-xl font-light text-[var(--color-text-secondary)] ml-1">
              Panel
            </span>
          </div>
        </Link>
        {totalPending > 0 && (
          <div className="mt-4 px-3 py-2 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 rounded-lg">
            <p className="text-xs text-[var(--color-gold)] font-medium">
              {totalPending} pending validation{totalPending !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
          Management
        </p>
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <li
                key={item.href}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
                    ${
                      active
                        ? 'bg-gradient-to-r from-[var(--color-gold)]/15 to-transparent text-[var(--color-gold)] shadow-lg shadow-[var(--color-gold)]/5'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]/50'
                    }
                  `}
                >
                  {/* Active indicator line */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-r-full" />
                  )}
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={item.icon}
                    />
                  </svg>
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[var(--color-black)] rounded-full shadow-lg shadow-[var(--color-gold)]/30 animate-pulse-gold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-surface-light)]/20">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-surface)]/30 transition-all duration-300 group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium">Back to Site</span>
        </Link>
        <div className="mt-4 px-3">
          <p className="text-[10px] text-[var(--color-text-muted)]">Talents Acting Admin v1.0</p>
        </div>
      </div>
    </aside>
  );
}
