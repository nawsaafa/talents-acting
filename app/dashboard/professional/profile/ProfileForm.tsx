'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  professionalProfileUpdateSchema,
  ProfessionalProfileUpdateData,
  PROFESSION_OPTIONS,
} from '@/lib/professional/validation';
import { updateProfile, resendVerificationEmail } from '@/lib/professional/actions';

interface ProfileFormProps {
  initialData: ProfessionalProfileUpdateData;
  email: string;
  emailVerified: boolean;
}

export function ProfileForm({ initialData, email, emailVerified }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfessionalProfileUpdateData>({
    resolver: zodResolver(professionalProfileUpdateSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfessionalProfileUpdateData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await updateProfile(data);

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    setMessage(null);

    try {
      const result = await resendVerificationEmail();

      if (result.success) {
        setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send verification email' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSendingVerification(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`rounded-md p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-medium text-zinc-700">Email Address</label>
        <div className="mt-1 flex items-center gap-3">
          <input
            type="email"
            value={email}
            disabled
            className="block w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-zinc-500"
          />
          {emailVerified ? (
            <span className="flex items-center gap-1 whitespace-nowrap text-sm text-green-600">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isSendingVerification}
              className="whitespace-nowrap text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50"
            >
              {isSendingVerification ? 'Sending...' : 'Resend verification'}
            </button>
          )}
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName
                ? 'border-red-300 focus:border-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName
                ? 'border-red-300 focus:border-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Profession */}
      <div>
        <label htmlFor="profession" className="block text-sm font-medium text-zinc-700">
          Profession
        </label>
        <select
          id="profession"
          {...register('profession')}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.profession
              ? 'border-red-300 focus:border-red-500'
              : 'border-zinc-300 focus:border-blue-500'
          }`}
        >
          <option value="">Select your profession</option>
          {PROFESSION_OPTIONS.map((profession) => (
            <option key={profession} value={profession}>
              {profession}
            </option>
          ))}
        </select>
        {errors.profession && (
          <p className="mt-1 text-sm text-red-600">{errors.profession.message}</p>
        )}
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-zinc-700">
          Company <span className="text-zinc-400">(Optional)</span>
        </label>
        <input
          id="company"
          type="text"
          {...register('company')}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.company
              ? 'border-red-300 focus:border-red-500'
              : 'border-zinc-300 focus:border-blue-500'
          }`}
        />
        {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
          Phone <span className="text-zinc-400">(Optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone
              ? 'border-red-300 focus:border-red-500'
              : 'border-zinc-300 focus:border-blue-500'
          }`}
          placeholder="+212 XXX XXX XXX"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-zinc-700">
          Website <span className="text-zinc-400">(Optional)</span>
        </label>
        <input
          id="website"
          type="url"
          {...register('website')}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.website
              ? 'border-red-300 focus:border-red-500'
              : 'border-zinc-300 focus:border-blue-500'
          }`}
          placeholder="https://example.com"
        />
        {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <a
          href="/dashboard/professional"
          className="rounded-md border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
