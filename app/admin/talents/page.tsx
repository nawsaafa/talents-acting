import Link from 'next/link';
import Image from 'next/image';
import { getTalentValidationQueue } from '@/lib/admin/queries';
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
    { value: 'PENDING', label: 'Pending', color: 'var(--color-gold)' },
    { value: 'APPROVED', label: 'Approved', color: 'var(--color-success)' },
    { value: 'REJECTED', label: 'Rejected', color: 'var(--color-error)' },
    { value: 'SUSPENDED', label: 'Suspended', color: 'var(--color-text-muted)' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <h1
          className="relative text-4xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Talent Validation Queue
        </h1>
        <p className="relative mt-2 text-[var(--color-text-secondary)]">
          Review and validate talent profile submissions
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 p-1 bg-[var(--color-surface)]/50 rounded-2xl border border-[var(--color-surface-light)]/20 w-fit">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/talents?status=${tab.value}`}
            className={`
              relative px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300
              ${
                status === tab.value
                  ? 'bg-gradient-to-r from-[var(--color-gold)]/20 to-[var(--color-gold)]/10 text-[var(--color-gold)] shadow-lg shadow-[var(--color-gold)]/10'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-light)]/30'
              }
            `}
          >
            {status === tab.value && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
            )}
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--color-text-muted)]">
        Showing <span className="text-[var(--color-gold)] font-medium">{talents.length}</span> of{' '}
        <span className="text-[var(--color-text-primary)]">{total}</span> talents
      </p>

      {/* Talent List */}
      {talents.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl p-12 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/5 rounded-full blur-3xl" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-surface-light)]/30 mb-4">
              <svg
                className="w-8 h-8 text-[var(--color-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              No talents found
            </h3>
            <p className="mt-2 text-[var(--color-text-muted)]">
              There are no talents with {status.toLowerCase()} status.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {talents.map((talent, index) => (
            <div
              key={talent.id}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20 hover:border-[var(--color-gold)]/30 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold)]/0 to-[var(--color-gold)]/0 group-hover:from-[var(--color-gold)]/5 group-hover:to-transparent transition-all duration-500" />

              <div className="relative p-5 flex items-center gap-5">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {talent.photo ? (
                    <Image
                      src={talent.photo}
                      alt={talent.firstName}
                      width={72}
                      height={72}
                      className="w-18 h-18 rounded-xl object-cover border-2 border-[var(--color-surface-light)]/30"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-xl bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 flex items-center justify-center">
                      <span
                        className="text-2xl font-bold text-[var(--color-gold)]"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {talent.firstName[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/talents/${talent.id}`}
                    className="text-lg font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-gold)] transition-colors"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {talent.firstName} {talent.lastName}
                  </Link>
                  <p className="text-sm text-[var(--color-text-muted)]">{talent.user.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-text-muted)]">
                    {talent.location && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {talent.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
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
                      {new Date(talent.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {status === 'PENDING' ? (
                    <ValidationActions profileId={talent.id} profileType="talent" />
                  ) : (
                    <Link
                      href={`/admin/talents/${talent.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold-light)] bg-[var(--color-gold)]/10 hover:bg-[var(--color-gold)]/20 rounded-xl border border-[var(--color-gold)]/20 transition-all duration-300"
                    >
                      View Details
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 pt-4">
          {page > 1 && (
            <Link
              href={`/admin/talents?status=${status}&page=${page - 1}`}
              className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-surface-light)]/30 rounded-xl hover:border-[var(--color-gold)]/30 hover:text-[var(--color-gold)] transition-all duration-300"
            >
              Previous
            </Link>
          )}
          <span className="px-5 py-2.5 text-sm text-[var(--color-text-muted)]">
            Page <span className="text-[var(--color-gold)] font-medium">{page}</span> of{' '}
            {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/talents?status=${status}&page=${page + 1}`}
              className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-surface-light)]/30 rounded-xl hover:border-[var(--color-gold)]/30 hover:text-[var(--color-gold)] transition-all duration-300"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
