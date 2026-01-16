import Link from 'next/link';
import { getDashboardStats } from '@/lib/admin/queries';
import { StatCard } from '@/components/admin/StatCard';
import { Card } from '@/components/ui/Card';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">Dashboard</h1>
        <p className="mt-1 text-[var(--color-neutral-600)]">
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
                strokeWidth={2}
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
                strokeWidth={2}
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
                strokeWidth={2}
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
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Talents */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
              Pending Talents
            </h2>
            <span className="px-2 py-1 text-sm font-medium bg-[var(--color-warning-50)] text-[var(--color-warning)] rounded-full">
              {stats.pendingTalents}
            </span>
          </div>
          <p className="text-[var(--color-neutral-600)] mb-4">
            Talent profiles awaiting validation
          </p>
          <Link
            href="/admin/talents"
            className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            View queue
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Card>

        {/* Pending Professionals */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
              Pending Professionals
            </h2>
            <span className="px-2 py-1 text-sm font-medium bg-[var(--color-warning-50)] text-[var(--color-warning)] rounded-full">
              {stats.pendingProfessionals}
            </span>
          </div>
          <p className="text-[var(--color-neutral-600)] mb-4">
            Professional registrations awaiting validation
          </p>
          <Link
            href="/admin/professionals"
            className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            View queue
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Card>

        {/* Pending Companies */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
              Pending Companies
            </h2>
            <span className="px-2 py-1 text-sm font-medium bg-[var(--color-warning-50)] text-[var(--color-warning)] rounded-full">
              {stats.pendingCompanies}
            </span>
          </div>
          <p className="text-[var(--color-neutral-600)] mb-4">
            Company registrations awaiting validation
          </p>
          <Link
            href="/admin/companies"
            className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            View queue
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </Card>
      </div>
    </div>
  );
}
