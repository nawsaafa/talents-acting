/**
 * Translation completeness and consistency tests
 *
 * Ensures all translation files have the same keys and no missing translations
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  locales,
  localeNames,
  localeDirections,
  isValidLocale,
  getDirection,
  getLocaleFromPathname,
} from '@/i18n/config';

// Helper to get all keys from a nested object
function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Load translation files
const messagesDir = join(process.cwd(), 'messages');
const translations: Record<string, Record<string, unknown>> = {};

beforeAll(() => {
  for (const locale of locales) {
    const filePath = join(messagesDir, `${locale}.json`);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      translations[locale] = JSON.parse(content);
    }
  }
});

describe('Translation Files', () => {
  it('should have translation files for all supported locales', () => {
    for (const locale of locales) {
      const filePath = join(messagesDir, `${locale}.json`);
      expect(existsSync(filePath), `Missing translation file: ${locale}.json`).toBe(true);
    }
  });

  it('should have valid JSON in all translation files', () => {
    for (const locale of locales) {
      expect(translations[locale], `Invalid or missing translations for ${locale}`).toBeDefined();
      expect(typeof translations[locale]).toBe('object');
    }
  });

  it('should have the same top-level namespaces in all locales', () => {
    const enKeys = Object.keys(translations['en'] || {}).sort();

    for (const locale of locales) {
      if (locale === 'en') continue;

      const localeKeys = Object.keys(translations[locale] || {}).sort();
      expect(localeKeys, `Namespace mismatch in ${locale}.json`).toEqual(enKeys);
    }
  });
});

describe('Translation Keys', () => {
  it('should have all English keys present in French translations', () => {
    const enKeys = getAllKeys(translations['en'] || {});
    const frKeys = getAllKeys(translations['fr'] || {});

    const missingInFr = enKeys.filter((key) => !frKeys.includes(key));

    expect(missingInFr, `Missing keys in fr.json: ${missingInFr.join(', ')}`).toHaveLength(0);
  });

  it('should have all English keys present in Arabic translations', () => {
    const enKeys = getAllKeys(translations['en'] || {});
    const arKeys = getAllKeys(translations['ar'] || {});

    const missingInAr = enKeys.filter((key) => !arKeys.includes(key));

    expect(missingInAr, `Missing keys in ar.json: ${missingInAr.join(', ')}`).toHaveLength(0);
  });

  it('should not have extra keys in French that are missing in English', () => {
    const enKeys = getAllKeys(translations['en'] || {});
    const frKeys = getAllKeys(translations['fr'] || {});

    const extraInFr = frKeys.filter((key) => !enKeys.includes(key));

    expect(extraInFr, `Extra keys in fr.json: ${extraInFr.join(', ')}`).toHaveLength(0);
  });

  it('should not have extra keys in Arabic that are missing in English', () => {
    const enKeys = getAllKeys(translations['en'] || {});
    const arKeys = getAllKeys(translations['ar'] || {});

    const extraInAr = arKeys.filter((key) => !enKeys.includes(key));

    expect(extraInAr, `Extra keys in ar.json: ${extraInAr.join(', ')}`).toHaveLength(0);
  });
});

describe('Translation Values', () => {
  it('should not have empty string values', () => {
    for (const locale of locales) {
      const keys = getAllKeys(translations[locale] || {});

      for (const key of keys) {
        const parts = key.split('.');
        let value: unknown = translations[locale];

        for (const part of parts) {
          value = (value as Record<string, unknown>)?.[part];
        }

        expect(value !== '', `Empty value for key "${key}" in ${locale}.json`).toBe(true);
      }
    }
  });

  it('should have non-null values for all keys', () => {
    for (const locale of locales) {
      const keys = getAllKeys(translations[locale] || {});

      for (const key of keys) {
        const parts = key.split('.');
        let value: unknown = translations[locale];

        for (const part of parts) {
          value = (value as Record<string, unknown>)?.[part];
        }

        expect(value !== null, `Null value for key "${key}" in ${locale}.json`).toBe(true);
        expect(value !== undefined, `Undefined value for key "${key}" in ${locale}.json`).toBe(
          true
        );
      }
    }
  });
});

describe('Required Translation Namespaces', () => {
  const requiredNamespaces = ['common', 'auth', 'talents', 'admin', 'errors', 'metadata'];

  it('should have all required namespaces in each locale', () => {
    for (const locale of locales) {
      const namespaces = Object.keys(translations[locale] || {});

      for (const ns of requiredNamespaces) {
        expect(namespaces.includes(ns), `Missing namespace "${ns}" in ${locale}.json`).toBe(true);
      }
    }
  });
});

describe('ICU Message Format', () => {
  it('should have consistent pluralization patterns across locales', () => {
    // Check that pluralization keys exist in all locales
    const pluralKeys = ['talents.profile.yearsExperience', 'talents.search.resultsCount'];

    for (const key of pluralKeys) {
      for (const locale of locales) {
        const parts = key.split('.');
        let value: unknown = translations[locale];

        for (const part of parts) {
          value = (value as Record<string, unknown>)?.[part];
        }

        expect(
          typeof value === 'string',
          `Missing pluralization key "${key}" in ${locale}.json`
        ).toBe(true);
        expect(
          (value as string).includes('{count'),
          `Key "${key}" in ${locale}.json should use ICU pluralization`
        ).toBe(true);
      }
    }
  });
});

describe('Locale Configuration', () => {
  it('should have correct locale list', () => {
    expect(locales).toEqual(['fr', 'en', 'ar']);
  });

  it('should have names for all locales', () => {
    for (const locale of locales) {
      expect(localeNames[locale], `Missing name for locale ${locale}`).toBeDefined();
      expect(typeof localeNames[locale]).toBe('string');
      expect(localeNames[locale].length).toBeGreaterThan(0);
    }
  });

  it('should have directions for all locales', () => {
    for (const locale of locales) {
      expect(localeDirections[locale], `Missing direction for locale ${locale}`).toBeDefined();
      expect(['ltr', 'rtl']).toContain(localeDirections[locale]);
    }
  });

  it('should mark Arabic as RTL', () => {
    expect(localeDirections['ar']).toBe('rtl');
  });

  it('should mark French and English as LTR', () => {
    expect(localeDirections['fr']).toBe('ltr');
    expect(localeDirections['en']).toBe('ltr');
  });
});

describe('isValidLocale', () => {
  it('returns true for valid locales', () => {
    expect(isValidLocale('fr')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('ar')).toBe(true);
  });

  it('returns false for invalid locales', () => {
    expect(isValidLocale('de')).toBe(false);
    expect(isValidLocale('es')).toBe(false);
    expect(isValidLocale('')).toBe(false);
    expect(isValidLocale('FR')).toBe(false);
  });
});

describe('getDirection', () => {
  it('returns correct direction for each locale', () => {
    expect(getDirection('fr')).toBe('ltr');
    expect(getDirection('en')).toBe('ltr');
    expect(getDirection('ar')).toBe('rtl');
  });
});

describe('getLocaleFromPathname', () => {
  it('extracts locale from valid pathnames', () => {
    expect(getLocaleFromPathname('/fr/about')).toBe('fr');
    expect(getLocaleFromPathname('/en/talents')).toBe('en');
    expect(getLocaleFromPathname('/ar/admin')).toBe('ar');
  });

  it('returns null for pathnames without locale', () => {
    expect(getLocaleFromPathname('/about')).toBe(null);
    expect(getLocaleFromPathname('/talents')).toBe(null);
    expect(getLocaleFromPathname('/')).toBe(null);
  });

  it('returns null for invalid locale in pathname', () => {
    expect(getLocaleFromPathname('/de/about')).toBe(null);
    expect(getLocaleFromPathname('/es/talents')).toBe(null);
  });

  it('handles pathname with only locale', () => {
    expect(getLocaleFromPathname('/fr')).toBe('fr');
    expect(getLocaleFromPathname('/en')).toBe('en');
    expect(getLocaleFromPathname('/ar')).toBe('ar');
  });
});
