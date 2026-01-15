"use client";

import { useState, ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterSectionProps {
  title: string;
  activeCount?: number;
  onClear?: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function FilterSection({
  title,
  activeCount = 0,
  onClear,
  defaultOpen = true,
  children,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{title}</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "mt-4 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}

        {/* Clear section button */}
        {activeCount > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear {title.toLowerCase()}
          </button>
        )}
      </div>
    </div>
  );
}
