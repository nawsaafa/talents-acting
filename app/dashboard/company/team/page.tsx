import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { getCompanyByUserId } from '@/lib/company/queries';
import { TeamManagement } from '@/components/company/TeamManagement';

export const metadata: Metadata = {
  title: 'Team Management - Talents Acting',
  description: 'Manage your company team members on Talents Acting',
};

export default async function CompanyTeamPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const company = await getCompanyByUserId(session.user.id);

  if (!company) {
    redirect('/register/company');
  }

  const activeCount = company.members.filter((m) => m.status === 'ACTIVE').length;
  const pendingCount = company.members.filter((m) => m.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/company" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Team Management</h1>
              <p className="mt-1 text-sm text-zinc-600">
                Invite and manage team members for {company.companyName}.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-600">
                <span className="font-medium text-zinc-900">{activeCount}</span> active member
                {activeCount !== 1 ? 's' : ''}
              </p>
              {pendingCount > 0 && (
                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-yellow-600">{pendingCount}</span> pending
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3 text-sm text-blue-700">
              <p>
                Team members share access to the talent database under your company subscription.
                Each member receives their own login credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Team Management Component */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <TeamManagement members={company.members} companyName={company.companyName} />
        </div>

        {/* Role Explanation */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900">Team Member Roles</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                Admin
              </span>
              <p className="ml-3 text-sm text-zinc-600">
                Can browse talents, contact them, manage team members, and edit company profile.
              </p>
            </div>
            <div className="flex items-start">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                Member
              </span>
              <p className="ml-3 text-sm text-zinc-600">
                Can browse talents and contact them. Cannot manage team or edit company profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
