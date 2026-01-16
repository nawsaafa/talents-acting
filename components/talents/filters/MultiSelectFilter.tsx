'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

interface MultiSelectFilterProps {
  label: string;
  options: readonly string[];
  value?: string[];
  onChange: (value: string[] | undefined) => void;
  placeholder?: string;
}

export function MultiSelectFilter({
  label,
  options,
  value = [],
  onChange,
  placeholder = 'Search...',
}: MultiSelectFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      const newValues = value.filter((v) => v !== option);
      onChange(newValues.length > 0 ? newValues : undefined);
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (option: string) => {
    const newValues = value.filter((v) => v !== option);
    onChange(newValues.length > 0 ? newValues : undefined);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-700">{label}</label>

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Options list */}
      <div className="max-h-40 overflow-y-auto space-y-1">
        {filteredOptions.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">No options found</p>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = value.includes(option);

            return (
              <label
                key={option}
                className="flex items-center gap-2 py-1 px-1 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
