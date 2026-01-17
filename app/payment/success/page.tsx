import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getCheckoutSessionStatus } from '@/lib/payment/actions';

export const metadata: Metadata = {
  title: 'Payment Successful - Talents Acting',
  description: 'Your payment has been processed successfully',
};

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  let paymentDetails = null;

  if (session_id) {
    const result = await getCheckoutSessionStatus(session_id);
    if (result.success) {
      paymentDetails = result.data;
    }
  }

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
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
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

          {/* Title */}
          <h1 className="text-2xl font-bold text-zinc-900">Payment Successful!</h1>
          <p className="mt-2 text-zinc-600">
            Thank you for your payment. Your subscription has been activated.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="mt-8 rounded-lg bg-zinc-50 p-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Status</dt>
                  <dd className="font-medium text-green-600">
                    {paymentDetails.paymentStatus === 'paid'
                      ? 'Paid'
                      : paymentDetails.paymentStatus}
                  </dd>
                </div>
                {paymentDetails.amountTotal && (
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Amount</dt>
                    <dd className="font-medium text-zinc-900">
                      {(paymentDetails.amountTotal / 100).toLocaleString('fr-MA')}{' '}
                      {paymentDetails.currency?.toUpperCase()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* What's Next */}
          <div className="mt-8 text-left">
            <h2 className="text-lg font-semibold text-zinc-900">What happens next?</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                You will receive a confirmation email shortly
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Your subscription is now active
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Access all features from your dashboard
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={dashboardUrl}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-zinc-300 bg-white px-6 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
