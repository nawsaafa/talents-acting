import { notFound, redirect } from 'next/navigation';
import { Container } from '@/components/layout';
import { auth } from '@/lib/auth/auth';
import { getCollection } from '@/lib/collections/actions';
import { CollectionDetailPageClient } from './CollectionDetailPageClient';

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CollectionDetailPageProps) {
  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    return {
      title: 'Collection Not Found | Acting Institute',
    };
  }

  return {
    title: `${collection.name} | Collections | Acting Institute`,
    description: collection.description || `Collection with ${collection.talents.length} talents`,
  };
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/collections');
  }

  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    notFound();
  }

  const isOwner = collection.ownerId === session.user.id || session.user.role === 'ADMIN';

  return (
    <Container className="py-8">
      <CollectionDetailPageClient collection={collection} isOwner={isOwner} />
    </Container>
  );
}
