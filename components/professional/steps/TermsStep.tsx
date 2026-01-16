'use client';

import { useFormContext } from 'react-hook-form';
import { TermsStepData } from '@/lib/professional/validation';

interface TermsStepProps {
  onBack: () => void;
  isSubmitting: boolean;
}

export function TermsStep({ onBack, isSubmitting }: TermsStepProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ terms: TermsStepData }>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Terms & Conditions</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Please review and accept our terms to complete your registration.
        </p>
      </div>

      <div className="space-y-4">
        {/* Terms Summary Box */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="font-medium text-zinc-900">Summary of Terms</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
              <span>
                Access to the talent database is for professional casting and production purposes
                only.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
              <span>
                Contact information must not be shared with third parties or used for spam.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
              <span>Your account may be suspended if terms are violated.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400" />
              <span>
                Annual subscription fees apply after approval (details provided upon approval).
              </span>
            </li>
          </ul>
        </div>

        {/* Accept Terms */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <input
              id="acceptTerms"
              type="checkbox"
              {...register('terms.acceptTerms')}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="acceptTerms" className="text-sm text-zinc-700">
              I have read and agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Terms and Conditions
              </a>
              <span className="text-red-500"> *</span>
            </label>
          </div>
          {errors.terms?.acceptTerms && (
            <p className="ml-7 text-sm text-red-600">{errors.terms.acceptTerms.message}</p>
          )}

          <div className="flex items-start gap-3">
            <input
              id="acceptPrivacy"
              type="checkbox"
              {...register('terms.acceptPrivacy')}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="acceptPrivacy" className="text-sm text-zinc-700">
              I have read and agree to the{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Privacy Policy
              </a>
              <span className="text-red-500"> *</span>
            </label>
          </div>
          {errors.terms?.acceptPrivacy && (
            <p className="ml-7 text-sm text-red-600">{errors.terms.acceptPrivacy.message}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="rounded-md border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
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
              Creating Account...
            </span>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </div>
  );
}
