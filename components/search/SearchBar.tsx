'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { getSearchSuggestions, type SearchSuggestion } from '@/lib/search/search-queries';
import { addRecentSearch } from '@/lib/search/recent-searches';
import { isValidSearchQuery } from '@/lib/search/search-utils';
import { SearchSuggestions } from './SearchSuggestions';
import { RecentSearches } from './RecentSearches';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

/**
 * Search bar with autocomplete suggestions and recent searches.
 * Updates URL params for shareable search links.
 */
export function SearchBar({
  placeholder = 'Search talents by name, skills, location...',
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL param
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with URL changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
    // Only sync from URL to state, not the other way
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounced suggestion fetching
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Submit search (update URL)
  const submitSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();

    // Build new URL params
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed && isValidSearchQuery(trimmed)) {
      params.set('q', trimmed);
      params.delete('page'); // Reset pagination on new search
      addRecentSearch(trimmed);
    } else {
      params.delete('q');
    }

    setIsOpen(false);

    startTransition(() => {
      router.push(`/talents?${params.toString()}`);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    submitSearch('');
    inputRef.current?.focus();
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    const name = suggestion.lastName
      ? `${suggestion.firstName} ${suggestion.lastName}`
      : suggestion.firstName;
    setQuery(name);
    submitSearch(name);
  };

  const handleRecentSelect = (recentQuery: string) => {
    setQuery(recentQuery);
    submitSearch(recentQuery);
  };

  const showDropdown = isOpen && (query.length > 0 || suggestions.length > 0);
  const showRecentSearches = isOpen && query.length === 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isPending ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          aria-label="Search talents"
          aria-autocomplete="list"
          aria-controls="search-listbox"
          aria-expanded={showDropdown}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {(showDropdown || showRecentSearches) && (
        <div
          id="search-listbox"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          {showRecentSearches ? (
            <RecentSearches onSelect={handleRecentSelect} onClear={() => setIsOpen(false)} />
          ) : (
            <SearchSuggestions
              suggestions={suggestions}
              query={query}
              onSelect={handleSuggestionSelect}
              isLoading={isLoadingSuggestions}
            />
          )}
        </div>
      )}
    </div>
  );
}
