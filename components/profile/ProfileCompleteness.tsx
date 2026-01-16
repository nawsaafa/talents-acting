"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";
import type { TalentProfile } from "@prisma/client";
import {
  calculateCompleteness,
  getCompletenessStatus,
  getTopMissingFields,
  type FieldCategory,
} from "@/lib/profile/completeness";
import { cn } from "@/lib/utils";

interface ProfileCompletenessProps {
  profile: Partial<TalentProfile> | null | undefined;
  showDetails?: boolean;
  className?: string;
}

const CATEGORY_LABELS: Record<FieldCategory, string> = {
  basic: "Basic Info",
  physical: "Physical Attributes",
  skills: "Skills",
  media: "Media",
  professional: "Professional",
};

const CATEGORY_COLORS: Record<FieldCategory, string> = {
  basic: "bg-blue-500",
  physical: "bg-purple-500",
  skills: "bg-green-500",
  media: "bg-orange-500",
  professional: "bg-teal-500",
};

export function ProfileCompleteness({
  profile,
  showDetails = true,
  className,
}: ProfileCompletenessProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const result = calculateCompleteness(profile);
  const status = getCompletenessStatus(result.percentage);
  const topMissing = getTopMissingFields(result, 5);

  const statusColors = {
    red: "text-red-600 bg-red-50 border-red-200",
    yellow: "text-yellow-700 bg-yellow-50 border-yellow-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200",
  };

  return (
    <div className={cn("rounded-lg border", statusColors[status.color], className)}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {result.percentage === 100 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <div>
              <p className="font-medium">{status.label}</p>
              <p className="text-sm opacity-75">
                {result.percentage}% complete ({result.earnedPoints}/{result.totalPoints} points)
              </p>
            </div>
          </div>

          {showDetails && result.missingFields.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-black/5 transition-colors"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Hide details" : "Show details"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-white/50 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              result.percentage < 25 && "bg-red-500",
              result.percentage >= 25 && result.percentage < 50 && "bg-yellow-500",
              result.percentage >= 50 && result.percentage < 75 && "bg-blue-500",
              result.percentage >= 75 && "bg-green-500"
            )}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>

      {/* Category breakdown (always visible) */}
      <div className="px-4 pb-4">
        <div className="flex gap-1">
          {(Object.keys(result.categoryScores) as FieldCategory[]).map((category) => {
            const score = result.categoryScores[category];
            return (
              <div
                key={category}
                className="flex-1 group relative"
                title={`${CATEGORY_LABELS[category]}: ${score.percentage}%`}
              >
                <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", CATEGORY_COLORS[category])}
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {CATEGORY_LABELS[category]}: {score.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded details */}
      {showDetails && isExpanded && result.missingFields.length > 0 && (
        <div className="border-t px-4 py-3 bg-white/50">
          <p className="text-sm font-medium mb-2">Top fields to complete:</p>
          <ul className="space-y-1">
            {topMissing.map((field) => (
              <li
                key={field.field}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      CATEGORY_COLORS[field.category]
                    )}
                  />
                  {field.label}
                </span>
                <span className="text-gray-500 text-xs">+{field.weight} pts</span>
              </li>
            ))}
          </ul>

          {result.missingFields.length > 5 && (
            <p className="mt-2 text-xs text-gray-500">
              And {result.missingFields.length - 5} more fields...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Compact version for dashboard sidebar
interface ProfileCompletenessCompactProps {
  profile: Partial<TalentProfile> | null | undefined;
  className?: string;
}

export function ProfileCompletenessCompact({
  profile,
  className,
}: ProfileCompletenessCompactProps) {
  const result = calculateCompleteness(profile);
  const status = getCompletenessStatus(result.percentage);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-12 h-12">
        {/* Circular progress */}
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            strokeWidth="4"
            stroke="currentColor"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            strokeWidth="4"
            stroke="currentColor"
            fill="none"
            strokeDasharray={`${(result.percentage / 100) * 125.6} 125.6`}
            strokeLinecap="round"
            className={cn(
              result.percentage < 25 && "text-red-500",
              result.percentage >= 25 && result.percentage < 50 && "text-yellow-500",
              result.percentage >= 50 && result.percentage < 75 && "text-blue-500",
              result.percentage >= 75 && "text-green-500"
            )}
          />
        </svg>
        {/* Percentage in center */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {result.percentage}%
        </span>
      </div>
      <div>
        <p className="text-sm font-medium">{status.label}</p>
        <p className="text-xs text-gray-500">
          {result.missingFields.length} fields remaining
        </p>
      </div>
    </div>
  );
}
