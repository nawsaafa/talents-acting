/**
 * Routing configuration for i18n
 * Defines supported locales and routing behavior
 */

// All supported locales
export const locales = ['fr', 'en', 'ar'] as const;

// Default locale (French for Morocco)
export const defaultLocale = 'fr' as const;

// Routing configuration object for compatibility
export const routing = {
  locales,
  defaultLocale,
  localePrefix: 'always' as const,
};

// Re-export types for convenience
export type Locale = (typeof locales)[number];
