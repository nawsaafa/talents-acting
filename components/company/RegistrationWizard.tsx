'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { ProgressIndicator } from './ProgressIndicator';
import { AccountStep } from './steps/AccountStep';
import { CompanyStep } from './steps/CompanyStep';
import { ContactStep } from './steps/ContactStep';
import { TermsStep } from './steps/TermsStep';
import {
  accountStepSchema,
  companyStepSchema,
  contactStepSchema,
  termsStepSchema,
} from '@/lib/company/validation';
import { registerCompany } from '@/lib/company/actions';

// Combined schema for all steps
const wizardSchema = z.object({
  account: accountStepSchema,
  company: companyStepSchema,
  contact: contactStepSchema,
  terms: termsStepSchema,
});

type WizardFormData = z.infer<typeof wizardSchema>;

export function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: 'onChange',
    defaultValues: {
      account: {
        email: '',
        password: '',
        confirmPassword: '',
      },
      company: {
        companyName: '',
        industry: '',
        description: '',
        website: '',
      },
      contact: {
        contactEmail: '',
        contactPhone: '',
        address: '',
        city: '',
        country: '',
      },
      terms: {
        acceptTerms: false,
        acceptPrivacy: false,
      },
    },
  });

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: WizardFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await registerCompany({
        email: data.account.email,
        password: data.account.password,
        companyName: data.company.companyName,
        industry: data.company.industry,
        description: data.company.description || undefined,
        website: data.company.website || undefined,
        contactEmail: data.contact.contactEmail,
        contactPhone: data.contact.contactPhone || undefined,
        address: data.contact.address || undefined,
        city: data.contact.city || undefined,
        country: data.contact.country || undefined,
      });

      if (result.success) {
        router.push('/register/company/success');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <ProgressIndicator currentStep={step} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {step === 1 && <AccountStep onNext={nextStep} />}
            {step === 2 && <CompanyStep onNext={nextStep} onBack={prevStep} />}
            {step === 3 && <ContactStep onNext={nextStep} onBack={prevStep} />}
            {step === 4 && <TermsStep onBack={prevStep} isSubmitting={isSubmitting} />}
          </form>
        </FormProvider>
      </div>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-zinc-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in here
        </a>
      </p>
    </div>
  );
}
