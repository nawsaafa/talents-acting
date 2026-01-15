"use client";

import { useSyncExternalStore, useCallback } from "react";
import { Clock, X } from "lucide-react";
import {
  getRecentSearchQueries,
  removeRecentSearch,
  clearRecentSearches,
} from "@/lib/search/recent-searches";

interface RecentSearchesProps {
  onSelect: (query: string) => void;
  onClear?: () => void;
}

// Subscribe to localStorage changes for recent searches
function subscribeToRecentSearches(callback: () => void) {
  // Listen for storage events (cross-tab sync)
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot(): string[] {
  return [];
}

/**
 * Displays recent search queries from localStorage.
 * Allows selecting a recent search or clearing history.
 */
export function RecentSearches({ onSelect, onClear }: RecentSearchesProps) {
  // Use useSyncExternalStore for localStorage
  const searches = useSyncExternalStore(
    subscribeToRecentSearches,
    getRecentSearchQueries,
    getServerSnapshot
  );

  const forceUpdate = useCallback(() => {
    // Trigger a re-render by dispatching a storage event
    window.dispatchEvent(new Event("storage"));
  }, []);

  const handleRemove = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(query);
    forceUpdate();
  };

  const handleClearAll = () => {
    clearRecentSearches();
    forceUpdate();
    onClear?.();
  };

  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Recent Searches
        </span>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <ul>
        {searches.map((query) => (
          <li key={query}>
            <button
              type="button"
              onClick={() => onSelect(query)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="flex-1 truncate">{query}</span>
              <button
                type="button"
                onClick={(e) => handleRemove(query, e)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                aria-label={`Remove "${query}" from recent searches`}
              >
                <X className="w-3 h-3" />
              </button>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
