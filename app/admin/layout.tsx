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
    <div className="flex min-h-screen bg-[var(--color-neutral-50)]">
      <AdminSidebar pendingCounts={pendingCounts} />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
