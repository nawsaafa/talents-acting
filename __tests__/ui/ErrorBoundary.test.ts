import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

// Note: Error boundaries require actual React rendering, so we test the logic
// For full integration tests, use @testing-library/react in a separate file

describe('ErrorBoundary Component Logic', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    // Suppress React's console.error for expected errors
    originalConsoleError = console.error;
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    vi.restoreAllMocks();
  });

  describe('ErrorBoundary static methods', () => {
    it('getDerivedStateFromError returns error state', async () => {
      // Import dynamically to avoid SSR issues in test
      const { ErrorBoundary } = await import('@/components/ui/ErrorBoundary');

      const error = new Error('Test error');
      const state = ErrorBoundary.getDerivedStateFromError(error);

      expect(state).toEqual({
        hasError: true,
        error: error,
      });
    });

    it('getDerivedStateFromError handles different error types', async () => {
      const { ErrorBoundary } = await import('@/components/ui/ErrorBoundary');

      const typeError = new TypeError('Type error');
      const state = ErrorBoundary.getDerivedStateFromError(typeError);

      expect(state.hasError).toBe(true);
      expect(state.error).toBe(typeError);
    });
  });

  describe('ErrorBoundary instance methods', () => {
    it('handleReset calls setState and onReset callback', async () => {
      const { ErrorBoundary } = await import('@/components/ui/ErrorBoundary');

      const onReset = vi.fn();
      const instance = new ErrorBoundary({ children: null, onReset });

      // Mock setState to capture the state update
      const setStateSpy = vi.fn();
      instance.setState = setStateSpy;

      // Call reset
      instance.handleReset();

      expect(setStateSpy).toHaveBeenCalledWith({ hasError: false, error: null });
      expect(onReset).toHaveBeenCalled();
    });

    it('componentDidCatch logs error in development', async () => {
      const { ErrorBoundary } = await import('@/components/ui/ErrorBoundary');

      const onError = vi.fn();
      const instance = new ErrorBoundary({ children: null, onError });

      const error = new Error('Test error');
      const errorInfo = { componentStack: 'at TestComponent' };

      instance.componentDidCatch(error, errorInfo as React.ErrorInfo);

      expect(onError).toHaveBeenCalledWith(error, errorInfo);
    });
  });

  describe('withErrorBoundary HOC', () => {
    it('wraps component with error boundary', async () => {
      const { withErrorBoundary } = await import('@/components/ui/ErrorBoundary');

      const TestComponent = () => null;
      TestComponent.displayName = 'TestComponent';

      const WrappedComponent = withErrorBoundary(TestComponent);

      expect(WrappedComponent.displayName).toBe('withErrorBoundary(TestComponent)');
    });

    it('uses component name if displayName not set', async () => {
      const { withErrorBoundary } = await import('@/components/ui/ErrorBoundary');

      function NamedComponent() {
        return null;
      }

      const WrappedComponent = withErrorBoundary(NamedComponent);

      expect(WrappedComponent.displayName).toBe('withErrorBoundary(NamedComponent)');
    });

    it('handles components without explicit displayName', async () => {
      const { withErrorBoundary } = await import('@/components/ui/ErrorBoundary');

      // Create a component with a name but no displayName
      const NamedArrowComponent = (() => null) as React.FC;

      const WrappedComponent = withErrorBoundary(NamedArrowComponent);

      // Should use the variable name since it's assigned
      expect(WrappedComponent.displayName).toContain('withErrorBoundary(');
    });
  });
});

describe('ErrorFallback Components', () => {
  describe('ErrorFallback', () => {
    it('module exports ErrorFallback component', async () => {
      const { ErrorFallback } = await import('@/components/ui/ErrorFallback');
      expect(ErrorFallback).toBeDefined();
      expect(typeof ErrorFallback).toBe('function');
    });

    it('module exports InlineErrorFallback component', async () => {
      const { InlineErrorFallback } = await import('@/components/ui/ErrorFallback');
      expect(InlineErrorFallback).toBeDefined();
      expect(typeof InlineErrorFallback).toBe('function');
    });

    it('module exports PageErrorFallback component', async () => {
      const { PageErrorFallback } = await import('@/components/ui/ErrorFallback');
      expect(PageErrorFallback).toBeDefined();
      expect(typeof PageErrorFallback).toBe('function');
    });
  });
});

describe('Skeleton Components', () => {
  describe('Skeleton module exports', () => {
    it('exports Skeleton component', async () => {
      const { Skeleton } = await import('@/components/ui/Skeleton');
      expect(Skeleton).toBeDefined();
      expect(typeof Skeleton).toBe('function');
    });

    it('exports TalentCardSkeleton component', async () => {
      const { TalentCardSkeleton } = await import('@/components/ui/Skeleton');
      expect(TalentCardSkeleton).toBeDefined();
      expect(typeof TalentCardSkeleton).toBe('function');
    });

    it('exports TalentGallerySkeleton component', async () => {
      const { TalentGallerySkeleton } = await import('@/components/ui/Skeleton');
      expect(TalentGallerySkeleton).toBeDefined();
      expect(typeof TalentGallerySkeleton).toBe('function');
    });

    it('exports ProfileHeaderSkeleton component', async () => {
      const { ProfileHeaderSkeleton } = await import('@/components/ui/Skeleton');
      expect(ProfileHeaderSkeleton).toBeDefined();
      expect(typeof ProfileHeaderSkeleton).toBe('function');
    });

    it('exports TableRowSkeleton component', async () => {
      const { TableRowSkeleton } = await import('@/components/ui/Skeleton');
      expect(TableRowSkeleton).toBeDefined();
      expect(typeof TableRowSkeleton).toBe('function');
    });

    it('exports StatCardSkeleton component', async () => {
      const { StatCardSkeleton } = await import('@/components/ui/Skeleton');
      expect(StatCardSkeleton).toBeDefined();
      expect(typeof StatCardSkeleton).toBe('function');
    });
  });
});
