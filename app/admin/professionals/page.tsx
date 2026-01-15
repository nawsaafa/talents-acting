import Link from "next/link";
import { getProfessionalValidationQueue } from "@/lib/admin/queries";
import { Card } from "@/components/ui/Card";
import { ValidationActions } from "@/components/admin/ValidationActions";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function ProfessionalQueuePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = (params.status as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED") || "PENDING";
  const page = parseInt(params.page || "1", 10);

  const { items: professionals, total, totalPages } = await getProfessionalValidationQueue({
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
          Professional Validation Queue
        </h1>
        <p className="mt-1 text-[var(--color-neutral-600)]">
          Review and validate professional registration requests
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-neutral-200)]">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/professionals?status=${tab.value}`}
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
        Showing {professionals.length} of {total} professionals
      </p>

      {/* Professional List */}
      {professionals.length === 0 ? (
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-[var(--color-neutral-900)]">
              No professionals found
            </h3>
            <p className="mt-2 text-[var(--color-neutral-600)]">
              There are no professionals with {status.toLowerCase()} status.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {professionals.map((professional) => (
            <Card key={professional.id} padding="md" hover>
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-secondary-50)] flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-[var(--color-secondary)]"
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
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-[var(--color-neutral-900)]">
                    {professional.firstName} {professional.lastName}
                  </p>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    {professional.profession}
                    {professional.company && ` at ${professional.company}`}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-neutral-500)]">
                    <span>{professional.user.email}</span>
                    <span>
                      Submitted {new Date(professional.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {status === "PENDING" && (
                    <ValidationActions profileId={professional.id} profileType="professional" />
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
              href={`/admin/professionals?status=${status}&page=${page - 1}`}
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
              href={`/admin/professionals?status=${status}&page=${page + 1}`}
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
