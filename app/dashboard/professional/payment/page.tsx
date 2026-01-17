'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProfessionalCheckout } from '@/lib/payment/actions';
import { PRICING, CURRENCY } from '@/lib/payment/config';

export default function ProfessionalPaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricing = PRICING.PROFESSIONAL_ACCESS;

  async function handlePayment() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createProfessionalCheckout();

      if (!result.success) {
        setError(result.error || 'Failed to create checkout session');
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
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">Professional Database Access</h1>
          <p className="mt-2 text-zinc-600">Get access to our complete talent database</p>
        </div>

        {/* Pricing Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-zinc-900">{pricing.description}</h2>
            <div className="mt-4">
              <span className="text-4xl font-bold text-zinc-900">{pricing.displayAmount}</span>
              <span className="ml-2 text-zinc-600">{CURRENCY.symbol}</span>
              <span className="text-zinc-500"> / {pricing.periodMonths} months</span>
            </div>
          </div>

          {/* Features */}
          <ul className="mt-8 space-y-4">
            <li className="flex items-start gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-zinc-700">Full access to talent profiles</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-zinc-700">Advanced search and filters</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-zinc-700">Contact talent directly</span>
            </li>
            <li className="flex items-start gap-3">
              <svg
                className="h-5 w-5 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-zinc-700">Priority support</span>
            </li>
          </ul>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ${pricing.displayAmount} ${CURRENCY.symbol}`
            )}
          </button>

          {/* Secure Payment Note */}
          <p className="mt-4 text-center text-sm text-zinc-500">
            <svg
              className="mr-1 inline-block h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
