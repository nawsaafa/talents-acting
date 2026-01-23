'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, X } from 'lucide-react';
import { Card } from '@/components/ui';
import type { CollectionTalentInfo } from '@/lib/collections/types';

interface CollectionTalentCardProps {
  talent: CollectionTalentInfo;
  onRemove?: (talentProfileId: string) => void;
  isRemoving?: boolean;
}

const GENDER_LABELS: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  NON_BINARY: 'Non-Binary',
  OTHER: 'Other',
};

export function CollectionTalentCard({ talent, onRemove, isRemoving }: CollectionTalentCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove && !isRemoving) {
      onRemove(talent.talentProfileId);
    }
  };

  return (
    <div className="relative group">
      <Link href={`/talents/${talent.talentProfileId}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
          {/* Photo */}
          <div className="relative aspect-[3/4] bg-gray-100">
            {talent.photo ? (
              <Image
                src={talent.photo}
                alt={talent.firstName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-4xl text-gray-400">{talent.firstName.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {talent.firstName}
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
          </div>
        </Card>
      </Link>

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 disabled:opacity-50"
          aria-label="Remove from collection"
        >
          <X className={`w-4 h-4 ${isRemoving ? 'text-gray-400' : 'text-red-500'}`} />
        </button>
      )}
    </div>
  );
}
