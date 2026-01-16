import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { getCompanyByUserId } from '@/lib/company/queries';
import { ProfileForm } from './ProfileForm';

export const metadata: Metadata = {
  title: 'Edit Company Profile - Talents Acting',
  description: 'Edit your company profile on Talents Acting',
};

export default async function CompanyProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const company = await getCompanyByUserId(session.user.id);

  if (!company) {
    redirect('/register/company');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/company" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-zinc-900">Edit Company Profile</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Update your company information and contact details.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <ProfileForm
            initialData={{
              companyName: company.companyName,
              industry: company.industry,
              description: company.description,
              website: company.website,
              contactEmail: company.contactEmail,
              contactPhone: company.contactPhone,
              address: company.address,
              city: company.city,
              country: company.country,
            }}
          />
        </div>
      </div>
    </div>
  );
}
