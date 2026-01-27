import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { isAdmin } from '@/lib/auth/utils';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getDashboardStats } from '@/lib/admin/queries';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  // Redirect if not admin
  if (!isAdmin(session.user.role)) {
    redirect('/');
  }

  // Get pending counts for sidebar badges
  const stats = await getDashboardStats();
  const pendingCounts = {
    talents: stats.pendingTalents,
    professionals: stats.pendingProfessionals,
    companies: stats.pendingCompanies,
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-black)]">
      {/* Cinematic background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-charcoal)] via-[var(--color-black)] to-[var(--color-dark)]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-gold)]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-gold)]/[0.02] rounded-full blur-[120px]" />
      </div>
      <AdminSidebar pendingCounts={pendingCounts} />
      <main className="flex-1 pl-72 relative z-10">
        <div className="max-w-7xl mx-auto p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
