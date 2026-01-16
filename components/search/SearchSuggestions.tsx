'use client';

import Image from 'next/image';
import { MapPin, User } from 'lucide-react';
import type { SearchSuggestion } from '@/lib/search/search-queries';
import { SearchHighlight } from './SearchHighlight';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  query: string;
  onSelect: (suggestion: SearchSuggestion) => void;
  isLoading?: boolean;
}

/**
 * Dropdown showing search suggestions with talent preview.
 */
export function SearchSuggestions({
  suggestions,
  query,
  onSelect,
  isLoading = false,
}: SearchSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="py-4 px-3 text-center">
        <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <span className="ml-2 text-sm text-gray-500">Searching...</span>
      </div>
    );
  }

  if (suggestions.length === 0 && query.length >= 2) {
    return (
      <div className="py-4 px-3 text-center text-sm text-gray-500">
        No talents found for &quot;{query}&quot;
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="py-2">
      <div className="px-3 mb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Suggestions
        </span>
      </div>

      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <button
              type="button"
              onClick={() => onSelect(suggestion)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              {/* Avatar */}
              <div className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                {suggestion.photo ? (
                  <Image
                    src={suggestion.photo}
                    alt={suggestion.firstName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  <SearchHighlight
                    text={
                      suggestion.lastName
                        ? `${suggestion.firstName} ${suggestion.lastName}`
                        : suggestion.firstName
                    }
                    query={query}
                  />
                </div>
                {suggestion.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{suggestion.location}</span>
                  </div>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
