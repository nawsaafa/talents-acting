import Link from 'next/link';
import { getDashboardStats } from '@/lib/admin/queries';
import { StatCard } from '@/components/admin/StatCard';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <h1
          className="relative text-4xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Dashboard
        </h1>
        <p className="relative mt-2 text-[var(--color-text-secondary)]">
          Overview of platform activity and pending validations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Validations"
          value={stats.totalPending}
          description="Requires attention"
          trend={stats.totalPending > 0 ? 'up' : 'neutral'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Active Talents"
          value={stats.activeTalents}
          description="Approved and public"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="All registered users"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Pending Talents"
          value={stats.pendingTalents}
          description="Awaiting review"
          trend={stats.pendingTalents > 0 ? 'up' : 'neutral'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          className="text-xl font-semibold text-[var(--color-text-primary)] mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pending Talents */}
          <QuickActionCard
            title="Pending Talents"
            count={stats.pendingTalents}
            description="Talent profiles awaiting validation"
            href="/admin/talents"
            color="gold"
          />

          {/* Pending Professionals */}
          <QuickActionCard
            title="Pending Professionals"
            count={stats.pendingProfessionals}
            description="Professional registrations awaiting validation"
            href="/admin/professionals"
            color="blue"
          />

          {/* Pending Companies */}
          <QuickActionCard
            title="Pending Companies"
            count={stats.pendingCompanies}
            description="Company registrations awaiting validation"
            href="/admin/companies"
            color="purple"
          />

          {/* Contact Requests */}
          <QuickActionCard
            title="Contact Requests"
            count={stats.totalContactRequests}
            description={`${stats.pendingContactRequests} pending requests`}
            href="/admin/contact-requests"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  count: number;
  description: string;
  href: string;
  color: 'gold' | 'blue' | 'purple' | 'green';
}

function QuickActionCard({ title, count, description, href, color }: QuickActionCardProps) {
  const colorStyles = {
    gold: {
      badge: 'bg-[var(--color-gold)]/20 text-[var(--color-gold)] border-[var(--color-gold)]/30',
      hover: 'group-hover:border-[var(--color-gold)]/40',
      glow: 'group-hover:shadow-[var(--color-gold)]/10',
    },
    blue: {
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      hover: 'group-hover:border-blue-500/40',
      glow: 'group-hover:shadow-blue-500/10',
    },
    purple: {
      badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      hover: 'group-hover:border-purple-500/40',
      glow: 'group-hover:shadow-purple-500/10',
    },
    green: {
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      hover: 'group-hover:border-emerald-500/40',
      glow: 'group-hover:shadow-emerald-500/10',
    },
  };

  const styles = colorStyles[color];

  return (
    <Link
      href={href}
      className={`
        relative block p-6 rounded-2xl
        bg-gradient-to-br from-[var(--color-surface)]/80 to-[var(--color-charcoal)]/50
        border border-[var(--color-surface-light)]/20 ${styles.hover}
        shadow-xl ${styles.glow}
        transition-all duration-500 group
        hover:-translate-y-1
      `}
    >
      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[80px]" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">
            {title}
          </h3>
          <span className={`px-2.5 py-1 text-sm font-bold rounded-lg border ${styles.badge}`}>
            {count}
          </span>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm font-medium text-[var(--color-gold)] group-hover:text-[var(--color-gold-light)] transition-colors">
          View queue
          <svg
            className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
