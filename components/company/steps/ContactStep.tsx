'use client';

import { useFormContext } from 'react-hook-form';
import { ContactStepData } from '@/lib/company/validation';

interface ContactStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ContactStep({ onNext, onBack }: ContactStepProps) {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<{ contact: ContactStepData }>();

  const handleNext = async () => {
    const isValid = await trigger('contact');
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Contact Details</h2>
        <p className="mt-1 text-sm text-zinc-600">How can we reach your company?</p>
      </div>

      <div className="space-y-4">
        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-zinc-700">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register('contact.contactEmail')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact?.contactEmail
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="contact@yourcompany.com"
          />
          {errors.contact?.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.contactEmail.message}</p>
          )}
          <p className="mt-1 text-xs text-zinc-500">
            This email will be used for talent communications.
          </p>
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-zinc-700">
            Phone Number
          </label>
          <input
            id="contactPhone"
            type="tel"
            {...register('contact.contactPhone')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact?.contactPhone
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.contact?.contactPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.contactPhone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-zinc-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register('contact.address')}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact?.address
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-zinc-300 focus:border-blue-500'
            }`}
            placeholder="123 Business Street"
          />
          {errors.contact?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.contact.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-zinc-700">
              City
            </label>
            <input
              id="city"
              type="text"
              {...register('contact.city')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contact?.city
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500'
              }`}
              placeholder="Los Angeles"
            />
            {errors.contact?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.city.message}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-zinc-700">
              Country
            </label>
            <input
              id="country"
              type="text"
              {...register('contact.country')}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contact?.country
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-zinc-300 focus:border-blue-500'
              }`}
              placeholder="United States"
            />
            {errors.contact?.country && (
              <p className="mt-1 text-sm text-red-600">{errors.contact.country.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
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
