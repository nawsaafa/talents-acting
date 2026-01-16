import Link from 'next/link';
import Image from 'next/image';
import { getTalentValidationQueue } from '@/lib/admin/queries';
import { Card } from '@/components/ui/Card';
import { ValidationActions } from '@/components/admin/ValidationActions';

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function TalentQueuePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = (params.status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED') || 'PENDING';
  const page = parseInt(params.page || '1', 10);

  const {
    items: talents,
    total,
    totalPages,
  } = await getTalentValidationQueue({
    status,
    page,
    limit: 20,
  });

  const statusTabs = [
    { value: 'PENDING', label: 'Pending', color: 'var(--color-warning)' },
    { value: 'APPROVED', label: 'Approved', color: 'var(--color-success)' },
    { value: 'REJECTED', label: 'Rejected', color: 'var(--color-error)' },
    { value: 'SUSPENDED', label: 'Suspended', color: 'var(--color-neutral-500)' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
          Talent Validation Queue
        </h1>
        <p className="mt-1 text-[var(--color-neutral-600)]">
          Review and validate talent profile submissions
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-neutral-200)]">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/talents?status=${tab.value}`}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 transition-colors
              ${
                status === tab.value
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]'
              }
            `}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--color-neutral-600)]">
        Showing {talents.length} of {total} talents
      </p>

      {/* Talent List */}
      {talents.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-[var(--color-neutral-400)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-[var(--color-neutral-900)]">
              No talents found
            </h3>
            <p className="mt-2 text-[var(--color-neutral-600)]">
              There are no talents with {status.toLowerCase()} status.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {talents.map((talent) => (
            <Card key={talent.id} padding="md" hover>
              <div className="flex items-center gap-4">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {talent.photo ? (
                    <Image
                      src={talent.photo}
                      alt={talent.firstName}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center">
                      <span className="text-xl font-medium text-[var(--color-neutral-500)]">
                        {talent.firstName[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/talents/${talent.id}`}
                    className="text-lg font-medium text-[var(--color-neutral-900)] hover:text-[var(--color-primary)]"
                  >
                    {talent.firstName} {talent.lastName}
                  </Link>
                  <p className="text-sm text-[var(--color-neutral-600)]">{talent.user.email}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-neutral-500)]">
                    {talent.location && <span>{talent.location}</span>}
                    <span>Submitted {new Date(talent.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {status === 'PENDING' ? (
                    <ValidationActions profileId={talent.id} profileType="talent" />
                  ) : (
                    <Link
                      href={`/admin/talents/${talent.id}`}
                      className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/talents?status=${status}&page=${page - 1}`}
              className="px-4 py-2 text-sm font-medium text-[var(--color-neutral-600)] bg-white border border-[var(--color-neutral-300)] rounded-[var(--radius-md)] hover:bg-[var(--color-neutral-50)]"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-[var(--color-neutral-600)]">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/talents?status=${status}&page=${page + 1}`}
              className="px-4 py-2 text-sm font-medium text-[var(--color-neutral-600)] bg-white border border-[var(--color-neutral-300)] rounded-[var(--radius-md)] hover:bg-[var(--color-neutral-50)]"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
