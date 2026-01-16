'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Modal, Button } from '@/components/ui';
import { ChevronLeft, ChevronRight, MapPin, Ruler, User } from 'lucide-react';
import type { PublicTalentProfile } from '@/lib/talents/queries';

interface QuickViewModalProps {
  talent: PublicTalentProfile | null;
  isOpen: boolean;
  onClose: () => void;
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

// Inner component that resets when key changes
function QuickViewContent({
  talent,
  onClose,
}: {
  talent: PublicTalentProfile;
  onClose: () => void;
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Get all photos (primary + gallery)
  const allPhotos = [talent.photo, ...(talent.photos || [])].filter((p): p is string => !!p);

  // Remove duplicates
  const uniquePhotos = [...new Set(allPhotos)];

  const hasMultiplePhotos = uniquePhotos.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? uniquePhotos.length - 1 : prev - 1));
  }, [uniquePhotos.length]);

  const goToNext = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev === uniquePhotos.length - 1 ? 0 : prev + 1));
  }, [uniquePhotos.length]);

  // Keyboard navigation for carousel
  useEffect(() => {
    if (!hasMultiplePhotos) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultiplePhotos, goToPrevious, goToNext]);

  const skills = talent.performanceSkills || [];
  const displayedSkills = showAllSkills ? skills : skills.slice(0, 8);
  const hasMoreSkills = skills.length > 8;

  return (
    <Modal isOpen onClose={onClose} size="xl" title={talent.firstName}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo Carousel */}
        <div className="relative w-full md:w-1/2 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {uniquePhotos.length > 0 ? (
            <>
              <Image
                src={uniquePhotos[currentPhotoIndex]}
                alt={talent.firstName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Carousel Navigation */}
              {hasMultiplePhotos && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Photo Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    {uniquePhotos.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to photo ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-6xl text-gray-400">{talent.firstName.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="flex-1 min-w-0">
          {/* Attributes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 flex-shrink-0" />
              <span>
                {GENDER_LABELS[talent.gender]} &bull; {talent.ageRangeMin}-{talent.ageRangeMax}{' '}
                years
              </span>
            </div>

            {talent.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{talent.location}</span>
              </div>
            )}

            {talent.height && (
              <div className="flex items-center gap-2 text-gray-600">
                <Ruler className="w-4 h-4 flex-shrink-0" />
                <span>{talent.height}cm</span>
                {talent.physique && (
                  <span className="text-gray-400">&bull; {PHYSIQUE_LABELS[talent.physique]}</span>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {displayedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
                {hasMoreSkills && !showAllSkills && (
                  <button
                    type="button"
                    onClick={() => setShowAllSkills(true)}
                    className="inline-block text-blue-600 text-xs px-2 py-1 hover:underline"
                  >
                    +{skills.length - 8} more
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Languages */}
          {talent.languages && talent.languages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Languages</h4>
              <div className="flex flex-wrap gap-1">
                {talent.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* View Full Profile Button */}
          <div className="mt-6">
            <Link href={`/talents/${talent.id}`}>
              <Button variant="primary" className="w-full">
                View Full Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function QuickViewModal({ talent, isOpen, onClose }: QuickViewModalProps) {
  if (!isOpen || !talent) return null;

  // Use key to reset component state when talent changes
  return <QuickViewContent key={talent.id} talent={talent} onClose={onClose} />;
}
