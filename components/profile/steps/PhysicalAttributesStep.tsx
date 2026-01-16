"use client";

import {
  useWizardContext,
  FormField,
  TextInput,
  NumberInput,
  SelectInput,
  CheckboxInput,
  TextareaInput,
} from "../WizardStep";
import type { TalentProfile } from "@prisma/client";

// Options matching Prisma enums
const PHYSIQUE_OPTIONS = [
  { value: "SLIM", label: "Slim" },
  { value: "AVERAGE", label: "Average" },
  { value: "ATHLETIC", label: "Athletic" },
  { value: "MUSCULAR", label: "Muscular" },
  { value: "CURVY", label: "Curvy" },
  { value: "PLUS_SIZE", label: "Plus Size" },
];

const HAIR_COLOR_OPTIONS = [
  { value: "BLACK", label: "Black" },
  { value: "BROWN", label: "Brown" },
  { value: "BLONDE", label: "Blonde" },
  { value: "RED", label: "Red" },
  { value: "GRAY", label: "Gray" },
  { value: "WHITE", label: "White" },
  { value: "OTHER", label: "Other" },
];

const EYE_COLOR_OPTIONS = [
  { value: "BROWN", label: "Brown" },
  { value: "BLUE", label: "Blue" },
  { value: "GREEN", label: "Green" },
  { value: "HAZEL", label: "Hazel" },
  { value: "GRAY", label: "Gray" },
  { value: "OTHER", label: "Other" },
];

const HAIR_LENGTH_OPTIONS = [
  { value: "BALD", label: "Bald" },
  { value: "SHORT", label: "Short" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LONG", label: "Long" },
];

const BEARD_TYPE_OPTIONS = [
  { value: "NONE", label: "None" },
  { value: "STUBBLE", label: "Stubble" },
  { value: "SHORT", label: "Short" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LONG", label: "Long" },
  { value: "FULL", label: "Full" },
];

export function PhysicalAttributesStep() {
  const { formData, updateField, errors, isSubmitting } = useWizardContext();

  return (
    <div className="space-y-6">
      {/* Height and Physique */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Height (cm)" name="height" error={errors.height}>
          <NumberInput
            name="height"
            value={formData.height}
            onChange={(v) => updateField("height" as keyof TalentProfile, v)}
            placeholder="e.g., 175"
            min={50}
            max={300}
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Physique" name="physique" error={errors.physique}>
          <SelectInput
            name="physique"
            value={formData.physique}
            onChange={(v) => updateField("physique" as keyof TalentProfile, v)}
            options={PHYSIQUE_OPTIONS}
            placeholder="Select physique"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      {/* Ethnic Appearance */}
      <FormField
        label="Ethnic Appearance"
        name="ethnicAppearance"
        error={errors.ethnicAppearance}
      >
        <TextInput
          name="ethnicAppearance"
          value={formData.ethnicAppearance}
          onChange={(v) => updateField("ethnicAppearance" as keyof TalentProfile, v)}
          placeholder="e.g., Middle Eastern, Mediterranean, East Asian"
          disabled={isSubmitting}
          maxLength={100}
        />
        <p className="mt-1 text-xs text-gray-500">
          Describe how casting directors might describe your appearance
        </p>
      </FormField>

      {/* Hair and Eye Color */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Hair Color" name="hairColor" error={errors.hairColor}>
          <SelectInput
            name="hairColor"
            value={formData.hairColor}
            onChange={(v) => updateField("hairColor" as keyof TalentProfile, v)}
            options={HAIR_COLOR_OPTIONS}
            placeholder="Select"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Hair Length" name="hairLength" error={errors.hairLength}>
          <SelectInput
            name="hairLength"
            value={formData.hairLength}
            onChange={(v) => updateField("hairLength" as keyof TalentProfile, v)}
            options={HAIR_LENGTH_OPTIONS}
            placeholder="Select"
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Eye Color" name="eyeColor" error={errors.eyeColor}>
          <SelectInput
            name="eyeColor"
            value={formData.eyeColor}
            onChange={(v) => updateField("eyeColor" as keyof TalentProfile, v)}
            options={EYE_COLOR_OPTIONS}
            placeholder="Select"
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      {/* Beard Type */}
      <FormField label="Beard Type" name="beardType" error={errors.beardType}>
        <SelectInput
          name="beardType"
          value={formData.beardType}
          onChange={(v) => updateField("beardType" as keyof TalentProfile, v)}
          options={BEARD_TYPE_OPTIONS}
          placeholder="Select beard type"
          disabled={isSubmitting}
        />
      </FormField>

      {/* Unique Traits */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Unique Traits</h3>

        <div className="space-y-4">
          <div>
            <CheckboxInput
              name="hasTattoos"
              checked={formData.hasTattoos ?? false}
              onChange={(v) => updateField("hasTattoos" as keyof TalentProfile, v)}
              label="I have visible tattoos"
              disabled={isSubmitting}
            />
            {formData.hasTattoos && (
              <div className="mt-2 ml-6">
                <FormField
                  label="Tattoo Description"
                  name="tattooDescription"
                  error={errors.tattooDescription}
                >
                  <TextareaInput
                    name="tattooDescription"
                    value={formData.tattooDescription}
                    onChange={(v) => updateField("tattooDescription" as keyof TalentProfile, v)}
                    placeholder="Describe your tattoos (location, size, type)"
                    rows={2}
                    maxLength={500}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
            )}
          </div>

          <div>
            <CheckboxInput
              name="hasScars"
              checked={formData.hasScars ?? false}
              onChange={(v) => updateField("hasScars" as keyof TalentProfile, v)}
              label="I have visible scars"
              disabled={isSubmitting}
            />
            {formData.hasScars && (
              <div className="mt-2 ml-6">
                <FormField
                  label="Scar Description"
                  name="scarDescription"
                  error={errors.scarDescription}
                >
                  <TextareaInput
                    name="scarDescription"
                    value={formData.scarDescription}
                    onChange={(v) => updateField("scarDescription" as keyof TalentProfile, v)}
                    placeholder="Describe your scars (location, size)"
                    rows={2}
                    maxLength={500}
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
