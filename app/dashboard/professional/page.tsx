import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { getProfessionalByUserId } from '@/lib/professional/queries';

export const metadata: Metadata = {
  title: 'Dashboard - Talents Acting',
  description: 'Professional dashboard for Talents Acting',
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-zinc-100 text-zinc-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || styles.PENDING
      }`}
    >
      {status}
    </span>
  );
}

function SubscriptionBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NONE: 'bg-zinc-100 text-zinc-800',
    TRIAL: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    PAST_DUE: 'bg-amber-100 text-amber-800',
    CANCELLED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-zinc-100 text-zinc-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || styles.NONE
      }`}
    >
      {status === 'NONE' ? 'No Subscription' : status}
    </span>
  );
}

export default async function ProfessionalDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getProfessionalByUserId(session.user.id);

  if (!profile) {
    redirect('/register/professional');
  }

  const isApproved = profile.validationStatus === 'APPROVED';
  const isPending = profile.validationStatus === 'PENDING';
  const isRejected = profile.validationStatus === 'REJECTED';

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Welcome, {profile.firstName}!</h1>
          <p className="mt-1 text-zinc-600">
            Manage your professional account and access the talent database.
          </p>
        </div>

        {/* Status Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Account Status */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-zinc-500">Account Status</h2>
            <div className="mt-2">
              <StatusBadge status={profile.validationStatus} />
            </div>
            {isPending && (
              <p className="mt-3 text-sm text-zinc-600">Your account is pending admin approval.</p>
            )}
            {isRejected && profile.rejectionReason && (
              <p className="mt-3 text-sm text-red-600">Reason: {profile.rejectionReason}</p>
            )}
          </div>

          {/* Email Verification */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-zinc-500">Email Verification</h2>
            <div className="mt-2">
              {profile.emailVerified ? (
                <span className="inline-flex items-center gap-1.5 text-green-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Subscription Status */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-medium text-zinc-500">Subscription</h2>
            <div className="mt-2">
              <SubscriptionBadge status={profile.subscriptionStatus} />
            </div>
            {profile.subscriptionEndsAt && (
              <p className="mt-3 text-sm text-zinc-600">
                Expires: {new Date(profile.subscriptionEndsAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Pending Approval Message */}
        {isPending && (
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Account Pending Approval</h3>
                <p className="mt-2 text-sm text-amber-700">
                  Your professional account is currently being reviewed by our team. You will
                  receive an email once your account is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Browse Talents */}
            <Link
              href="/talents"
              className={`flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-colors ${
                isApproved
                  ? 'hover:border-blue-300 hover:bg-blue-50'
                  : 'cursor-not-allowed opacity-50'
              }`}
              aria-disabled={!isApproved}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Browse Talents</p>
                <p className="text-sm text-zinc-500">Search the database</p>
              </div>
            </Link>

            {/* Edit Profile */}
            <Link
              href="/dashboard/professional/profile"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Edit Profile</p>
                <p className="text-sm text-zinc-500">Update your info</p>
              </div>
            </Link>

            {/* Account Settings */}
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                <svg
                  className="h-5 w-5 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Settings</p>
                <p className="text-sm text-zinc-500">Account settings</p>
              </div>
            </Link>

            {/* Help */}
            <Link
              href="/contact"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-zinc-900">Help</p>
                <p className="text-sm text-zinc-500">Get support</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
