import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { getCompanyByUserId } from '@/lib/company/queries';
import { TeamManagement } from '@/components/company/TeamManagement';

export const metadata: Metadata = {
  title: 'Company Dashboard - Talents Acting',
  description: 'Manage your company account on Talents Acting',
};

function getStatusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          Approved
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
          Pending Review
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800">
          {status}
        </span>
      );
  }
}

export default async function CompanyDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const company = await getCompanyByUserId(session.user.id);

  if (!company) {
    redirect('/register/company');
  }

  const isApproved = company.validationStatus === 'APPROVED';
  const isPending = company.validationStatus === 'PENDING';
  const isRejected = company.validationStatus === 'REJECTED';

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">{company.companyName}</h1>
          <p className="mt-1 text-sm text-zinc-600">Company Dashboard</p>
        </div>

        {/* Status Banner */}
        {isPending && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Account Pending Review</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Your company account is being reviewed by our team. You will receive an email once
                  your account is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Account Rejected</h3>
                <p className="mt-1 text-sm text-red-700">
                  {company.rejectionReason ||
                    'Your company account was not approved. Please contact support for more information.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {!company.emailVerified && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Verify Your Email</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Please check your email and click the verification link to complete your
                  registration.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Company Overview Card */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">Company Overview</h2>
                  <p className="text-sm text-zinc-600">{company.industry || 'Industry not set'}</p>
                </div>
                {getStatusBadge(company.validationStatus)}
              </div>

              {company.description && (
                <p className="mt-4 text-sm text-zinc-600">{company.description}</p>
              )}

              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Contact Email
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-900">{company.contactEmail}</dd>
                </div>
                {company.contactPhone && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-900">{company.contactPhone}</dd>
                  </div>
                )}
                {company.website && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Website
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-900">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {company.website}
                      </a>
                    </dd>
                  </div>
                )}
                {(company.city || company.country) && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-zinc-900">
                      {[company.city, company.country].filter(Boolean).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <Link
                  href="/dashboard/company/profile"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit Company Profile
                </Link>
              </div>
            </div>

            {/* Team Management */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <TeamManagement members={company.members} companyName={company.companyName} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">Quick Actions</h3>
              <div className="mt-4 space-y-3">
                {isApproved && (
                  <Link
                    href="/talents"
                    className="flex items-center rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <svg
                      className="mr-3 h-5 w-5 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Browse Talents
                  </Link>
                )}
                <Link
                  href="/dashboard/company/team"
                  className="flex items-center rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  <svg
                    className="mr-3 h-5 w-5 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Manage Team
                </Link>
                <Link
                  href="/dashboard/company/profile"
                  className="flex items-center rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  <svg
                    className="mr-3 h-5 w-5 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Account Stats */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-900">Account Statistics</h3>
              <dl className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-zinc-500">Team Members</dt>
                  <dd className="text-sm font-medium text-zinc-900">
                    {company.members.filter((m) => m.status === 'ACTIVE').length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-zinc-500">Pending Invites</dt>
                  <dd className="text-sm font-medium text-zinc-900">
                    {company.members.filter((m) => m.status === 'PENDING').length}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-zinc-500">Email Verified</dt>
                  <dd className="text-sm font-medium text-zinc-900">
                    {company.emailVerified ? 'Yes' : 'No'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-zinc-500">Member Since</dt>
                  <dd className="text-sm font-medium text-zinc-900">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
