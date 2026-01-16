import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getProfessionalByUserId } from '@/lib/professional/queries';
import { ProfileForm } from './ProfileForm';

export const metadata: Metadata = {
  title: 'Edit Profile - Talents Acting',
  description: 'Edit your professional profile',
};

export default async function ProfessionalProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await getProfessionalByUserId(session.user.id);

  if (!profile) {
    redirect('/register/professional');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Edit Profile</h1>
          <p className="mt-1 text-zinc-600">Update your professional information.</p>
        </div>

        {/* Profile Form */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <ProfileForm
            initialData={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              profession: profile.profession,
              company: profile.company || '',
              phone: profile.phone || '',
              website: profile.website || '',
            }}
            email={profile.user.email}
            emailVerified={profile.emailVerified}
          />
        </div>
      </div>
    </div>
  );
}
