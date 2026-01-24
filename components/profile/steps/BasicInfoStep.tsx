'use client';

import { useWizardContext, FormField, TextInput, NumberInput, SelectInput } from '../WizardStep';
import type { TalentProfile } from '@prisma/client';

// Gender options matching Prisma enum
const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'NON_BINARY', label: 'Non-Binary' },
  { value: 'OTHER', label: 'Other' },
];

export function BasicInfoStep() {
  const { formData, updateField, errors, isSubmitting } = useWizardContext();

  return (
    <div className="space-y-6">
      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="First Name" name="firstName" error={errors.firstName} required>
          <TextInput
            name="firstName"
            value={formData.firstName}
            onChange={(v) => updateField('firstName' as keyof TalentProfile, v)}
            placeholder="Enter your first name"
            disabled={isSubmitting}
            maxLength={50}
          />
        </FormField>

        <FormField label="Last Name" name="lastName" error={errors.lastName} required>
          <TextInput
            name="lastName"
            value={formData.lastName}
            onChange={(v) => updateField('lastName' as keyof TalentProfile, v)}
            placeholder="Enter your last name"
            disabled={isSubmitting}
            maxLength={50}
          />
        </FormField>
      </div>

      {/* Gender */}
      <FormField label="Gender" name="gender" error={errors.gender} required>
        <SelectInput
          name="gender"
          value={formData.gender}
          onChange={(v) => updateField('gender' as keyof TalentProfile, v)}
          options={GENDER_OPTIONS}
          placeholder="Select gender"
          disabled={isSubmitting}
        />
      </FormField>

      {/* Age Range */}
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-1">
          Playable Age Range <span className="text-red-500">*</span>
        </p>
        <p className="text-xs text-gray-500 mb-2">
          The age range you can convincingly portray on screen
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="From" name="ageRangeMin" error={errors.ageRangeMin}>
            <NumberInput
              name="ageRangeMin"
              value={formData.ageRangeMin}
              onChange={(v) => updateField('ageRangeMin' as keyof TalentProfile, v)}
              placeholder="Min age"
              min={1}
              max={100}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="To" name="ageRangeMax" error={errors.ageRangeMax}>
            <NumberInput
              name="ageRangeMax"
              value={formData.ageRangeMax}
              onChange={(v) => updateField('ageRangeMax' as keyof TalentProfile, v)}
              placeholder="Max age"
              min={1}
              max={100}
              disabled={isSubmitting}
            />
          </FormField>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Location" name="location" error={errors.location}>
          <TextInput
            name="location"
            value={formData.location}
            onChange={(v) => updateField('location' as keyof TalentProfile, v)}
            placeholder="City or region"
            disabled={isSubmitting}
            maxLength={100}
          />
        </FormField>

        <FormField label="Place of Birth" name="birthPlace" error={errors.birthPlace}>
          <TextInput
            name="birthPlace"
            value={formData.birthPlace}
            onChange={(v) => updateField('birthPlace' as keyof TalentProfile, v)}
            placeholder="e.g., Casablanca, Morocco"
            disabled={isSubmitting}
            maxLength={100}
          />
        </FormField>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Contact Information</h3>
        <p className="text-xs text-gray-500 mb-4">
          Contact details are only visible to verified professionals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Contact Email" name="contactEmail" error={errors.contactEmail}>
            <TextInput
              name="contactEmail"
              value={formData.contactEmail}
              onChange={(v) => updateField('contactEmail' as keyof TalentProfile, v)}
              type="email"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Contact Phone" name="contactPhone" error={errors.contactPhone}>
            <TextInput
              name="contactPhone"
              value={formData.contactPhone}
              onChange={(v) => updateField('contactPhone' as keyof TalentProfile, v)}
              type="tel"
              placeholder="+1 234 567 8900"
              disabled={isSubmitting}
              maxLength={20}
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
