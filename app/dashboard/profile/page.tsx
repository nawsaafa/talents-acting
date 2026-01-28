import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProfileCompleteness, ProfilePreview } from '@/components/profile';
import { TalentActivitySection } from '@/components/activity';
import { auth } from '@/lib/auth/auth';
import { getTalentProfileByUserId } from '@/lib/talents/queries';
import { getTalentSubscription } from '@/lib/payment/queries';
import { getMyRequestCounts } from '@/lib/contact-requests/actions';

const VALIDATION_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending Review',
    description: 'Your profile is being reviewed by our team.',
    color: 'text-[var(--color-gold)]',
    bgColor: 'bg-[var(--color-gold)]/10',
    borderColor: 'border-[var(--color-gold)]/30',
    iconBg: 'bg-[var(--color-gold)]/20',
  },
  APPROVED: {
    label: 'Approved',
    description: 'Your profile is visible to professionals and companies.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
  },
  REJECTED: {
    label: 'Rejected',
    description: 'Your profile needs changes before it can be approved.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconBg: 'bg-red-500/20',
  },
  SUSPENDED: {
    label: 'Suspended',
    description: 'Your profile has been temporarily suspended.',
    color: 'text-[var(--color-text-muted)]',
    bgColor: 'bg-[var(--color-surface-light)]/10',
    borderColor: 'border-[var(--color-surface-light)]/30',
    iconBg: 'bg-[var(--color-surface-light)]/20',
  },
} as const;

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  NON_BINARY: 'Non-Binary',
  OTHER: 'Other',
};

const SUBSCRIPTION_STATUS_CONFIG = {
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
} as const;

export const metadata = {
  title: 'My Profile | Dashboard - Talents Acting',
  description: 'Manage your talent profile',
};

export default async function ProfileDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/profile');
  }

  if (session.user.role !== 'TALENT' && session.user.role !== 'ADMIN') {
    return (
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl p-12 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--color-surface-light)]/30 mb-6">
              <svg
                className="w-10 h-10 text-[var(--color-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Profile Not Available
            </h2>
            <p className="mt-3 text-[var(--color-text-muted)] max-w-md mx-auto">
              Talent profiles are only available for users registered as talents.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[var(--color-surface-light)]/30 text-[var(--color-text-primary)] font-medium rounded-xl hover:bg-[var(--color-surface-light)]/50 transition-all duration-300"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [profile, subscription, requestCounts] = await Promise.all([
    getTalentProfileByUserId(session.user.id),
    getTalentSubscription(session.user.id),
    getMyRequestCounts(),
  ]);

  if (!profile) {
    return (
      <div className="space-y-8">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
          <h1
            className="relative text-4xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            My Profile
          </h1>
          <p className="relative mt-2 text-[var(--color-text-secondary)]">
            Create your talent profile to get discovered
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl p-12 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 border border-[var(--color-gold)]/30 mb-6">
              <svg
                className="w-10 h-10 text-[var(--color-gold)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Create Your Profile
            </h2>
            <p className="mt-3 text-[var(--color-text-muted)] max-w-md mx-auto">
              Showcase your talent to casting directors, production companies, and industry
              professionals.
            </p>
            <Link
              href="/dashboard/profile/edit"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[var(--color-black)] font-semibold rounded-xl shadow-lg shadow-[var(--color-gold)]/25 hover:shadow-[var(--color-gold)]/40 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = VALIDATION_STATUS_CONFIG[profile.validationStatus];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <h1
          className="relative text-4xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          My Profile
        </h1>
        <p className="relative mt-2 text-[var(--color-text-secondary)]">
          Manage your talent profile
        </p>
      </div>

      {/* Validation Status Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl p-5 ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-current to-current opacity-50"
          style={{
            color: statusConfig.color.replace('text-', '').includes('var')
              ? 'var(--color-gold)'
              : statusConfig.color.includes('emerald')
                ? '#34d399'
                : statusConfig.color.includes('red')
                  ? '#f87171'
                  : '#9ca3af',
          }}
        />
        <div className="flex items-start gap-4 pl-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl ${statusConfig.iconBg} flex items-center justify-center`}
          >
            {profile.validationStatus === 'PENDING' && (
              <svg
                className={`w-5 h-5 ${statusConfig.color}`}
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
            )}
            {profile.validationStatus === 'APPROVED' && (
              <svg
                className={`w-5 h-5 ${statusConfig.color}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {(profile.validationStatus === 'REJECTED' ||
              profile.validationStatus === 'SUSPENDED') && (
              <svg
                className={`w-5 h-5 ${statusConfig.color}`}
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
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {statusConfig.description}
            </p>
            {profile.validationStatus === 'REJECTED' && profile.rejectionReason && (
              <p className="text-sm text-red-400 mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <strong>Reason:</strong> {profile.rejectionReason}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-gold)]/5 rounded-bl-[100px]" />
          <div className="relative flex flex-col sm:flex-row gap-6">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-40 rounded-xl overflow-hidden border-2 border-[var(--color-surface-light)]/30">
                {profile.photo ? (
                  <Image
                    src={profile.photo}
                    alt={profile.firstName}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 flex items-center justify-center">
                    <span
                      className="text-4xl font-bold text-[var(--color-gold)]"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {profile.firstName[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2
                className="text-2xl font-bold text-[var(--color-text-primary)]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-[var(--color-text-muted)] mt-1">
                {GENDER_LABELS[profile.gender]}
                {profile.physique && ` | ${profile.physique}`}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <svg
                    className="w-4 h-4 text-[var(--color-gold)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Age Range: {profile.ageRangeMin}-{profile.ageRangeMax} years
                  </span>
                </div>
                {profile.location && (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <svg
                      className="w-4 h-4 text-[var(--color-gold)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="mt-4 text-[var(--color-text-secondary)] line-clamp-3">
                  {profile.bio}
                </p>
              )}

              {/* Skills Preview */}
              {profile.performanceSkills && profile.performanceSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.performanceSkills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs font-medium bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile.performanceSkills.length > 5 && (
                    <span className="text-xs text-[var(--color-text-muted)] py-1">
                      +{profile.performanceSkills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[80px]" />
          <h3
            className="relative font-semibold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Quick Actions
          </h3>
          <div className="relative space-y-2">
            <Link
              href="/dashboard/profile/edit"
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
              href="/dashboard/profile/media"
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm font-medium">Manage Media</span>
            </Link>
            <Link
              href="/dashboard/requests"
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span className="text-sm font-medium flex-1">Contact Requests</span>
              {requestCounts.received && requestCounts.received.pending > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[var(--color-black)] rounded-full">
                  {requestCounts.received.pending}
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/talent/billing"
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
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="text-sm font-medium">Billing & Subscription</span>
            </Link>
            {profile.validationStatus === 'APPROVED' && profile.isPublic && (
              <Link
                href={`/talents/${profile.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)]/10 to-transparent border border-[var(--color-gold)]/20 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20 transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-sm font-medium">View Public Profile</span>
              </Link>
            )}
          </div>

          {/* Subscription Status */}
          <div className="relative mt-6 pt-6 border-t border-[var(--color-surface-light)]/20">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Subscription
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Status</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${SUBSCRIPTION_STATUS_CONFIG[subscription?.status || 'NONE'].bgColor} ${SUBSCRIPTION_STATUS_CONFIG[subscription?.status || 'NONE'].color}`}
                >
                  {SUBSCRIPTION_STATUS_CONFIG[subscription?.status || 'NONE'].label}
                </span>
              </div>
              {subscription?.endsAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {subscription.status === 'CANCELLED' ? 'Expires' : 'Renews'}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {new Date(subscription.endsAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {(!subscription || subscription.status === 'NONE') && (
                <Link
                  href="/dashboard/talent/payment"
                  className="mt-3 block text-center text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
                >
                  Subscribe Now
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="relative mt-6 pt-6 border-t border-[var(--color-surface-light)]/20">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
              Profile Stats
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Visibility</span>
                <span
                  className={
                    profile.isPublic ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'
                  }
                >
                  {profile.isPublic ? 'Public' : 'Hidden'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Available</span>
                <span
                  className={
                    profile.isAvailable ? 'text-emerald-400' : 'text-[var(--color-text-muted)]'
                  }
                >
                  {profile.isAvailable ? 'Yes' : 'No'}
                </span>
              </div>
              {profile.dailyRate && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Daily Rate</span>
                  <span className="font-medium text-[var(--color-gold)]">
                    {Number(profile.dailyRate).toLocaleString()} MAD
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      {profile.validationStatus === 'APPROVED' && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[80px]" />
          <h2
            className="relative text-lg font-semibold text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Activity Overview
          </h2>
          <div className="relative">
            <TalentActivitySection />
          </div>
        </div>
      )}

      {/* Profile Completeness */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[80px]" />
        <div className="relative">
          <ProfileCompleteness profile={profile} showDetails />
        </div>
      </div>

      {/* Profile Preview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/5 rounded-bl-[80px]" />
        <h2
          className="relative text-lg font-semibold text-[var(--color-text-primary)] mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Profile Preview
        </h2>
        <div className="relative">
          <ProfilePreview profile={profile} />
        </div>
      </div>
    </div>
  );
}
