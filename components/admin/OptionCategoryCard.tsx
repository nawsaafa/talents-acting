'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OptionCategoryCardProps {
  title: string;
  count: number;
  options: readonly string[];
  groups?: Record<string, readonly string[]>;
}

export function OptionCategoryCard({ title, count, options, groups }: OptionCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {count} options
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          {groups ? (
            // Grouped display
            <div className="space-y-4">
              {Object.entries(groups).map(([groupName, groupOptions]) => (
                <div key={groupName}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {groupName.replace(/([A-Z])/g, ' $1').trim()} ({groupOptions.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {groupOptions.map((option) => (
                      <span
                        key={option}
                        className="inline-block px-2 py-1 text-sm bg-white border border-gray-200 rounded text-gray-700"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Flat display
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <span
                  key={option}
                  className="inline-block px-2 py-1 text-sm bg-white border border-gray-200 rounded text-gray-700"
                >
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
