'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Loading } from '@/components/ui';

interface InfiniteScrollLoaderProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  rootMargin?: string;
}

export function InfiniteScrollLoader({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '200px',
}: InfiniteScrollLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(onLoadMore);

  // Keep callback ref updated inside useEffect
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMoreRef.current();
      }
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold: 0,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, rootMargin]);

  return (
    <div
      ref={sentinelRef}
      className="flex justify-center py-8"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {isLoading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loading size="sm" />
          <span>Loading more...</span>
        </div>
      )}
      {!hasMore && !isLoading && <p className="text-gray-500 text-sm">No more talents to show</p>}
    </div>
  );
}
