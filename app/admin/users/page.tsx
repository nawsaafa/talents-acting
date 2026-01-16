import Link from 'next/link';
import { getUsers } from '@/lib/admin/queries';
import { auth } from '@/lib/auth/auth';
import { Card } from '@/components/ui/Card';
import { UserStatusToggle } from '@/components/admin/UserStatusToggle';

interface PageProps {
  searchParams: Promise<{
    role?: string;
    status?: string;
    search?: string;
    page?: string;
  }>;
}

const ROLE_STYLES = {
  ADMIN: { bg: 'bg-purple-100', text: 'text-purple-700' },
  TALENT: { bg: 'bg-blue-100', text: 'text-blue-700' },
  PROFESSIONAL: { bg: 'bg-green-100', text: 'text-green-700' },
  COMPANY: { bg: 'bg-orange-100', text: 'text-orange-700' },
  VISITOR: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth();
  const currentUserId = session?.user?.id;

  const role =
    (params.role as 'ALL' | 'TALENT' | 'PROFESSIONAL' | 'COMPANY' | 'VISITOR' | 'ADMIN') || 'ALL';
  const status = (params.status as 'ALL' | 'ACTIVE' | 'INACTIVE') || 'ALL';
  const search = params.search || '';
  const page = parseInt(params.page || '1', 10);

  const { users, total, totalPages } = await getUsers({
    role,
    status,
    search: search || undefined,
    page,
    limit: 20,
  });

  const roleTabs = [
    { value: 'ALL', label: 'All' },
    { value: 'TALENT', label: 'Talents' },
    { value: 'PROFESSIONAL', label: 'Professionals' },
    { value: 'COMPANY', label: 'Companies' },
    { value: 'VISITOR', label: 'Visitors' },
    { value: 'ADMIN', label: 'Admins' },
  ];

  const statusTabs = [
    { value: 'ALL', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  function getUserDisplayName(user: (typeof users)[0]): string {
    if (user.talentProfile) {
      return `${user.talentProfile.firstName} ${user.talentProfile.lastName}`;
    }
    if (user.professionalProfile) {
      return `${user.professionalProfile.firstName} ${user.professionalProfile.lastName}`;
    }
    if (user.companyProfile) {
      return user.companyProfile.companyName;
    }
    return user.email.split('@')[0];
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">User Management</h1>
        <p className="mt-1 text-[var(--color-neutral-600)]">View and manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Role Tabs */}
        <div className="flex gap-2 flex-wrap">
          {roleTabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/users?role=${tab.value}&status=${status}${search ? `&search=${search}` : ''}`}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-full transition-colors
                ${
                  role === tab.value
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2">
          {statusTabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/users?role=${role}&status=${tab.value}${search ? `&search=${search}` : ''}`}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-full transition-colors
                ${
                  status === tab.value
                    ? 'bg-[var(--color-neutral-800)] text-white'
                    : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]'
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form action="/admin/users" method="GET" className="flex gap-2">
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="status" value={status} />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by email or name..."
            className="flex-1 max-w-md px-4 py-2 border border-[var(--color-neutral-300)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Search
          </button>
          {search && (
            <Link
              href={`/admin/users?role=${role}&status=${status}`}
              className="px-4 py-2 bg-[var(--color-neutral-200)] text-[var(--color-neutral-700)] font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-neutral-300)] transition-colors"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--color-neutral-600)]">
        Showing {users.length} of {total} users
      </p>

      {/* User List */}
      {users.length === 0 ? (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-[var(--color-neutral-900)]">
              No users found
            </h3>
            <p className="mt-2 text-[var(--color-neutral-600)]">
              {search
                ? `No users matching "${search}"`
                : 'There are no users matching your filters.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-neutral-200)]">
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-neutral-500)]">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-neutral-500)]">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-neutral-500)]">
                  Joined
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-neutral-500)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-neutral-100)]">
              {users.map((user) => {
                const roleStyle = ROLE_STYLES[user.role];
                const isCurrentUser = user.id === currentUserId;

                return (
                  <tr key={user.id} className="hover:bg-[var(--color-neutral-50)]">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-[var(--color-neutral-900)]">
                          {getUserDisplayName(user)}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-[var(--color-neutral-500)]">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-[var(--color-neutral-500)]">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${roleStyle.bg} ${roleStyle.text}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--color-neutral-600)]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <UserStatusToggle
                        userId={user.id}
                        isActive={user.isActive}
                        disabled={isCurrentUser}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/users?role=${role}&status=${status}${search ? `&search=${search}` : ''}&page=${page - 1}`}
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
              href={`/admin/users?role=${role}&status=${status}${search ? `&search=${search}` : ''}&page=${page + 1}`}
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
