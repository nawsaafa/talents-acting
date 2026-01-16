import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Registration Successful - Talents Acting',
  description: 'Your company registration has been submitted',
};

export default function CompanyRegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 sm:py-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="mt-6 text-2xl font-bold text-zinc-900">Registration Successful!</h1>

          {/* Description */}
          <p className="mt-4 text-zinc-600">
            Thank you for registering your company on Talents Acting.
          </p>

          {/* Next Steps */}
          <div className="mt-8 rounded-lg bg-blue-50 p-4 text-left">
            <h2 className="font-semibold text-blue-900">Next Steps:</h2>
            <ol className="mt-2 list-inside list-decimal space-y-2 text-sm text-blue-800">
              <li>
                <strong>Check your email</strong> - We have sent a verification link to your email
                address.
              </li>
              <li>
                <strong>Verify your email</strong> - Click the link in the email to verify your
                account.
              </li>
              <li>
                <strong>Wait for approval</strong> - Our team will review your company application
                and notify you once approved.
              </li>
              <li>
                <strong>Invite your team</strong> - Once approved, you can invite team members to
                access the talent database.
              </li>
            </ol>
          </div>

          {/* Team Feature Highlight */}
          <div className="mt-6 rounded-lg bg-zinc-50 p-4 text-left">
            <h3 className="font-medium text-zinc-800">Team Access</h3>
            <p className="mt-1 text-sm text-zinc-600">
              With a company account, you can invite multiple team members to share access to the
              talent database. All team members can browse profiles and contact talent.
            </p>
          </div>

          {/* Note */}
          <p className="mt-6 text-sm text-zinc-500">
            Did not receive the email? Check your spam folder or contact our support team.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="rounded-md border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
