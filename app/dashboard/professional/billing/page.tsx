import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getProfessionalSubscription, getUserBillingHistory } from '@/lib/payment/queries';
import { BillingPageContent } from '../../talent/billing/BillingPageContent';

export const metadata: Metadata = {
  title: 'Billing - Talents Acting',
  description: 'Manage your subscription and billing',
};

export default async function ProfessionalBillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [subscription, billingHistory] = await Promise.all([
    getProfessionalSubscription(session.user.id),
    getUserBillingHistory(session.user.id),
  ]);

  return (
    <BillingPageContent
      subscription={subscription}
      billingHistory={billingHistory}
      userRole="PROFESSIONAL"
    />
  );
}
