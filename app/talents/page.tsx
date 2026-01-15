import { Suspense } from "react";
import { Container } from "@/components/layout";
import { Loading } from "@/components/ui";
import { TalentCard, FilterPanel } from "@/components/talents";
import { SearchBar } from "@/components/search";
import { getPublicTalents } from "@/lib/talents/queries";
import { parseFilterParams } from "@/lib/talents/filters";
import { talentFilterSchema } from "@/lib/talents/validation";
import { ChevronLeft, ChevronRight, Users, Search } from "lucide-react";
import Link from "next/link";

interface TalentsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: "Talents | Acting Institute",
  description: "Discover talented actors, comedians, and performers",
};

async function TalentGrid({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  // Parse URL params and validate with schema
  const parsedParams = parseFilterParams(searchParams);
  const filters = talentFilterSchema.parse({
    ...parsedParams,
    page: parsedParams.page || 1,
    limit: parsedParams.limit || 12,
  });

  const { talents, total, page, totalPages, searchQuery } = await getPublicTalents(filters);

  if (talents.length === 0) {
    return (
      <div className="text-center py-12">
        {searchQuery ? (
          <>
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results for &quot;{searchQuery}&quot;
            </h3>
            <p className="text-gray-600">
              Try a different search term or adjust your filters.
            </p>
          </>
        ) : (
          <>
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No talents found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later.
            </p>
          </>
        )}
      </div>
    );
  }

  // Build current search params for pagination links
  const currentParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && key !== "page") {
      currentParams.set(key, value);
    }
  });

  return (
    <>
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {talents.length} of {total} talents
      </div>

      {/* Grid - adjusted for sidebar layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {talents.map((talent) => (
          <TalentCard key={talent.id} talent={talent} searchQuery={searchQuery || undefined} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {page > 1 && (
            <Link
              href={`/talents?${new URLSearchParams({
                ...Object.fromEntries(currentParams),
                page: String(page - 1),
              }).toString()}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Link>
          )}

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          {page < totalPages && (
            <Link
              href={`/talents?${new URLSearchParams({
                ...Object.fromEntries(currentParams),
                page: String(page + 1),
              }).toString()}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
      )}
    </>
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

        {/* Talent Grid */}
        <div className="flex-1 min-w-0">
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <Loading size="lg" />
              </div>
            }
          >
            <TalentGrid searchParams={params} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
