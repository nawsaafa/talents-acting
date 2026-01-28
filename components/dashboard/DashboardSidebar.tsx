'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface DashboardSidebarProps {
  userRole: 'TALENT' | 'PROFESSIONAL' | 'COMPANY' | 'ADMIN';
  userName?: string;
  pendingRequests?: number;
}

export function DashboardSidebar({ userRole, userName, pendingRequests }: DashboardSidebarProps) {
  const pathname = usePathname();

  const getNavItems = (): NavItem[] => {
    switch (userRole) {
      case 'TALENT':
        return [
          {
            label: 'My Profile',
            href: '/dashboard/profile',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
          },
          {
            label: 'Edit Profile',
            href: '/dashboard/profile/edit',
            icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
          },
          {
            label: 'Media Gallery',
            href: '/dashboard/profile/media',
            icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
          },
          {
            label: 'Contact Requests',
            href: '/dashboard/requests',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            badge: pendingRequests,
          },
          {
            label: 'Billing',
            href: '/dashboard/talent/billing',
            icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
          },
        ];
      case 'PROFESSIONAL':
        return [
          {
            label: 'Dashboard',
            href: '/dashboard/professional',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
          },
          {
            label: 'Browse Talents',
            href: '/talents',
            icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
          },
          {
            label: 'My Profile',
            href: '/dashboard/professional/profile',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
          },
          {
            label: 'Contact Requests',
            href: '/dashboard/requests',
            icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
            badge: pendingRequests,
          },
          {
            label: 'Billing',
            href: '/dashboard/professional/billing',
            icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
          },
        ];
      case 'COMPANY':
        return [
          {
            label: 'Dashboard',
            href: '/dashboard/company',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
          },
          {
            label: 'Browse Talents',
            href: '/talents',
            icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
          },
          {
            label: 'Company Profile',
            href: '/dashboard/company/profile',
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
          },
          {
            label: 'Team',
            href: '/dashboard/company/team',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
          },
          {
            label: 'Contact Requests',
            href: '/dashboard/requests',
            icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
            badge: pendingRequests,
          },
          {
            label: 'Billing',
            href: '/dashboard/company/billing',
            icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === '/dashboard/profile' && pathname === '/dashboard/profile') return true;
    if (href === '/dashboard/professional' && pathname === '/dashboard/professional') return true;
    if (href === '/dashboard/company' && pathname === '/dashboard/company') return true;
    if (
      href !== '/dashboard/profile' &&
      href !== '/dashboard/professional' &&
      href !== '/dashboard/company'
    ) {
      return pathname.startsWith(href);
    }
    return false;
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'TALENT':
        return 'Talent';
      case 'PROFESSIONAL':
        return 'Professional';
      case 'COMPANY':
        return 'Company';
      default:
        return 'User';
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'TALENT':
        return 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z';
      case 'PROFESSIONAL':
        return 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z';
      case 'COMPANY':
        return 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z';
      default:
        return 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z';
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-[var(--color-charcoal)] to-[var(--color-black)] border-r border-[var(--color-surface-light)]/30 z-20 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[var(--color-surface-light)]/20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-gold)]/20 group-hover:shadow-[var(--color-gold)]/40 transition-all duration-300">
            <svg
              className="w-5 h-5 text-[var(--color-black)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={getRoleIcon()} />
            </svg>
          </div>
          <div>
            <span
              className="text-xl font-bold text-[var(--color-gold)]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {getRoleLabel()}
            </span>
            <span className="text-xl font-light text-[var(--color-text-secondary)] ml-1">
              Portal
            </span>
          </div>
        </Link>
        {userName && (
          <div className="mt-4 px-3 py-2 bg-[var(--color-surface)]/30 border border-[var(--color-surface-light)]/20 rounded-lg">
            <p className="text-xs text-[var(--color-text-muted)]">Welcome back,</p>
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {userName}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
          Menu
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
          <p className="text-[10px] text-[var(--color-text-muted)]">Talents Acting v1.0</p>
        </div>
      </div>
    </aside>
  );
}
