'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '@/lib/professional/actions';

type VerificationState = 'loading' | 'success' | 'already-verified' | 'error' | 'no-token';

export function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    async function verify() {
      if (!token) {
        setState('no-token');
        return;
      }

      const result = await verifyEmail(token);

      if (result.success) {
        if (result.data?.alreadyVerified) {
          setState('already-verified');
        } else {
          setState('success');
        }
      } else {
        setState('error');
        setErrorMessage(result.error || 'Verification failed');
      }
    }

    verify();
  }, [token]);

  if (state === 'loading') {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center">
          <svg
            className="h-8 w-8 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="mt-4 text-zinc-600">Verifying your email...</p>
      </div>
    );
  }

  if (state === 'no-token') {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <svg
            className="h-8 w-8 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-zinc-900">Invalid Verification Link</h1>
        <p className="mt-4 text-zinc-600">
          This verification link is missing required information. Please check the link in your
          email and try again.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-zinc-900">Email Verified!</h1>
        <p className="mt-4 text-zinc-600">
          Your email has been successfully verified. Your account is now pending admin approval.
        </p>
        <div className="mt-6 rounded-lg bg-blue-50 p-4 text-left">
          <p className="text-sm text-blue-800">
            <strong>What happens next?</strong> Our team will review your application and you will
            receive an email once your account is approved.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (state === 'already-verified') {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-zinc-900">Already Verified</h1>
        <p className="mt-4 text-zinc-600">
          Your email has already been verified. You can log in to your account.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-zinc-900">Verification Failed</h1>
      <p className="mt-4 text-zinc-600">{errorMessage}</p>
      <div className="mt-6 rounded-lg bg-zinc-50 p-4 text-left">
        <p className="text-sm text-zinc-700">
          <strong>Common issues:</strong>
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-zinc-600">
          <li>The verification link has expired (24 hours)</li>
          <li>The link was already used</li>
          <li>The link was copied incorrectly</li>
        </ul>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/login"
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to Login
        </Link>
        <Link
          href="/register/professional"
          className="rounded-md border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Register Again
        </Link>
      </div>
    </div>
  );
}
