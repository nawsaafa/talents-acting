import { redirect } from 'next/navigation';
import { Container } from '@/components/layout';
import { Card, CardBody } from '@/components/ui';
import { FolderX } from 'lucide-react';
import { auth } from '@/lib/auth/auth';
import { getUserSubscriptionByRole } from '@/lib/payment/queries';
import { getMyCollections } from '@/lib/collections/actions';
import { CollectionsPageClient } from './CollectionsPageClient';

export const metadata = {
  title: 'My Collections | Acting Institute',
  description: 'Organize talents into project-based collections',
};

export default async function CollectionsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/collections');
  }

  // Only professionals and companies can use collections
  const allowedRoles = ['PROFESSIONAL', 'COMPANY', 'ADMIN'];
  if (!allowedRoles.includes(session.user.role)) {
    return (
      <Container className="py-8">
        <Card>
          <CardBody className="text-center py-12">
            <FolderX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Collections Not Available</h2>
            <p className="text-gray-600">
              Collections are available for professional and company accounts.
            </p>
          </CardBody>
        </Card>
      </Container>
    );
  }

  // Check subscription
  const subscription = await getUserSubscriptionByRole(session.user.id, session.user.role);
  const hasActiveSubscription =
    session.user.role === 'ADMIN' ||
    subscription?.status === 'ACTIVE' ||
    subscription?.status === 'TRIAL';

  if (!hasActiveSubscription) {
    const billingPath =
      session.user.role === 'COMPANY'
        ? '/dashboard/company/payment'
        : '/dashboard/professional/payment';

    return (
      <Container className="py-8">
        <Card>
          <CardBody className="text-center py-12">
            <FolderX className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Subscription Required</h2>
            <p className="text-gray-600 mb-4">
              An active subscription is required to use collections.
            </p>
            <a
              href={billingPath}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Subscribe Now
            </a>
          </CardBody>
        </Card>
      </Container>
    );
  }

  const collections = await getMyCollections();

  return (
    <Container className="py-8">
      <CollectionsPageClient initialCollections={collections} />
    </Container>
  );
}
