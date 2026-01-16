'use client';

interface Step {
  id: number;
  name: string;
}

const STEPS: Step[] = [
  { id: 1, name: 'Account' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Professional' },
  { id: 4, name: 'Terms' },
];

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Registration progress">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, stepIdx) => (
          <li key={step.id} className={`relative ${stepIdx !== STEPS.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center">
              {/* Step Circle */}
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  step.id < currentStep
                    ? 'border-blue-600 bg-blue-600'
                    : step.id === currentStep
                      ? 'border-blue-600 bg-white'
                      : 'border-zinc-300 bg-white'
                }`}
              >
                {step.id < currentStep ? (
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      step.id === currentStep ? 'text-blue-600' : 'text-zinc-500'
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </div>

              {/* Step Name (visible on larger screens) */}
              <span
                className={`ml-3 hidden text-sm font-medium sm:block ${
                  step.id <= currentStep ? 'text-zinc-900' : 'text-zinc-500'
                }`}
              >
                {step.name}
              </span>

              {/* Connector Line */}
              {stepIdx !== STEPS.length - 1 && (
                <div
                  className={`ml-3 hidden h-0.5 flex-1 sm:block ${
                    step.id < currentStep ? 'bg-blue-600' : 'bg-zinc-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Mobile connector */}
            {stepIdx !== STEPS.length - 1 && (
              <div
                className={`absolute left-5 top-5 -ml-px mt-0.5 h-0.5 w-full sm:hidden ${
                  step.id < currentStep ? 'bg-blue-600' : 'bg-zinc-200'
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>

      {/* Mobile step name */}
      <p className="mt-4 text-center text-sm font-medium text-zinc-900 sm:hidden">
        Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.name}
      </p>
    </nav>
  );
}
