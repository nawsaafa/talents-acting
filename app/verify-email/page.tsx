import { Suspense } from 'react';
import { Metadata } from 'next';
import { VerifyEmailContent } from './VerifyEmailContent';

export const metadata: Metadata = {
  title: 'Verify Email - Talents Acting',
  description: 'Verify your email address for Talents Acting',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 sm:py-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
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
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
