'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/ui';
import { PhotoUpload } from './PhotoUpload';
import { createTalentProfile, updateTalentProfile } from '@/lib/talents/actions';
import type { CreateProfileInput } from '@/lib/talents/validation';
import type { FullTalentProfile } from '@/lib/talents/queries';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface ProfileFormProps {
  profile?: FullTalentProfile | null;
  mode: 'create' | 'edit';
}

const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'OTHER', label: 'Other' },
];

const PHYSIQUE_OPTIONS = [
  { value: '', label: 'Select physique' },
  { value: 'SLIM', label: 'Slim' },
  { value: 'AVERAGE', label: 'Average' },
  { value: 'ATHLETIC', label: 'Athletic' },
  { value: 'MUSCULAR', label: 'Muscular' },
  { value: 'CURVY', label: 'Curvy' },
  { value: 'PLUS_SIZE', label: 'Plus Size' },
];

const HAIR_COLOR_OPTIONS = [
  { value: '', label: 'Select hair color' },
  { value: 'BLACK', label: 'Black' },
  { value: 'BROWN', label: 'Brown' },
  { value: 'BLONDE', label: 'Blonde' },
  { value: 'RED', label: 'Red' },
  { value: 'GRAY', label: 'Gray' },
  { value: 'WHITE', label: 'White' },
  { value: 'OTHER', label: 'Other' },
];

const EYE_COLOR_OPTIONS = [
  { value: '', label: 'Select eye color' },
  { value: 'BROWN', label: 'Brown' },
  { value: 'BLUE', label: 'Blue' },
  { value: 'GREEN', label: 'Green' },
  { value: 'HAZEL', label: 'Hazel' },
  { value: 'GRAY', label: 'Gray' },
  { value: 'OTHER', label: 'Other' },
];

const HAIR_LENGTH_OPTIONS = [
  { value: '', label: 'Select hair length' },
  { value: 'BALD', label: 'Bald' },
  { value: 'SHORT', label: 'Short' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LONG', label: 'Long' },
];

const BEARD_TYPE_OPTIONS = [
  { value: '', label: 'Select beard type' },
  { value: 'NONE', label: 'None' },
  { value: 'STUBBLE', label: 'Stubble' },
  { value: 'SHORT', label: 'Short' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LONG', label: 'Long' },
  { value: 'FULL', label: 'Full' },
];

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FormSection({ title, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

export function ProfileForm({ profile, mode }: ProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CreateProfileInput>>({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    gender: profile?.gender || undefined,
    ageRangeMin: profile?.ageRangeMin || 18,
    ageRangeMax: profile?.ageRangeMax || 35,
    photo: profile?.photo || null,
    location: profile?.location || '',
    bio: profile?.bio || '',
    height: profile?.height || undefined,
    physique: profile?.physique || undefined,
    ethnicAppearance: profile?.ethnicAppearance || '',
    hairColor: profile?.hairColor || undefined,
    eyeColor: profile?.eyeColor || undefined,
    hairLength: profile?.hairLength || undefined,
    beardType: profile?.beardType || undefined,
    hasTattoos: profile?.hasTattoos || false,
    hasScars: profile?.hasScars || false,
    tattooDescription: profile?.tattooDescription || '',
    scarDescription: profile?.scarDescription || '',
    languages: profile?.languages || [],
    accents: profile?.accents || [],
    athleticSkills: profile?.athleticSkills || [],
    musicalInstruments: profile?.musicalInstruments || [],
    performanceSkills: profile?.performanceSkills || [],
    danceStyles: profile?.danceStyles || [],
    isAvailable: profile?.isAvailable ?? true,
    dailyRate: profile?.dailyRate ? Number(profile.dailyRate) : undefined,
    rateNegotiable: profile?.rateNegotiable ?? true,
    contactEmail: profile?.contactEmail || '',
    contactPhone: profile?.contactPhone || '',
  });

  const updateField = <K extends keyof CreateProfileInput>(
    field: K,
    value: CreateProfileInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof CreateProfileInput, value: string) => {
    const items = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result =
        mode === 'create'
          ? await createTalentProfile(formData as CreateProfileInput)
          : await updateTalentProfile(formData);

      if (!result.success) {
        setError(result.error || 'An error occurred');
        return;
      }

      router.push('/dashboard/profile');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Photo Upload */}
      <div className="flex justify-center">
        <PhotoUpload
          currentPhoto={formData.photo}
          onPhotoChange={(url) => updateField('photo', url)}
          disabled={isSubmitting}
        />
      </div>

      {/* Basic Info Section */}
      <FormSection title="Basic Information" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            required
            disabled={isSubmitting}
          />
          <Input
            label="Last Name *"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <Select
          label="Gender *"
          value={formData.gender || ''}
          onChange={(e) => updateField('gender', e.target.value as CreateProfileInput['gender'])}
          options={[{ value: '', label: 'Select gender' }, ...GENDER_OPTIONS]}
          required
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Age Range Min *"
            value={formData.ageRangeMin}
            onChange={(e) => updateField('ageRangeMin', parseInt(e.target.value))}
            min={1}
            max={100}
            required
            disabled={isSubmitting}
          />
          <Input
            type="number"
            label="Age Range Max *"
            value={formData.ageRangeMax}
            onChange={(e) => updateField('ageRangeMax', parseInt(e.target.value))}
            min={1}
            max={100}
            required
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Location"
          value={formData.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="City, Country"
          disabled={isSubmitting}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself and your experience..."
            disabled={isSubmitting}
            maxLength={2000}
          />
        </div>
      </FormSection>

      {/* Physical Attributes Section */}
      <FormSection title="Physical Attributes" defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Height (cm)"
            value={formData.height || ''}
            onChange={(e) =>
              updateField('height', e.target.value ? parseInt(e.target.value) : undefined)
            }
            min={50}
            max={300}
            disabled={isSubmitting}
          />
          <Select
            label="Physique"
            value={formData.physique || ''}
            onChange={(e) =>
              updateField('physique', e.target.value as CreateProfileInput['physique'])
            }
            options={PHYSIQUE_OPTIONS}
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Ethnic Appearance"
          value={formData.ethnicAppearance || ''}
          onChange={(e) => updateField('ethnicAppearance', e.target.value)}
          placeholder="e.g., Middle Eastern, Mediterranean"
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Hair Color"
            value={formData.hairColor || ''}
            onChange={(e) =>
              updateField('hairColor', e.target.value as CreateProfileInput['hairColor'])
            }
            options={HAIR_COLOR_OPTIONS}
            disabled={isSubmitting}
          />
          <Select
            label="Eye Color"
            value={formData.eyeColor || ''}
            onChange={(e) =>
              updateField('eyeColor', e.target.value as CreateProfileInput['eyeColor'])
            }
            options={EYE_COLOR_OPTIONS}
            disabled={isSubmitting}
          />
          <Select
            label="Hair Length"
            value={formData.hairLength || ''}
            onChange={(e) =>
              updateField('hairLength', e.target.value as CreateProfileInput['hairLength'])
            }
            options={HAIR_LENGTH_OPTIONS}
            disabled={isSubmitting}
          />
        </div>

        <Select
          label="Beard Type"
          value={formData.beardType || ''}
          onChange={(e) =>
            updateField('beardType', e.target.value as CreateProfileInput['beardType'])
          }
          options={BEARD_TYPE_OPTIONS}
          disabled={isSubmitting}
        />
      </FormSection>

      {/* Unique Traits Section */}
      <FormSection title="Unique Traits" defaultOpen={false}>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.hasTattoos}
              onChange={(e) => updateField('hasTattoos', e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Has Tattoos</span>
          </label>
          {formData.hasTattoos && (
            <Input
              label="Tattoo Description"
              value={formData.tattooDescription || ''}
              onChange={(e) => updateField('tattooDescription', e.target.value)}
              placeholder="Describe visible tattoos"
              disabled={isSubmitting}
            />
          )}

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.hasScars}
              onChange={(e) => updateField('hasScars', e.target.checked)}
              disabled={isSubmitting}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Has Scars</span>
          </label>
          {formData.hasScars && (
            <Input
              label="Scar Description"
              value={formData.scarDescription || ''}
              onChange={(e) => updateField('scarDescription', e.target.value)}
              placeholder="Describe visible scars"
              disabled={isSubmitting}
            />
          )}
        </div>
      </FormSection>

      {/* Skills Section */}
      <FormSection title="Skills & Languages" defaultOpen={false}>
        <Input
          label="Languages"
          value={formData.languages?.join(', ') || ''}
          onChange={(e) => updateArrayField('languages', e.target.value)}
          placeholder="Arabic, English, French (comma-separated)"
          disabled={isSubmitting}
        />
        <Input
          label="Accents"
          value={formData.accents?.join(', ') || ''}
          onChange={(e) => updateArrayField('accents', e.target.value)}
          placeholder="British, American, Gulf Arabic (comma-separated)"
          disabled={isSubmitting}
        />
        <Input
          label="Performance Skills"
          value={formData.performanceSkills?.join(', ') || ''}
          onChange={(e) => updateArrayField('performanceSkills', e.target.value)}
          placeholder="Stand-up Comedy, Improvisation (comma-separated)"
          disabled={isSubmitting}
        />
        <Input
          label="Athletic Skills"
          value={formData.athleticSkills?.join(', ') || ''}
          onChange={(e) => updateArrayField('athleticSkills', e.target.value)}
          placeholder="Swimming, Martial Arts (comma-separated)"
          disabled={isSubmitting}
        />
        <Input
          label="Musical Instruments"
          value={formData.musicalInstruments?.join(', ') || ''}
          onChange={(e) => updateArrayField('musicalInstruments', e.target.value)}
          placeholder="Piano, Guitar, Oud (comma-separated)"
          disabled={isSubmitting}
        />
        <Input
          label="Dance Styles"
          value={formData.danceStyles?.join(', ') || ''}
          onChange={(e) => updateArrayField('danceStyles', e.target.value)}
          placeholder="Contemporary, Hip Hop (comma-separated)"
          disabled={isSubmitting}
        />
      </FormSection>

      {/* Availability & Rates Section */}
      <FormSection title="Availability & Rates" defaultOpen={false}>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => updateField('isAvailable', e.target.checked)}
            disabled={isSubmitting}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Currently Available for Work</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Daily Rate"
            value={formData.dailyRate || ''}
            onChange={(e) =>
              updateField('dailyRate', e.target.value ? parseFloat(e.target.value) : undefined)
            }
            min={0}
            placeholder="0.00"
            disabled={isSubmitting}
          />
          <div className="flex items-end pb-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.rateNegotiable}
                onChange={(e) => updateField('rateNegotiable', e.target.checked)}
                disabled={isSubmitting}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Rate is Negotiable</span>
            </label>
          </div>
        </div>
      </FormSection>

      {/* Contact Information Section */}
      <FormSection title="Contact Information (Premium)" defaultOpen={false}>
        <p className="text-sm text-gray-500 mb-4">
          This information is only visible to verified professionals and companies.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="email"
            label="Contact Email"
            value={formData.contactEmail || ''}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
          <Input
            type="tel"
            label="Contact Phone"
            value={formData.contactPhone || ''}
            onChange={(e) => updateField('contactPhone', e.target.value)}
            placeholder="+212 600 000 000"
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : mode === 'create' ? (
            'Create Profile'
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
