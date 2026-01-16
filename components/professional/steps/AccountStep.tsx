'use client';

import { useFormContext } from 'react-hook-form';
import { AccountStepData } from '@/lib/professional/validation';

interface AccountStepProps {
  onNext: () => void;
}

export function AccountStep({ onNext }: AccountStepProps) {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<{ account: AccountStepData }>();

  const handleNext = async () => {
    const isValid = await trigger('account');
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Create Your Account</h2>
        <p className="mt-1 text-sm text-zinc-600">Enter your email and choose a secure password.</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('account.email')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.account?.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="you@example.com"
          />
          {errors.account?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.account.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('account.password')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.account?.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Minimum 8 characters"
          />
          {errors.account?.password && (
            <p className="mt-1 text-sm text-red-600">{errors.account.password.message}</p>
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
            autoComplete="new-password"
            {...register('account.confirmPassword')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.account?.confirmPassword
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="Re-enter your password"
          />
          {errors.account?.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.account.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
