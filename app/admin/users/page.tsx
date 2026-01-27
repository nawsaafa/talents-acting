import Link from 'next/link';
import { getUsers } from '@/lib/admin/queries';
import { auth } from '@/lib/auth/auth';
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
  ADMIN: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  TALENT: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  PROFESSIONAL: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  COMPANY: {
    bg: 'bg-[var(--color-gold)]/20',
    text: 'text-[var(--color-gold)]',
    border: 'border-[var(--color-gold)]/30',
  },
  VISITOR: {
    bg: 'bg-[var(--color-surface-light)]/30',
    text: 'text-[var(--color-text-muted)]',
    border: 'border-[var(--color-surface-light)]/30',
  },
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <h1
          className="relative text-4xl font-bold text-[var(--color-text-primary)]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          User Management
        </h1>
        <p className="relative mt-2 text-[var(--color-text-secondary)]">
          View and manage all registered users
        </p>
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
                px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300
                ${
                  role === tab.value
                    ? 'bg-gradient-to-r from-[var(--color-gold)]/20 to-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 shadow-lg shadow-[var(--color-gold)]/10'
                    : 'bg-[var(--color-surface)]/50 text-[var(--color-text-secondary)] border border-[var(--color-surface-light)]/20 hover:border-[var(--color-gold)]/20 hover:text-[var(--color-text-primary)]'
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
                px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300
                ${
                  status === tab.value
                    ? 'bg-[var(--color-surface-light)] text-[var(--color-text-primary)] border border-[var(--color-surface-light)]/50'
                    : 'bg-[var(--color-surface)]/30 text-[var(--color-text-muted)] border border-transparent hover:border-[var(--color-surface-light)]/30'
                }
              `}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form action="/admin/users" method="GET" className="flex gap-3">
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="status" value={status} />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by email or name..."
            className="flex-1 max-w-md px-4 py-3 bg-[var(--color-surface)]/50 border border-[var(--color-surface-light)]/20 rounded-xl text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)]/50 transition-all duration-300"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-[var(--color-black)] font-semibold rounded-xl shadow-lg shadow-[var(--color-gold)]/25 hover:shadow-[var(--color-gold)]/40 transition-all duration-300"
          >
            Search
          </button>
          {search && (
            <Link
              href={`/admin/users?role=${role}&status=${status}`}
              className="px-5 py-3 bg-[var(--color-surface-light)]/30 text-[var(--color-text-secondary)] font-medium rounded-xl hover:bg-[var(--color-surface-light)]/50 transition-all duration-300"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--color-text-muted)]">
        Showing <span className="text-[var(--color-gold)] font-medium">{users.length}</span> of{' '}
        <span className="text-[var(--color-text-primary)]">{total}</span> users
      </p>

      {/* User List */}
      {users.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold text-[var(--color-text-primary)]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              No users found
            </h3>
            <p className="mt-2 text-[var(--color-text-muted)]">
              {search
                ? `No users matching "${search}"`
                : 'There are no users matching your filters.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-charcoal)] border border-[var(--color-surface-light)]/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-surface-light)]/20">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-surface-light)]/10">
                {users.map((user, index) => {
                  const roleStyle = ROLE_STYLES[user.role];
                  const isCurrentUser = user.id === currentUserId;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[var(--color-surface-light)]/10 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-[var(--color-gold)]">
                              {getUserDisplayName(user)[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[var(--color-text-primary)]">
                              {getUserDisplayName(user)}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-[var(--color-gold)]/10 text-[var(--color-gold)] rounded-full">
                                  you
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-sm text-[var(--color-text-muted)]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-5">
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
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 pt-4">
          {page > 1 && (
            <Link
              href={`/admin/users?role=${role}&status=${status}${search ? `&search=${search}` : ''}&page=${page - 1}`}
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
              href={`/admin/users?role=${role}&status=${status}${search ? `&search=${search}` : ''}&page=${page + 1}`}
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
