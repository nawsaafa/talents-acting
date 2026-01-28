import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { getProfessionalByUserId } from '@/lib/professional/queries';
import { hasActiveAccess } from '@/lib/payment/subscription';
import { ProfessionalActivitySection } from '@/components/activity';

export const metadata: Metadata = {
  title: 'Dashboard - Talents Acting',
  description: 'Professional dashboard for Talents Acting',
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

export default async function ProfessionalDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getProfessionalByUserId(session.user.id);

  if (!profile) {
    redirect('/register/professional');
  }

  const isApproved = profile.validationStatus === 'APPROVED';
  const isPending = profile.validationStatus === 'PENDING';
  const isRejected = profile.validationStatus === 'REJECTED';
  const hasPremiumAccess = hasActiveAccess(profile.subscriptionStatus);
  const statusConfig = STATUS_CONFIG[profile.validationStatus];
  const subscriptionConfig = SUBSCRIPTION_CONFIG[profile.subscriptionStatus];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <h1
          className="relative text-4xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Welcome, {profile.firstName}!
        </h1>
        <p className="relative mt-2 text-[var(--color-text-secondary)]">
          Manage your professional account and access the talent database.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Account Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-gold)]/5 rounded-bl-[60px]" />
          <h2 className="relative text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Account Status
          </h2>
          <div className="relative">
            <span
              className={`inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
            >
              <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
              {statusConfig.label}
            </span>
          </div>
          {isPending && (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Your account is pending admin approval.
            </p>
          )}
          {isRejected && profile.rejectionReason && (
            <p className="mt-3 text-sm text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              Reason: {profile.rejectionReason}
            </p>
          )}
        </div>

        {/* Email Verification */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-gold)]/5 rounded-bl-[60px]" />
          <h2 className="relative text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Email Verification
          </h2>
          <div className="relative">
            {profile.emailVerified ? (
              <span className="inline-flex items-center gap-2 text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="font-medium">Not Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-gold)]/5 rounded-bl-[60px]" />
          <h2 className="relative text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
            Subscription
          </h2>
          <div className="relative">
            <span
              className={`inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium ${subscriptionConfig.bgColor} ${subscriptionConfig.color}`}
            >
              {subscriptionConfig.label}
            </span>
          </div>
          {profile.subscriptionEndsAt && (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Expires: {new Date(profile.subscriptionEndsAt).toLocaleDateString()}
            </p>
          )}
          {!hasPremiumAccess && isApproved && (
            <Link
              href="/dashboard/professional/payment"
              className="mt-4 inline-block text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
            >
              Subscribe to access premium talent data
            </Link>
          )}
        </div>
      </div>

      {/* Pending Approval Message */}
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
              <h3 className="font-semibold text-[var(--color-gold)]">Account Pending Approval</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                Your professional account is currently being reviewed by our team. You will receive
                an email once your account is approved.
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
            <ProfessionalActivitySection />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[80px]" />
        <h2
          className="relative text-lg font-semibold text-[var(--color-text-primary)] mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Quick Actions
        </h2>
        <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Browse Talents */}
          <Link
            href="/talents"
            className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
              isApproved
                ? 'border-[var(--color-surface-light)]/30 hover:border-blue-500/30 hover:bg-blue-500/5'
                : 'border-[var(--color-surface-light)]/20 opacity-50 cursor-not-allowed pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Browse Talents</p>
                <p className="text-sm text-[var(--color-text-muted)]">Search the database</p>
              </div>
            </div>
          </Link>

          {/* Edit Profile */}
          <Link
            href="/dashboard/professional/profile"
            className="group relative overflow-hidden rounded-xl border border-[var(--color-surface-light)]/30 p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-500/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Edit Profile</p>
                <p className="text-sm text-[var(--color-text-muted)]">Update your info</p>
              </div>
            </div>
          </Link>

          {/* Account Settings */}
          <Link
            href="/settings"
            className="group relative overflow-hidden rounded-xl border border-[var(--color-surface-light)]/30 p-5 transition-all duration-300 hover:border-[var(--color-surface-light)]/50 hover:bg-[var(--color-surface-light)]/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface-light)]/30 group-hover:bg-[var(--color-surface-light)]/50 transition-colors">
                <svg
                  className="h-6 w-6 text-[var(--color-text-muted)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Settings</p>
                <p className="text-sm text-[var(--color-text-muted)]">Account settings</p>
              </div>
            </div>
          </Link>

          {/* Help */}
          <Link
            href="/contact"
            className="group relative overflow-hidden rounded-xl border border-[var(--color-surface-light)]/30 p-5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                <svg
                  className="h-6 w-6 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text-primary)]">Help</p>
                <p className="text-sm text-[var(--color-text-muted)]">Get support</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
