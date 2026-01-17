import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export const metadata: Metadata = {
  title: 'Payment Cancelled - Talents Acting',
  description: 'Your payment has been cancelled',
};

export default async function PaymentCancelPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const paymentUrl =
    session.user.role === 'TALENT'
      ? '/dashboard/talent/payment'
      : session.user.role === 'COMPANY'
        ? '/dashboard/company/payment'
        : '/dashboard/professional/payment';

  const dashboardUrl =
    session.user.role === 'TALENT'
      ? '/dashboard/talent'
      : session.user.role === 'COMPANY'
        ? '/dashboard/company'
        : '/dashboard/professional';

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          {/* Cancel Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <svg
              className="h-8 w-8 text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-zinc-900">Payment Cancelled</h1>
          <p className="mt-2 text-zinc-600">
            Your payment was not completed. No charges have been made to your account.
          </p>

          {/* Information */}
          <div className="mt-8 rounded-lg bg-zinc-50 p-4 text-left">
            <h2 className="font-medium text-zinc-900">What happened?</h2>
            <p className="mt-2 text-sm text-zinc-600">
              You cancelled the payment process before it was completed. If this was a mistake, you
              can try again by clicking the button below.
            </p>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-left">
            <h2 className="font-medium text-zinc-900">Need help?</h2>
            <p className="mt-2 text-sm text-zinc-600">
              If you encountered any issues during the payment process, please{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                contact our support team
              </Link>
              .
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={paymentUrl}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Try Again
            </Link>
            <Link
              href={dashboardUrl}
              className="rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
