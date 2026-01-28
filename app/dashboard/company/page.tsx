import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { getCompanyByUserId } from '@/lib/company/queries';
import { getCompanySubscription } from '@/lib/payment/queries';
import { hasActiveAccess } from '@/lib/payment/subscription';
import { TeamManagement } from '@/components/company/TeamManagement';
import { CompanyActivitySection } from '@/components/activity';

export const metadata: Metadata = {
  title: 'Company Dashboard - Talents Acting',
  description: 'Manage your company account on Talents Acting',
};

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Review',
    color: 'text-[var(--color-gold)]',
    bgColor: 'bg-[var(--color-gold)]/20',
    borderColor: 'border-[var(--color-gold)]/30',
  },
  APPROVED: {
    label: 'Approved',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
  },
  SUSPENDED: {
    label: 'Suspended',
    color: 'text-[var(--color-text-muted)]',
    bgColor: 'bg-[var(--color-surface-light)]/20',
    borderColor: 'border-[var(--color-surface-light)]/30',
  },
};

const SUBSCRIPTION_CONFIG = {
  NONE: {
    label: 'No Subscription',
    color: 'text-[var(--color-text-muted)]',
    bgColor: 'bg-[var(--color-surface-light)]/20',
  },
  TRIAL: { label: 'Trial', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  ACTIVE: { label: 'Active', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  PAST_DUE: { label: 'Past Due', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  EXPIRED: {
    label: 'Expired',
    color: 'text-[var(--color-text-muted)]',
    bgColor: 'bg-[var(--color-surface-light)]/20',
  },
};

export default async function CompanyDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [company, subscription] = await Promise.all([
    getCompanyByUserId(session.user.id),
    getCompanySubscription(session.user.id),
  ]);

  if (!company) {
    redirect('/register/company');
  }

  const isApproved = company.validationStatus === 'APPROVED';
  const isPending = company.validationStatus === 'PENDING';
  const isRejected = company.validationStatus === 'REJECTED';
  const hasPremiumAccess = hasActiveAccess(subscription?.status || 'NONE');
  const statusConfig = STATUS_CONFIG[company.validationStatus];
  const subscriptionConfig = SUBSCRIPTION_CONFIG[subscription?.status || 'NONE'];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {company.companyName}
            </h1>
            <p className="mt-2 text-[var(--color-text-secondary)]">Company Dashboard</p>
          </div>
          <span
            className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
          >
            <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Status Banners */}
      {isPending && (
        <div className="relative overflow-hidden rounded-2xl p-5 bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-gold)] to-[var(--color-gold-dark)]" />
          <div className="flex items-start gap-4 pl-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--color-gold)]/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[var(--color-gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-gold)]">Account Pending Review</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Your company account is being reviewed by our team. You will receive an email once
                your account is approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="relative overflow-hidden rounded-2xl p-5 bg-red-500/10 border border-red-500/30">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600" />
          <div className="flex items-start gap-4 pl-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-400">Account Rejected</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {company.rejectionReason ||
                  'Your company account was not approved. Please contact support for more information.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {!company.emailVerified && (
        <div className="relative overflow-hidden rounded-2xl p-5 bg-blue-500/10 border border-blue-500/30">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600" />
          <div className="flex items-start gap-4 pl-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400">Verify Your Email</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Please check your email and click the verification link to complete your
                registration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Section */}
      {isApproved && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[80px]" />
          <h2
            className="relative text-lg font-semibold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Activity Overview
          </h2>
          <div className="relative">
            <CompanyActivitySection />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Company Overview Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-gold)]/5 rounded-bl-[100px]" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    className="text-lg font-semibold text-[var(--color-text-primary)]"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Company Overview
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {company.industry || 'Industry not set'}
                  </p>
                </div>
              </div>

              {company.description && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  {company.description}
                </p>
              )}

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-[var(--color-surface-light)]/10 border border-[var(--color-surface-light)]/20">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Contact Email
                  </dt>
                  <dd className="mt-2 text-sm text-[var(--color-text-primary)]">
                    {company.contactEmail}
                  </dd>
                </div>
                {company.contactPhone && (
                  <div className="p-4 rounded-xl bg-[var(--color-surface-light)]/10 border border-[var(--color-surface-light)]/20">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Phone
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--color-text-primary)]">
                      {company.contactPhone}
                    </dd>
                  </div>
                )}
                {company.website && (
                  <div className="p-4 rounded-xl bg-[var(--color-surface-light)]/10 border border-[var(--color-surface-light)]/20">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Website
                    </dt>
                    <dd className="mt-2 text-sm">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
                      >
                        {company.website}
                      </a>
                    </dd>
                  </div>
                )}
                {(company.city || company.country) && (
                  <div className="p-4 rounded-xl bg-[var(--color-surface-light)]/10 border border-[var(--color-surface-light)]/20">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Location
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--color-text-primary)]">
                      {[company.city, company.country].filter(Boolean).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <Link
                  href="/dashboard/company/profile"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Company Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Team Management */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[80px]" />
            <div className="relative">
              <TeamManagement members={company.members} companyName={company.companyName} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-gold)]/5 rounded-bl-[60px]" />
            <h3
              className="relative text-sm font-semibold text-[var(--color-text-primary)] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Quick Actions
            </h3>
            <div className="relative space-y-2">
              {isApproved && (
                <Link
                  href="/talents"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-light)]/20 hover:bg-[var(--color-surface-light)]/40 text-[var(--color-text-primary)] transition-all duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-[var(--color-gold)] group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Browse Talents</span>
                </Link>
              )}
              <Link
                href="/dashboard/company/team"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-light)]/20 hover:bg-[var(--color-surface-light)]/40 text-[var(--color-text-primary)] transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-[var(--color-gold)] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Manage Team</span>
              </Link>
              <Link
                href="/dashboard/company/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-light)]/20 hover:bg-[var(--color-surface-light)]/40 text-[var(--color-text-primary)] transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-[var(--color-gold)] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="text-sm font-medium">Edit Profile</span>
              </Link>
              <Link
                href="/dashboard/company/billing"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-light)]/20 hover:bg-[var(--color-surface-light)]/40 text-[var(--color-text-primary)] transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-[var(--color-gold)] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                  />
                </svg>
                <span className="text-sm font-medium">Billing</span>
              </Link>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-gold)]/5 rounded-bl-[60px]" />
            <h3
              className="relative text-sm font-semibold text-[var(--color-text-primary)] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Subscription
            </h3>
            <div className="relative">
              <span
                className={`inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium ${subscriptionConfig.bgColor} ${subscriptionConfig.color}`}
              >
                {subscriptionConfig.label}
              </span>
              {subscription?.endsAt && (
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  {subscription.status === 'CANCELLED' ? 'Expires: ' : 'Renews: '}
                  {new Date(subscription.endsAt).toLocaleDateString()}
                </p>
              )}
              {hasPremiumAccess && (
                <p className="mt-2 text-sm text-emerald-400">
                  You have access to premium talent data
                </p>
              )}
              {!hasPremiumAccess && isApproved && (
                <Link
                  href="/dashboard/company/payment"
                  className="mt-4 inline-block text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
                >
                  Subscribe to access premium talent data
                </Link>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-gold)]/5 rounded-bl-[60px]" />
            <h3
              className="relative text-sm font-semibold text-[var(--color-text-primary)] mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Account Statistics
            </h3>
            <dl className="relative space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-surface-light)]/10">
                <dt className="text-sm text-[var(--color-text-muted)]">Team Members</dt>
                <dd className="text-sm font-medium text-[var(--color-gold)]">
                  {company.members.filter((m) => m.status === 'ACTIVE').length}
                </dd>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-surface-light)]/10">
                <dt className="text-sm text-[var(--color-text-muted)]">Pending Invites</dt>
                <dd className="text-sm font-medium text-[var(--color-gold)]">
                  {company.members.filter((m) => m.status === 'PENDING').length}
                </dd>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-surface-light)]/10">
                <dt className="text-sm text-[var(--color-text-muted)]">Email Verified</dt>
                <dd
                  className={`text-sm font-medium ${company.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {company.emailVerified ? 'Yes' : 'No'}
                </dd>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--color-surface-light)]/10">
                <dt className="text-sm text-[var(--color-text-muted)]">Member Since</dt>
                <dd className="text-sm font-medium text-[var(--color-text-primary)]">
                  {new Date(company.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
