import Link from "next/link";
import { getCompanyValidationQueue } from "@/lib/admin/queries";
import { Card } from "@/components/ui/Card";
import { ValidationActions } from "@/components/admin/ValidationActions";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function CompanyQueuePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = (params.status as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED") || "PENDING";
  const page = parseInt(params.page || "1", 10);

  const { items: companies, total, totalPages } = await getCompanyValidationQueue({
    status,
    page,
    limit: 20,
  });

  const statusTabs = [
    { value: "PENDING", label: "Pending", color: "var(--color-warning)" },
    { value: "APPROVED", label: "Approved", color: "var(--color-success)" },
    { value: "REJECTED", label: "Rejected", color: "var(--color-error)" },
    { value: "SUSPENDED", label: "Suspended", color: "var(--color-neutral-500)" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
          Company Validation Queue
        </h1>
        <p className="mt-1 text-[var(--color-neutral-600)]">
          Review and validate company registration requests
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-neutral-200)]">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/companies?status=${tab.value}`}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 transition-colors
              ${
                status === tab.value
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
              }
            `}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--color-neutral-600)]">
        Showing {companies.length} of {total} companies
      </p>

      {/* Company List */}
      {companies.length === 0 ? (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-[var(--color-neutral-900)]">
              No companies found
            </h3>
            <p className="mt-2 text-[var(--color-neutral-600)]">
              There are no companies with {status.toLowerCase()} status.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {companies.map((company) => (
            <Card key={company.id} padding="md" hover>
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[var(--color-primary)]"
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
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-[var(--color-neutral-900)]">
                    {company.companyName}
                  </p>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    {company.industry}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-neutral-500)]">
                    <span>{company.user.email}</span>
                    {company.city && company.country && (
                      <span>{company.city}, {company.country}</span>
                    )}
                    <span>
                      Submitted {new Date(company.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {status === "PENDING" && (
                    <ValidationActions profileId={company.id} profileType="company" />
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
              href={`/admin/companies?status=${status}&page=${page - 1}`}
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
              href={`/admin/companies?status=${status}&page=${page + 1}`}
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
