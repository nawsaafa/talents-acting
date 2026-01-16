"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Users } from "lucide-react";
import { TalentCardEnhanced } from "./TalentCardEnhanced";
import { TalentListItem } from "./TalentListItem";
import { InfiniteScrollLoader } from "./InfiniteScrollLoader";
import { QuickViewModal } from "./QuickViewModal";
import { ViewToggle, type ViewMode } from "./ViewToggle";
import { loadMoreTalents } from "@/lib/talents/actions";
import { parseFilterParams } from "@/lib/talents/filters";
import type { PublicTalentProfile } from "@/lib/talents/queries";
import type { TalentFilterInput } from "@/lib/talents/validation";

interface TalentGalleryProps {
  initialTalents: PublicTalentProfile[];
  initialTotal: number;
  initialHasMore: boolean;
  searchQuery?: string;
}

export function TalentGallery({
  initialTalents,
  initialTotal,
  initialHasMore,
  searchQuery,
}: TalentGalleryProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State
  const [talents, setTalents] = useState<PublicTalentProfile[]>(initialTalents);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<PublicTalentProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View mode from URL or default to grid
  const viewParam = searchParams.get("view") as ViewMode | null;
  const [view, setView] = useState<ViewMode>(viewParam || "grid");

  // Get current filters from URL
  const getFilters = useCallback((): TalentFilterInput => {
    const params: Record<string, string | undefined> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return parseFilterParams(params) as TalentFilterInput;
  }, [searchParams]);

  // Reset state when filters/search change
  useEffect(() => {
    setTalents(initialTalents);
    setPage(1);
    setHasMore(initialHasMore);
  }, [initialTalents, initialHasMore]);

  // Sync view with URL
  useEffect(() => {
    const urlView = searchParams.get("view") as ViewMode | null;
    if (urlView && urlView !== view) {
      setView(urlView);
    }
  }, [searchParams, view]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const filters = getFilters();

    startTransition(async () => {
      try {
        const result = await loadMoreTalents(nextPage, filters, searchQuery);
        setTalents((prev) => [...prev, ...result.talents]);
        setPage(nextPage);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Failed to load more talents:", error);
      } finally {
        setIsLoading(false);
      }
    });
  }, [isLoading, hasMore, page, getFilters, searchQuery]);

  // Quick view handlers
  const handleQuickView = useCallback((talent: PublicTalentProfile) => {
    setSelectedTalent(talent);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTalent(null);
  }, []);

  // Empty state
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

  return (
    <>
      {/* Header with count and view toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {talents.length} of {initialTotal} talents
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {talents.map((talent, index) => (
            <TalentCardEnhanced
              key={talent.id}
              talent={talent}
              searchQuery={searchQuery}
              onQuickView={handleQuickView}
              index={index}
              priority={index < 6}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="space-y-4">
          {talents.map((talent) => (
            <TalentListItem
              key={talent.id}
              talent={talent}
              searchQuery={searchQuery}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <InfiniteScrollLoader
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading || isPending}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        talent={selectedTalent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
