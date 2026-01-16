'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptInviteSchema, AcceptInviteData } from '@/lib/company/validation';
import {
  getInviteDetails,
  acceptInviteAsNewUser,
  acceptInviteAsExistingUser,
} from '@/lib/company/actions';

interface InviteDetails {
  email: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string;
  invitedBy: string;
}

export function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = searchParams.get('token');

  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token: token || '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  useEffect(() => {
    async function loadInviteDetails() {
      if (!token) {
        setError('Invalid invitation link. Please check the link in your email.');
        setLoading(false);
        return;
      }

      const result = await getInviteDetails(token);
      if (result.success && result.data) {
        setInviteDetails({
          email: result.data.email as string,
          firstName: result.data.firstName as string | null,
          lastName: result.data.lastName as string | null,
          companyName: result.data.companyName as string,
          invitedBy: result.data.invitedBy as string,
        });
      } else {
        setError(result.error || 'Invalid or expired invitation');
      }
      setLoading(false);
    }

    loadInviteDetails();
  }, [token]);

  const handleNewUserSubmit = async (data: AcceptInviteData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await acceptInviteAsNewUser({
        ...data,
        token: token || '',
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login?joined=true'), 2000);
      } else {
        setError(result.error || 'Failed to accept invitation');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExistingUserAccept = async () => {
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await acceptInviteAsExistingUser(token);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard/company'), 2000);
      } else {
        setError(result.error || 'Failed to accept invitation');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (error && !inviteDetails) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="mt-4 text-lg font-semibold text-red-900">Invalid Invitation</h2>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Return Home
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mt-4 text-lg font-semibold text-green-900">Welcome to the Team!</h2>
        <p className="mt-2 text-sm text-green-700">
          You have successfully joined {inviteDetails?.companyName}. Redirecting...
        </p>
      </div>
    );
  }

  if (!inviteDetails) {
    return null;
  }

  // User is logged in - show simple accept option
  if (session?.user) {
    const isMatchingEmail = session.user.email?.toLowerCase() === inviteDetails.email.toLowerCase();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900">Join {inviteDetails.companyName}</h2>
          <p className="mt-2 text-zinc-600">
            You have been invited to join {inviteDetails.companyName} by {inviteDetails.invitedBy}.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!isMatchingEmail && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This invitation was sent to <strong>{inviteDetails.email}</strong>, but you are
                  logged in as <strong>{session.user.email}</strong>. Please log in with the correct
                  account.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="font-medium text-zinc-900">Invitation Details</h3>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Company:</dt>
              <dd className="font-medium text-zinc-900">{inviteDetails.companyName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Invited by:</dt>
              <dd className="text-zinc-900">{inviteDetails.invitedBy}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Your email:</dt>
              <dd className="text-zinc-900">{inviteDetails.email}</dd>
            </div>
          </dl>
        </div>

        {isMatchingEmail && (
          <button
            onClick={handleExistingUserAccept}
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Joining...' : `Join ${inviteDetails.companyName}`}
          </button>
        )}
      </div>
    );
  }

  // User is not logged in - show registration form
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-zinc-900">Join {inviteDetails.companyName}</h2>
        <p className="mt-2 text-zinc-600">
          Create your account to join {inviteDetails.companyName} on Talents Acting.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <h3 className="font-medium text-zinc-900">Invitation Details</h3>
        <dl className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Company:</dt>
            <dd className="font-medium text-zinc-900">{inviteDetails.companyName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Invited by:</dt>
            <dd className="text-zinc-900">{inviteDetails.invitedBy}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Your email:</dt>
            <dd className="text-zinc-900">{inviteDetails.email}</dd>
          </div>
        </dl>
      </div>

      <form onSubmit={handleSubmit(handleNewUserSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              defaultValue={inviteDetails.firstName || ''}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              defaultValue={inviteDetails.lastName || ''}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Minimum 8 characters"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500">
            Must contain uppercase, lowercase, and a number
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmPassword
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account & Join Team'}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{' '}
        <a
          href={`/login?redirect=/invite?token=${token}`}
          className="text-blue-600 hover:text-blue-700"
        >
          Sign in here
        </a>
      </p>
    </div>
  );
}
