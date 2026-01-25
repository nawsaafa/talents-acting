'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

/**
 * Default error fallback UI component
 * Displays when an error boundary catches an error
 */
export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950"
    >
      <AlertTriangle className="mb-4 h-12 w-12 text-red-500" aria-hidden="true" />

      <h2 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
        Something went wrong
      </h2>

      <p className="mb-4 max-w-md text-sm text-red-600 dark:text-red-300">
        We encountered an unexpected error. Please try again or return to the home page.
      </p>

      {isDevelopment && error.message && (
        <pre className="mb-4 max-w-full overflow-auto rounded bg-red-100 p-3 text-left text-xs text-red-800 dark:bg-red-900 dark:text-red-200">
          {error.message}
        </pre>
      )}

      <div className="flex gap-3">
        {resetErrorBoundary && (
          <Button
            onClick={resetErrorBoundary}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        )}

        <Button
          onClick={() => (window.location.href = '/')}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900"
        >
          <Home className="mr-2 h-4 w-4" aria-hidden="true" />
          Go home
        </Button>
      </div>
    </div>
  );
}

/**
 * Minimal error fallback for inline components
 */
export function InlineErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="inline-flex items-center gap-2 rounded bg-red-100 px-3 py-1 text-sm text-red-700 dark:bg-red-900 dark:text-red-300"
    >
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      <span>Error loading content</span>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="ml-2 underline hover:no-underline"
          type="button"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Full-page error fallback for critical errors
 */
export function PageErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-gray-900"
    >
      <AlertTriangle className="mb-6 h-16 w-16 text-red-500" aria-hidden="true" />

      <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
        Oops! Something went wrong
      </h1>

      <p className="mb-6 max-w-lg text-gray-600 dark:text-gray-400">
        We apologize for the inconvenience. An unexpected error has occurred. Please try refreshing
        the page or return to the home page.
      </p>

      {isDevelopment && error.message && (
        <details className="mb-6 w-full max-w-lg text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Error details (development only)
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            {error.stack || error.message}
          </pre>
        </details>
      )}

      <div className="flex gap-4">
        {resetErrorBoundary && (
          <Button onClick={resetErrorBoundary} variant="primary">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        )}

        <Button onClick={() => (window.location.href = '/')} variant="outline">
          <Home className="mr-2 h-4 w-4" aria-hidden="true" />
          Return home
        </Button>
      </div>
    </div>
  );
}

export default ErrorFallback;
