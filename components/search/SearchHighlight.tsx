"use client";

import { useMemo } from "react";
import { extractSearchTerms, findMatchPositions } from "@/lib/search/search-utils";

interface SearchHighlightProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Highlights matching search terms in text.
 * If no query or no matches, renders text as-is.
 */
export function SearchHighlight({
  text,
  query,
  className = "",
  highlightClassName = "bg-yellow-200 text-yellow-900",
}: SearchHighlightProps) {
  const highlighted = useMemo(() => {
    if (!query || !text) {
      return null;
    }

    const terms = extractSearchTerms(query);
    if (terms.length === 0) {
      return null;
    }

    const positions = findMatchPositions(text, terms);
    if (positions.length === 0) {
      return null;
    }

    // Build segments with highlights
    const segments: Array<{ text: string; isHighlight: boolean }> = [];
    let lastEnd = 0;

    for (const [start, end] of positions) {
      // Add non-highlighted segment before this match
      if (start > lastEnd) {
        segments.push({
          text: text.slice(lastEnd, start),
          isHighlight: false,
        });
      }

      // Add highlighted segment
      segments.push({
        text: text.slice(start, end),
        isHighlight: true,
      });

      lastEnd = end;
    }

    // Add remaining non-highlighted text
    if (lastEnd < text.length) {
      segments.push({
        text: text.slice(lastEnd),
        isHighlight: false,
      });
    }

    return segments;
  }, [text, query]);

  // No highlights - render plain text
  if (!highlighted) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {highlighted.map((segment, index) =>
        segment.isHighlight ? (
          <mark key={index} className={highlightClassName}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </span>
  );
}
