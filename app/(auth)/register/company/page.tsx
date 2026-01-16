import { Metadata } from 'next';
import { RegistrationWizard } from '@/components/company/RegistrationWizard';

export const metadata: Metadata = {
  title: 'Company Registration - Talents Acting',
  description: 'Register your company to access the Talents Acting database',
};

export default function CompanyRegistrationPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Company Registration
          </h1>
          <p className="mt-3 text-lg text-zinc-600">
            Register your production company, talent agency, or organization to access our
            comprehensive talent database.
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 text-sm text-blue-700">
              <p>
                <strong>Registration Process:</strong> After completing this form, you will receive
                a verification email. Once your email is verified, our team will review your
                application. Approved companies gain full access to the talent database and can
                invite team members.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <RegistrationWizard />
      </div>
    </div>
  );
}
