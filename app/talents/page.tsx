import { Suspense } from 'react';
import { Container } from '@/components/layout';
import { Loading } from '@/components/ui';
import { FilterPanel } from '@/components/talents';
import { SearchBar } from '@/components/search';
import { TalentGallery } from '@/components/gallery';
import { getPublicTalents } from '@/lib/talents/queries';
import { parseFilterParams } from '@/lib/talents/filters';
import { talentFilterSchema } from '@/lib/talents/validation';

interface TalentsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: 'Talents | Acting Institute',
  description: 'Discover talented actors, comedians, and performers',
};

async function TalentGalleryWrapper({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  // Parse URL params and validate with schema
  const parsedParams = parseFilterParams(searchParams);
  const filters = talentFilterSchema.parse({
    ...parsedParams,
    page: 1, // Always start at page 1, infinite scroll handles the rest
    limit: 12,
  });

  const { talents, total, totalPages, searchQuery } = await getPublicTalents(filters);

  return (
    <TalentGallery
      initialTalents={talents}
      initialTotal={total}
      initialHasMore={totalPages > 1}
      searchQuery={searchQuery || undefined}
    />
  );
}

export default async function TalentsPage({ searchParams }: TalentsPageProps) {
  const params = await searchParams;

  return (
    <Container className="py-8">
      {/* Header with Search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Talents</h1>
        <p className="mt-2 text-gray-600">
          Browse our database of actors, comedians, and performers
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-2xl">
          <Suspense fallback={<div className="h-11 bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      {/* Main content with sidebar layout */}
      <div className="flex gap-8">
        {/* Filter Panel (sidebar on desktop, drawer on mobile) */}
        <Suspense
          fallback={
            <div className="hidden lg:block w-72 h-96 bg-gray-100 rounded-lg animate-pulse" />
          }
        >
          <FilterPanel />
        </Suspense>

        {/* Talent Gallery */}
        <div className="flex-1 min-w-0">
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <Loading size="lg" />
              </div>
            }
          >
            <TalentGalleryWrapper searchParams={params} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
