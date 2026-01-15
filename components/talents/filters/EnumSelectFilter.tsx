"use client";

import type { FilterOption } from "@/lib/talents/filter-options";

interface EnumSelectFilterProps {
  label: string;
  options: readonly FilterOption[];
  value?: string | string[];
  multi?: boolean;
  onChange: (value: string | string[] | undefined) => void;
}

export function EnumSelectFilter({
  label,
  options,
  value,
  multi = false,
  onChange,
}: EnumSelectFilterProps) {
  const selectedValues = Array.isArray(value)
    ? value
    : value
    ? [value]
    : [];

  const handleSingleSelect = (optionValue: string) => {
    if (value === optionValue) {
      onChange(undefined);
    } else {
      onChange(optionValue);
    }
  };

  const handleMultiSelect = (optionValue: string) => {
    if (selectedValues.includes(optionValue)) {
      const newValues = selectedValues.filter((v) => v !== optionValue);
      onChange(newValues.length > 0 ? newValues : undefined);
    } else {
      onChange([...selectedValues, optionValue]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-700">{label}</label>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);

          return (
            <label
              key={option.value}
              className="flex items-center gap-2 py-1 px-1 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={label.replace(/\s+/g, "-").toLowerCase()}
                checked={isSelected}
                onChange={() =>
                  multi
                    ? handleMultiSelect(option.value)
                    : handleSingleSelect(option.value)
                }
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
