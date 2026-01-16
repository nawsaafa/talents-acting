'use client';

import { useWizardContext, FormField, CheckboxInput, TextareaInput } from '../WizardStep';
import type { TalentProfile } from '@prisma/client';

export function ProfessionalStep() {
  const { formData, updateField, errors, isSubmitting } = useWizardContext();

  return (
    <div className="space-y-6">
      {/* Biography */}
      <FormField label="Biography" name="bio" error={errors.bio}>
        <TextareaInput
          name="bio"
          value={formData.bio}
          onChange={(v) => updateField('bio' as keyof TalentProfile, v)}
          placeholder="Tell casting directors about yourself, your experience, training, and what makes you unique..."
          rows={6}
          maxLength={2000}
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500">
          A compelling bio helps you stand out. Include your training, notable roles, and what
          drives you as a performer.
        </p>
      </FormField>

      {/* Availability */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Availability</h3>

        <div className="space-y-4">
          <CheckboxInput
            name="isAvailable"
            checked={formData.isAvailable ?? true}
            onChange={(v) => updateField('isAvailable' as keyof TalentProfile, v)}
            label="I am currently available for work"
            disabled={isSubmitting}
          />

          <p className="text-xs text-gray-500">
            When unchecked, your profile will still be visible but marked as unavailable
          </p>
        </div>
      </div>

      {/* Rates */}
      <div className="border rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Rate Information</h3>

        <div className="space-y-4">
          <FormField label="Daily Rate" name="dailyRate" error={errors.dailyRate}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="dailyRate"
                name="dailyRate"
                value={formData.dailyRate != null ? Number(formData.dailyRate) : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField(
                    'dailyRate' as keyof TalentProfile,
                    val === '' ? null : parseFloat(val)
                  );
                }}
                placeholder="e.g., 500"
                min={0}
                step={0.01}
                disabled={isSubmitting}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your standard daily rate. Leave blank if you prefer not to disclose.
            </p>
          </FormField>

          <CheckboxInput
            name="rateNegotiable"
            checked={formData.rateNegotiable ?? true}
            onChange={(v) => updateField('rateNegotiable' as keyof TalentProfile, v)}
            label="My rate is negotiable"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Tips section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Tips for a Strong Profile</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>- Write your bio in the third person for a professional feel</li>
          <li>- Mention specific training, workshops, or acting schools</li>
          <li>- Highlight any notable roles or productions</li>
          <li>- Keep it concise but compelling - aim for 3-5 paragraphs</li>
          <li>- Update regularly as you gain new experience</li>
        </ul>
      </div>
    </div>
  );
}
