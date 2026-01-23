import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { CollectionTalentCard } from '@/components/collections';
import { getShareLinkByToken } from '@/lib/collections/queries';
import { recordShareLinkAccess } from '@/lib/collections/actions';
import { Users, ArrowLeft, Download } from 'lucide-react';
import { SharedCollectionExport } from './SharedCollectionExport';

interface SharedCollectionPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: SharedCollectionPageProps) {
  const { token } = await params;
  const data = await getShareLinkByToken(token);

  if (!data) {
    return {
      title: 'Collection Not Found | Acting Institute',
    };
  }

  return {
    title: `${data.collection.name} | Shared Collection | Acting Institute`,
    description:
      data.collection.description ||
      `Shared collection with ${data.collection.talents.length} talents`,
  };
}

export default async function SharedCollectionPage({ params }: SharedCollectionPageProps) {
  const { token } = await params;
  const data = await getShareLinkByToken(token);

  if (!data) {
    return (
      <Container className="py-8">
        <Card className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Collection Not Found</h2>
          <p className="text-gray-600 mb-6">This share link may have expired or been revoked.</p>
          <Link href="/talents">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Talents
            </Button>
          </Link>
        </Card>
      </Container>
    );
  }

  // Record access and notify owner (non-blocking)
  recordShareLinkAccess(token);

  const { collection } = data;

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full mb-4">
          <Users className="w-4 h-4" />
          Shared Collection
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{collection.name}</h1>
            {collection.description && (
              <p className="text-gray-600 mt-1">{collection.description}</p>
            )}
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
              <Users className="w-4 h-4" />
              <span>
                {collection.talents.length} {collection.talents.length === 1 ? 'talent' : 'talents'}
              </span>
            </div>
          </div>

          <SharedCollectionExport collection={collection} />
        </div>
      </div>

      {/* Talents Grid */}
      {collection.talents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collection.talents.map((talent) => (
            <CollectionTalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No talents in this collection</h3>
          <p className="text-gray-600">This collection is empty.</p>
        </div>
      )}
    </Container>
  );
}
