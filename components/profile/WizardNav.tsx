'use client';

import { Check } from 'lucide-react';
import { WIZARD_STEPS, type WizardStepId } from '@/lib/profile/wizard-validation';
import { cn } from '@/lib/utils';

interface WizardNavProps {
  currentStep: number;
  completedSteps: Set<WizardStepId>;
  onStepClick?: (stepIndex: number) => void;
  disabled?: boolean;
}

export function WizardNav({
  currentStep,
  completedSteps,
  onStepClick,
  disabled = false,
}: WizardNavProps) {
  return (
    <nav aria-label="Profile wizard steps" className="mb-8">
      {/* Desktop view */}
      <ol className="hidden md:flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.has(step.id);
          const isPast = index < currentStep;
          const isClickable = !disabled && (isCompleted || isPast || index === currentStep);

          return (
            <li key={step.id} className="flex-1 relative">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    'absolute top-5 -left-1/2 w-full h-0.5',
                    isPast || isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={cn(
                  'relative flex flex-col items-center group w-full',
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {/* Step circle */}
                <span
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors z-10 bg-white',
                    isActive && 'border-blue-600 text-blue-600',
                    isCompleted && 'border-blue-600 bg-blue-600 text-white',
                    !isActive && !isCompleted && 'border-gray-300 text-gray-500',
                    isClickable && !isActive && 'group-hover:border-blue-400'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" aria-hidden="true" /> : index + 1}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    'mt-2 text-sm font-medium',
                    isActive && 'text-blue-600',
                    isCompleted && 'text-blue-600',
                    !isActive && !isCompleted && 'text-gray-500'
                  )}
                >
                  {step.title}
                </span>

                {/* Step description (hidden on smaller screens) */}
                <span className="hidden lg:block text-xs text-gray-400 mt-0.5 text-center max-w-[120px]">
                  {step.description}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {WIZARD_STEPS.length}
          </span>
          <span className="text-sm text-gray-500">{WIZARD_STEPS[currentStep].title}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%`,
            }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={WIZARD_STEPS.length}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between mt-2">
          {WIZARD_STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(step.id);
            const isPast = index < currentStep;
            const isClickable = !disabled && (isCompleted || isPast || index === currentStep);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isClickable && onStepClick?.(index)}
                disabled={!isClickable}
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors',
                  isActive && 'bg-blue-600 text-white',
                  isCompleted && !isActive && 'bg-blue-100 text-blue-600',
                  !isActive && !isCompleted && 'bg-gray-100 text-gray-400',
                  isClickable && 'hover:bg-blue-200'
                )}
                aria-label={`Go to ${step.title}`}
              >
                {isCompleted && !isActive ? (
                  <Check className="w-3 h-3" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
