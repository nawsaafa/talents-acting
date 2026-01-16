import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCompanyForReview } from '@/lib/admin/queries';
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

const MEMBER_STATUS_STYLES = {
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pending',
  },
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Active',
  },
  INACTIVE: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    label: 'Inactive',
  },
};

const MEMBER_ROLE_STYLES = {
  ADMIN: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    label: 'Admin',
  },
  MEMBER: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Member',
  },
};

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const company = await getCompanyForReview(id);

  if (!company) {
    notFound();
  }

  const statusStyle = VALIDATION_STATUS_STYLES[company.validationStatus];
  const subscriptionStyle =
    SUBSCRIPTION_STATUS_STYLES[company.subscriptionStatus] || SUBSCRIPTION_STATUS_STYLES.NONE;

  const activeMembers = company.members.filter((m) => m.status === 'ACTIVE');
  const pendingMembers = company.members.filter((m) => m.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/admin/companies"
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
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
              {company.companyName}
            </h1>
            <p className="text-[var(--color-neutral-600)]">{company.user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}
              >
                {statusStyle.label}
              </span>
              {company.emailVerified ? (
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

        {company.validationStatus === 'PENDING' && (
          <ValidationActions profileId={company.id} profileType="company" showLabels />
        )}
      </div>

      {/* Rejection Reason */}
      {company.rejectionReason && (
        <Card padding="md" className="border-l-4 border-l-[var(--color-error)]">
          <h3 className="font-medium text-[var(--color-error)] mb-1">Rejection Reason</h3>
          <p className="text-[var(--color-neutral-700)]">{company.rejectionReason}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Company Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Company Name</dt>
              <dd className="font-medium">{company.companyName}</dd>
            </div>
            {company.industry && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Industry</dt>
                <dd className="font-medium">{company.industry}</dd>
              </div>
            )}
            {company.website && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Website</dt>
                <dd className="font-medium">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-primary)] hover:underline"
                  >
                    {company.website}
                  </a>
                </dd>
              </div>
            )}
            {(company.city || company.country) && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Location</dt>
                <dd className="font-medium">
                  {[company.city, company.country].filter(Boolean).join(', ')}
                </dd>
              </div>
            )}
            {company.address && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Address</dt>
                <dd className="font-medium text-right max-w-[200px]">{company.address}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Contact Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Contact Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Contact Email</dt>
              <dd className="font-medium">{company.contactEmail}</dd>
            </div>
            {company.contactPhone && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Phone</dt>
                <dd className="font-medium">{company.contactPhone}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Account Email</dt>
              <dd className="font-medium">{company.user.email}</dd>
            </div>
          </dl>
        </Card>

        {/* Account Info */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Account Information
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Email Verified</dt>
              <dd className="font-medium">{company.emailVerified ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Account Active</dt>
              <dd className="font-medium">{company.user.isActive ? 'Yes' : 'No'}</dd>
            </div>
            {company.termsAcceptedAt && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Terms Accepted</dt>
                <dd className="font-medium">
                  {new Date(company.termsAcceptedAt).toLocaleDateString()}
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
            {company.subscriptionEndsAt && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Ends At</dt>
                <dd className="font-medium">
                  {new Date(company.subscriptionEndsAt).toLocaleDateString()}
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
            {company.validatedAt && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-neutral-500)]">Validated At</dt>
                <dd className="font-medium">{new Date(company.validatedAt).toLocaleString()}</dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Team Summary */}
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Team Summary
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Total Members</dt>
              <dd className="font-medium">{company.members.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Active Members</dt>
              <dd className="font-medium">{activeMembers.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-neutral-500)]">Pending Invites</dt>
              <dd className="font-medium">{pendingMembers.length}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Description */}
      {company.description && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Company Description
          </h2>
          <p className="text-[var(--color-neutral-700)] whitespace-pre-wrap">
            {company.description}
          </p>
        </Card>
      )}

      {/* Team Members */}
      {company.members.length > 0 && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Team Members
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-neutral-200)]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-neutral-500)] uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-neutral-100)]">
                {company.members.map((member) => {
                  const memberStatusStyle = MEMBER_STATUS_STYLES[member.status];
                  const memberRoleStyle = MEMBER_ROLE_STYLES[member.role];
                  return (
                    <tr key={member.id}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[var(--color-neutral-900)]">
                            {member.firstName && member.lastName
                              ? `${member.firstName} ${member.lastName}`
                              : member.email}
                          </p>
                          {member.firstName && (
                            <p className="text-sm text-[var(--color-neutral-500)]">
                              {member.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${memberRoleStyle.bg} ${memberRoleStyle.text}`}
                        >
                          {memberRoleStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${memberStatusStyle.bg} ${memberStatusStyle.text}`}
                        >
                          {memberStatusStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--color-neutral-500)]">
                        {member.acceptedAt
                          ? new Date(member.acceptedAt).toLocaleDateString()
                          : 'Pending'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Meta Info */}
      <Card padding="md" className="bg-[var(--color-neutral-50)]">
        <div className="flex flex-wrap gap-6 text-sm text-[var(--color-neutral-500)]">
          <div>
            <span className="font-medium">Profile ID:</span> {company.id}
          </div>
          <div>
            <span className="font-medium">User ID:</span> {company.userId}
          </div>
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(company.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {new Date(company.updatedAt).toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  );
}
