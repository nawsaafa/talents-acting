'use client';

import { useFormContext } from 'react-hook-form';
import { TermsStepData } from '@/lib/company/validation';

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
        <h2 className="text-xl font-semibold text-zinc-900">Terms and Conditions</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Please review and accept our terms to complete your registration.
        </p>
      </div>

      <div className="space-y-4">
        {/* Terms Summary */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="font-medium text-zinc-900">Company Account Terms</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-600">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">-</span>
              Your company account will be reviewed by our team before activation.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">-</span>
              You may invite team members to share access to the talent database.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">-</span>
              All team members must comply with our platform guidelines.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">-</span>
              Contact information of talent is provided for professional purposes only.
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">-</span>
              You agree not to share talent information outside your organization.
            </li>
          </ul>
        </div>

        {/* Accept Terms */}
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="acceptTerms"
                type="checkbox"
                {...register('terms.acceptTerms')}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <label htmlFor="acceptTerms" className="ml-3 text-sm text-zinc-700">
              I accept the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Terms and Conditions
              </a>{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.terms?.acceptTerms && (
            <p className="ml-7 text-sm text-red-600">{errors.terms.acceptTerms.message}</p>
          )}

          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="acceptPrivacy"
                type="checkbox"
                {...register('terms.acceptPrivacy')}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <label htmlFor="acceptPrivacy" className="ml-3 text-sm text-zinc-700">
              I accept the{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Privacy Policy
              </a>{' '}
              <span className="text-red-500">*</span>
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
            <span className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 animate-spin"
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
            'Create Company Account'
          )}
        </button>
      </div>
    </div>
  );
}
