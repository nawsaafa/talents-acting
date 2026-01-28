import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { getTalentProfileByUserId } from '@/lib/talents/queries';
import { getProfessionalByUserId } from '@/lib/professional/queries';
import { getCompanyByUserId } from '@/lib/company/queries';
import { getMyRequestCounts } from '@/lib/contact-requests/actions';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userRole = session.user.role as 'TALENT' | 'PROFESSIONAL' | 'COMPANY' | 'ADMIN';

  // Redirect admin users to admin dashboard
  if (userRole === 'ADMIN') {
    redirect('/admin');
  }

  // Get user name based on role
  let userName = '';
  let pendingRequests = 0;

  try {
    const requestCounts = await getMyRequestCounts();
    pendingRequests = requestCounts?.received?.pending || 0;

    if (userRole === 'TALENT') {
      const profile = await getTalentProfileByUserId(session.user.id);
      userName = profile
        ? `${profile.firstName} ${profile.lastName}`
        : session.user.email?.split('@')[0] || '';
    } else if (userRole === 'PROFESSIONAL') {
      const profile = await getProfessionalByUserId(session.user.id);
      userName = profile
        ? `${profile.firstName} ${profile.lastName}`
        : session.user.email?.split('@')[0] || '';
    } else if (userRole === 'COMPANY') {
      const company = await getCompanyByUserId(session.user.id);
      userName = company?.companyName || session.user.email?.split('@')[0] || '';
    }
  } catch {
    userName = session.user.email?.split('@')[0] || '';
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-black)]">
      {/* Cinematic background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-black)] to-[var(--color-dark)]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-gold)]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-gold)]/[0.02] rounded-full blur-[120px]" />
      </div>

      <DashboardSidebar userRole={userRole} userName={userName} pendingRequests={pendingRequests} />

      <main className="flex-1 pl-72 relative z-10">
        <div className="max-w-7xl mx-auto p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
