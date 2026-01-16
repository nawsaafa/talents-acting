import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProfessionalForReview } from '@/lib/admin/queries';
import { Card } from '@/components/ui/Card';
import { ValidationActions } from '@/components/admin/ValidationActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

const VALIDATION_STATUS_STYLES = {
  PENDING: {
    bg: 'bg-[var(--color-warning-50)]',
    text: 'text-[var(--color-warning)]',
    label: 'Pending Review',
  },
  APPROVED: {
    bg: 'bg-[var(--color-success-50)]',
    text: 'text-[var(--color-success)]',
    label: 'Approved',
  },
  REJECTED: {
    bg: 'bg-[var(--color-error-50)]',
    text: 'text-[var(--color-error)]',
    label: 'Rejected',
  },
  SUSPENDED: {
    bg: 'bg-[var(--color-neutral-100)]',
    text: 'text-[var(--color-neutral-600)]',
    label: 'Suspended',
  },
};

const SUBSCRIPTION_STATUS_STYLES = {
  NONE: {
    bg: 'bg-[var(--color-neutral-100)]',
    text: 'text-[var(--color-neutral-600)]',
    label: 'None',
  },
  TRIAL: { bg: 'bg-[var(--color-info-50)]', text: 'text-[var(--color-info)]', label: 'Trial' },
  ACTIVE: {
    bg: 'bg-[var(--color-success-50)]',
    text: 'text-[var(--color-success)]',
    label: 'Active',
  },
  PAST_DUE: {
    bg: 'bg-[var(--color-warning-50)]',
    text: 'text-[var(--color-warning)]',
    label: 'Past Due',
  },
  CANCELLED: {
    bg: 'bg-[var(--color-error-50)]',
    text: 'text-[var(--color-error)]',
    label: 'Cancelled',
  },
  EXPIRED: {
    bg: 'bg-[var(--color-neutral-100)]',
    text: 'text-[var(--color-neutral-600)]',
    label: 'Expired',
  },
};

export default async function ProfessionalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const professional = await getProfessionalForReview(id);

  if (!professional) {
    notFound();
  }

  const statusStyle = VALIDATION_STATUS_STYLES[professional.validationStatus];
  const subscriptionStyle =
    SUBSCRIPTION_STATUS_STYLES[professional.subscriptionStatus] || SUBSCRIPTION_STATUS_STYLES.NONE;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/professionals"
        className="inline-flex items-center text-sm text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Queue
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[var(--color-secondary-50)] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[var(--color-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
              {professional.firstName} {professional.lastName}
            </h1>
            <p className="text-[var(--color-neutral-600)]">{professional.user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}
              >
                {statusStyle.label}
              </span>
              {professional.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-[var(--color-success-50)] text-[var(--color-success)] rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-[var(--color-warning-50)] text-[var(--color-warning)] rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Not Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {professional.validationStatus === 'PENDING' && (
          <ValidationActions profileId={professional.id} profileType="professional" showLabels />
        )}
      </div>

      {/* Rejection Reason */}
      {professional.rejectionReason && (
        <Card padding="md" className="border-l-4 border-l-[var(--color-error)]">
          <h3 className="font-medium text-[var(--color-error)] mb-1">Rejection Reason</h3>
          <p className="text-[var(--color-neutral-700)]">{professional.rejectionReason}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Professional Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Profession</dt>
              <dd className="font-medium">{professional.profession}</dd>
            </div>
            {professional.company && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Company</dt>
                <dd className="font-medium">{professional.company}</dd>
              </div>
            )}
            {professional.phone && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Phone</dt>
                <dd className="font-medium">{professional.phone}</dd>
              </div>
            )}
            {professional.website && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Website</dt>
                <dd className="font-medium">
                  <a
                    href={professional.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {professional.website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Account Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Account Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Account Email</dt>
              <dd className="font-medium">{professional.user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Email Verified</dt>
              <dd className="font-medium">{professional.emailVerified ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Account Active</dt>
              <dd className="font-medium">{professional.user.isActive ? 'Yes' : 'No'}</dd>
            </div>
            {professional.termsAcceptedAt && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Terms Accepted</dt>
                <dd className="font-medium">
                  {new Date(professional.termsAcceptedAt).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Subscription Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Subscription
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-[var(--color-neutral-500)]">Status</dt>
              <dd>
                <span
                  className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${subscriptionStyle.bg} ${subscriptionStyle.text}`}
                >
                  {subscriptionStyle.label}
                </span>
              </dd>
            </div>
            {professional.subscriptionEndsAt && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Ends At</dt>
                <dd className="font-medium">
                  {new Date(professional.subscriptionEndsAt).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Validation Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Validation Status
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-[var(--color-neutral-500)]">Status</dt>
              <dd>
                <span
                  className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                >
                  {statusStyle.label}
                </span>
              </dd>
            </div>
            {professional.validatedAt && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Validated At</dt>
                <dd className="font-medium">
                  {new Date(professional.validatedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </Card>
      </div>

      {/* Reason for Access */}
      {professional.reasonForAccess && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Reason for Access
          </h2>
          <p className="text-[var(--color-neutral-700)] whitespace-pre-wrap">
            {professional.reasonForAccess}
          </p>
        </Card>
      )}

      {/* Meta Info */}
      <Card padding="md" className="bg-[var(--color-neutral-50)]">
        <div className="flex flex-wrap gap-6 text-sm text-[var(--color-neutral-500)]">
          <div>
            <span className="font-medium">Profile ID:</span> {professional.id}
          </div>
          <div>
            <span className="font-medium">User ID:</span> {professional.userId}
          </div>
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(professional.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {new Date(professional.updatedAt).toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  );
}
