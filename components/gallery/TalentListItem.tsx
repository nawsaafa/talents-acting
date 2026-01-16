'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle, Eye, Ruler } from 'lucide-react';
import { Card } from '@/components/ui';
import { SearchHighlight } from '@/components/search';
import type { PublicTalentProfile } from '@/lib/talents/queries';

interface TalentListItemProps {
  talent: PublicTalentProfile;
  searchQuery?: string;
  onQuickView: (talent: PublicTalentProfile) => void;
}

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  NON_BINARY: 'Non-Binary',
  OTHER: 'Other',
};

const PHYSIQUE_LABELS: Record<string, string> = {
  SLIM: 'Slim',
  AVERAGE: 'Average',
  ATHLETIC: 'Athletic',
  MUSCULAR: 'Muscular',
  CURVY: 'Curvy',
  PLUS_SIZE: 'Plus Size',
};

export function TalentListItem({ talent, searchQuery, onQuickView }: TalentListItemProps) {
  const displayPhoto =
    talent.photo || (talent.photos && talent.photos.length > 0 ? talent.photos[0] : null);

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(talent);
  }

  return (
    <Link href={`/talents/${talent.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        {/* Horizontal layout on md+, stacked on mobile */}
        <div className="flex flex-col sm:flex-row">
          {/* Photo */}
          <div className="relative w-full sm:w-[120px] aspect-[3/4] sm:aspect-[3/4] flex-shrink-0 bg-gray-100">
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt={talent.firstName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 120px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-3xl text-gray-400">{talent.firstName.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div>
              {/* Header with name and availability */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {searchQuery ? (
                    <SearchHighlight text={talent.firstName} query={searchQuery} />
                  ) : (
                    talent.firstName
                  )}
                </h3>
                {talent.isAvailable && (
                  <span className="flex-shrink-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Available
                  </span>
                )}
              </div>

              {/* Attributes row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                <span>{GENDER_LABELS[talent.gender]}</span>
                <span className="text-gray-300">|</span>
                <span>
                  {talent.ageRangeMin}-{talent.ageRangeMax} years
                </span>
                {talent.height && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      {talent.height}cm
                    </span>
                  </>
                )}
                {talent.physique && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span>{PHYSIQUE_LABELS[talent.physique]}</span>
                  </>
                )}
              </div>

              {/* Location */}
              {talent.location && (
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{talent.location}</span>
                </div>
              )}

              {/* Skills */}
              {talent.performanceSkills && talent.performanceSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {talent.performanceSkills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {talent.performanceSkills.length > 5 && (
                    <span className="inline-block text-gray-500 text-xs px-2 py-1">
                      +{talent.performanceSkills.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick View Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleQuickView}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Quick View
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
