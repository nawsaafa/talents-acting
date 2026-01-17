import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getTalentSubscription, getUserBillingHistory } from '@/lib/payment/queries';
import { BillingPageContent } from './BillingPageContent';

export const metadata: Metadata = {
  title: 'Billing - Talents Acting',
  description: 'Manage your subscription and billing',
};

export default async function TalentBillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [subscription, billingHistory] = await Promise.all([
    getTalentSubscription(session.user.id),
    getUserBillingHistory(session.user.id),
  ]);

  return (
    <BillingPageContent
      subscription={subscription}
      billingHistory={billingHistory}
      userRole="TALENT"
    />
  );
}
