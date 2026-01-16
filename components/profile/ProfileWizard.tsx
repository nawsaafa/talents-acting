'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import type { TalentProfile } from '@prisma/client';
import { Button } from '@/components/ui';
import { WizardNav } from './WizardNav';
import { WizardStep } from './WizardStep';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { PhysicalAttributesStep } from './steps/PhysicalAttributesStep';
import { SkillsStep } from './steps/SkillsStep';
import { MediaStep } from './steps/MediaStep';
import { ProfessionalStep } from './steps/ProfessionalStep';
import { WIZARD_STEPS, validateStep, type WizardStepId } from '@/lib/profile/wizard-validation';
import { updateTalentProfile } from '@/lib/talents/actions';
import type { UpdateProfileInput } from '@/lib/talents/validation';

const STORAGE_KEY = 'profile-wizard-state';

interface ProfileWizardProps {
  initialData?: Partial<TalentProfile>;
  profileId?: string;
}

interface WizardState {
  currentStep: number;
  completedSteps: WizardStepId[];
  formData: Partial<TalentProfile>;
}

export function ProfileWizard({ initialData, profileId }: ProfileWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize state from localStorage or props
  const [state, setState] = useState<WizardState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only use saved state if it matches current profile
          if (parsed.profileId === profileId) {
            return {
              currentStep: parsed.currentStep ?? 0,
              completedSteps: parsed.completedSteps ?? [],
              formData: { ...initialData, ...parsed.formData },
            };
          }
        } catch {
          // Invalid saved state, ignore
        }
      }
    }
    return {
      currentStep: 0,
      completedSteps: [],
      formData: initialData ?? {},
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { currentStep, completedSteps, formData } = state;
  const currentStepConfig = WIZARD_STEPS[currentStep];
  const completedStepsSet = new Set(completedSteps);

  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profileId,
          currentStep,
          completedSteps,
          formData,
        })
      );
    }
  }, [profileId, currentStep, completedSteps, formData]);

  // Update field value
  const updateField = useCallback((field: keyof TalentProfile, value: unknown) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Update array field (add/remove)
  const updateArrayField = useCallback(
    (field: keyof TalentProfile, value: string, action: 'add' | 'remove') => {
      setState((prev) => {
        const currentArray = (prev.formData[field] as string[]) ?? [];
        const newArray =
          action === 'add' ? [...currentArray, value] : currentArray.filter((v) => v !== value);
        return {
          ...prev,
          formData: { ...prev.formData, [field]: newArray },
        };
      });
    },
    []
  );

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    const stepId = currentStepConfig.id;
    const result = validateStep(stepId, formData as Record<string, unknown>);

    if (!result.success && 'error' in result) {
      const newErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = 'path' in issue && Array.isArray(issue.path) ? issue.path.join('.') : '_error';
        if (!newErrors[path]) {
          newErrors[path] = issue.message;
        }
      }
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [currentStepConfig.id, formData]);

  // Navigate to step
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= WIZARD_STEPS.length) return;

      // If going forward, validate current step first
      if (stepIndex > currentStep) {
        if (!validateCurrentStep()) {
          return;
        }
        // Mark current step as completed
        setState((prev) => ({
          ...prev,
          currentStep: stepIndex,
          completedSteps: prev.completedSteps.includes(currentStepConfig.id)
            ? prev.completedSteps
            : [...prev.completedSteps, currentStepConfig.id],
        }));
      } else {
        setState((prev) => ({
          ...prev,
          currentStep: stepIndex,
        }));
      }
    },
    [currentStep, currentStepConfig.id, validateCurrentStep]
  );

  // Go to previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  // Go to next step
  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  // Save profile
  const handleSave = async () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    setSaveError(null);
    setSaveSuccess(false);

    startTransition(async () => {
      try {
        // Convert formData to the expected input type
        // Handle Decimal -> number conversion for dailyRate
        const inputData: UpdateProfileInput = {
          ...formData,
          dailyRate: formData.dailyRate != null ? Number(formData.dailyRate) : formData.dailyRate,
        };
        const result = await updateTalentProfile(inputData);

        if (!result.success) {
          setSaveError(result.error || 'Failed to save profile');
          return;
        }

        // Clear saved state on successful save
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }

        setSaveSuccess(true);

        // Redirect to profile page after short delay
        setTimeout(() => {
          router.push('/dashboard/profile');
          router.refresh();
        }, 1500);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    });
  };

  // Render step content
  const renderStepContent = () => {
    const StepContent = (() => {
      switch (currentStepConfig.id) {
        case 'basic':
          return BasicInfoStep;
        case 'physical':
          return PhysicalAttributesStep;
        case 'skills':
          return SkillsStep;
        case 'media':
          return MediaStep;
        case 'professional':
          return ProfessionalStep;
        default:
          return null;
      }
    })();

    if (!StepContent) return null;

    return (
      <WizardStep
        stepId={currentStepConfig.id}
        title={currentStepConfig.title}
        description={currentStepConfig.description}
        formData={formData}
        updateField={updateField}
        updateArrayField={updateArrayField}
        errors={errors}
        isSubmitting={isPending}
      >
        <StepContent />
      </WizardStep>
    );
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Navigation */}
      <WizardNav
        currentStep={currentStep}
        completedSteps={completedStepsSet}
        onStepClick={goToStep}
        disabled={isPending}
      />

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isLastStep) {
            handleSave();
          } else {
            handleNext();
          }
        }}
        className="bg-white rounded-lg border shadow-sm p-6"
      >
        {/* Step content */}
        {renderStepContent()}

        {/* Error/Success messages */}
        {saveError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{saveError}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">Profile saved successfully! Redirecting...</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={isFirstStep || isPending}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {/* Save button (available on all steps) */}
            <Button type="button" variant="outline" onClick={handleSave} disabled={isPending}>
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Save Progress
            </Button>

            {/* Next/Finish button */}
            {isLastStep ? (
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Save & Finish
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
