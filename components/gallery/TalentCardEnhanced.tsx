'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle, Eye } from 'lucide-react';
import { Card } from '@/components/ui';
import { SearchHighlight } from '@/components/search';
import type { PublicTalentProfile } from '@/lib/talents/queries';

interface TalentCardEnhancedProps {
  talent: PublicTalentProfile;
  searchQuery?: string;
  onQuickView: (talent: PublicTalentProfile) => void;
  index?: number;
  priority?: boolean;
}

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  NON_BINARY: 'Non-Binary',
  OTHER: 'Other',
};

export function TalentCardEnhanced({
  talent,
  searchQuery,
  onQuickView,
  index = 0,
  priority = false,
}: TalentCardEnhancedProps) {
  const displayPhoto =
    talent.photo || (talent.photos && talent.photos.length > 0 ? talent.photos[0] : null);

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(talent);
  }

  return (
    <div className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}>
      <Link href={`/talents/${talent.id}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-200 relative">
          {/* Photo */}
          <div className="relative aspect-[3/4] bg-gray-100">
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt={talent.firstName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={priority}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-4xl text-gray-400">{talent.firstName.charAt(0)}</span>
              </div>
            )}

            {/* Availability Badge */}
            {talent.isAvailable && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Available
              </div>
            )}

            {/* Hover Overlay with Quick Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center lg:flex hidden">
              <button
                type="button"
                onClick={handleQuickView}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Eye className="w-4 h-4" />
                Quick View
              </button>
            </div>

            {/* Mobile Quick View Button (always visible) */}
            <button
              type="button"
              onClick={handleQuickView}
              className="absolute bottom-2 right-2 lg:hidden bg-white/90 text-gray-900 p-2 rounded-full shadow-md hover:bg-white transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {searchQuery ? (
                <SearchHighlight text={talent.firstName} query={searchQuery} />
              ) : (
                talent.firstName
              )}
            </h3>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <span>{GENDER_LABELS[talent.gender]}</span>
              <span className="text-gray-300">|</span>
              <span>
                {talent.ageRangeMin}-{talent.ageRangeMax} years
              </span>
            </div>

            {talent.location && (
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{talent.location}</span>
              </div>
            )}

            {/* Skills Preview */}
            {talent.performanceSkills && talent.performanceSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {talent.performanceSkills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {talent.performanceSkills.length > 3 && (
                  <span className="inline-block text-gray-500 text-xs px-2 py-1">
                    +{talent.performanceSkills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </div>
  );
}
