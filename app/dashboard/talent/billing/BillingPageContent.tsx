'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPortalSession } from '@/lib/payment/portal';
import { SubscriptionInfo } from '@/lib/payment/queries';
import { PaymentType } from '@prisma/client';

interface BillingRecord {
  id: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  description: string | null;
  periodStart: Date | null;
  periodEnd: Date | null;
  completedAt: Date | null;
  stripeInvoiceId: string | null;
  createdAt: Date;
}

interface BillingPageContentProps {
  subscription: SubscriptionInfo | null;
  billingHistory: BillingRecord[];
  userRole: 'TALENT' | 'PROFESSIONAL' | 'COMPANY';
}

function SubscriptionStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    NONE: 'bg-zinc-100 text-zinc-800',
    TRIAL: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    PAST_DUE: 'bg-amber-100 text-amber-800',
    CANCELLED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-zinc-100 text-zinc-800',
  };

  const labels: Record<string, string> = {
    NONE: 'No Subscription',
    TRIAL: 'Trial',
    ACTIVE: 'Active',
    PAST_DUE: 'Past Due',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
        styles[status] || styles.NONE
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatAmount(amount: number, currency: string): string {
  const displayAmount = amount / 100;
  return `${displayAmount.toLocaleString('en-US')} ${currency.toUpperCase()}`;
}

function getPaymentTypeLabel(paymentType: PaymentType): string {
  switch (paymentType) {
    case 'TALENT_MEMBERSHIP':
      return 'Talent Membership';
    case 'PROFESSIONAL_ACCESS':
      return 'Professional Access';
    case 'COMPANY_ACCESS':
      return 'Company Access';
    default:
      return 'Subscription';
  }
}

export function BillingPageContent({
  subscription,
  billingHistory,
  userRole,
}: BillingPageContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsSubscription = !subscription || subscription.status === 'NONE';
  const paymentPath =
    userRole === 'TALENT'
      ? '/dashboard/talent/payment'
      : userRole === 'COMPANY'
        ? '/dashboard/company/payment'
        : '/dashboard/professional/payment';

  async function handleManageBilling() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createPortalSession();

      if (!result.success) {
        setError(result.error || 'Failed to open billing portal');
        return;
      }

      if (result.url) {
        router.push(result.url);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Billing & Subscription</h1>
          <p className="mt-1 text-zinc-600">Manage your subscription and view billing history.</p>
        </div>

        {/* Subscription Status Card */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Subscription Status</h2>
              <div className="mt-2">
                <SubscriptionStatusBadge status={subscription?.status || 'NONE'} />
              </div>
              {subscription?.endsAt && (
                <p className="mt-3 text-sm text-zinc-600">
                  {subscription.status === 'CANCELLED' ? 'Access until: ' : 'Next renewal: '}
                  {formatDate(subscription.endsAt)}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {needsSubscription ? (
                <Link
                  href={paymentPath}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Subscribe Now
                </Link>
              ) : (
                <button
                  onClick={handleManageBilling}
                  disabled={isLoading}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Manage Subscription'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}
        </div>

        {/* Past Due Warning */}
        {subscription?.status === 'PAST_DUE' && (
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
                <h3 className="text-sm font-medium text-amber-800">Payment Past Due</h3>
                <p className="mt-2 text-sm text-amber-700">
                  Your payment could not be processed. Please update your payment method to avoid
                  service interruption.
                </p>
                <button
                  onClick={handleManageBilling}
                  disabled={isLoading}
                  className="mt-3 text-sm font-medium text-amber-800 underline hover:text-amber-900"
                >
                  Update Payment Method
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing History */}
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-zinc-900">Billing History</h2>
          </div>

          {billingHistory.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-zinc-900">No billing history</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Your payment history will appear here once you subscribe.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead>
                  <tr className="bg-zinc-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Period
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {billingHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-zinc-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900">
                        {formatDate(record.completedAt || record.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-900">
                        {record.description || getPaymentTypeLabel(record.paymentType)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                        {record.periodStart && record.periodEnd ? (
                          <>
                            {formatDate(record.periodStart)} - {formatDate(record.periodEnd)}
                          </>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-zinc-900">
                        {formatAmount(record.amount, record.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            Need help with billing?{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
