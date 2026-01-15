import { Suspense } from "react";
import { Container } from "@/components/layout";
import { Loading } from "@/components/ui";
import { TalentCard, TalentFilters } from "@/components/talents";
import { getPublicTalents } from "@/lib/talents/queries";
import { talentFilterSchema } from "@/lib/talents/validation";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import Link from "next/link";

interface TalentsPageProps {
  searchParams: Promise<{
    search?: string;
    gender?: string;
    ageMin?: string;
    ageMax?: string;
    available?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: "Talents | Acting Institute",
  description: "Discover talented actors, comedians, and performers",
};

async function TalentGrid({
  searchParams,
}: {
  searchParams: Awaited<TalentsPageProps["searchParams"]>;
}) {
  // Parse and validate filters
  const filters = talentFilterSchema.parse({
    search: searchParams.search,
    gender: searchParams.gender,
    ageMin: searchParams.ageMin ? parseInt(searchParams.ageMin) : undefined,
    ageMax: searchParams.ageMax ? parseInt(searchParams.ageMax) : undefined,
    isAvailable:
      searchParams.available === "true"
        ? true
        : searchParams.available === "false"
        ? false
        : undefined,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  });

  const { talents, total, page, totalPages } = await getPublicTalents(filters);

  if (talents.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No talents found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {talents.length} of {total} talents
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {talents.map((talent) => (
          <TalentCard key={talent.id} talent={talent} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {page > 1 && (
            <Link
              href={`/talents?${new URLSearchParams({
                ...searchParams,
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
                ...searchParams,
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Talents</h1>
        <p className="mt-2 text-gray-600">
          Browse our database of actors, comedians, and performers
        </p>
      </div>

      {/* Filters */}
      <Suspense fallback={<div className="h-20 bg-gray-100 rounded-lg animate-pulse" />}>
        <TalentFilters />
      </Suspense>

      {/* Talent Grid */}
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Loading size="lg" />
          </div>
        }
      >
        <TalentGrid searchParams={params} />
      </Suspense>
    </Container>
  );
}
