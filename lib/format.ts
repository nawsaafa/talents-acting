/**
 * Locale-aware formatting utilities for dates and numbers
 */

import { format, formatDistanceToNow } from 'date-fns';
import { fr, enUS, arSA } from 'date-fns/locale';
import type { Locale } from '@/i18n/config';

/**
 * date-fns locale mapping
 */
const dateFnsLocales = {
  fr: fr,
  en: enUS,
  ar: arSA,
} as const;

/**
 * Format a date according to locale
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  formatStr: string = 'PP'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  return format(dateObj, formatStr, {
    locale: dateFnsLocales[locale],
  });
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number, locale: Locale): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: dateFnsLocales[locale],
  });
}

/**
 * Format a number according to locale
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const localeMap: Record<Locale, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    ar: 'ar-SA',
  };

  return new Intl.NumberFormat(localeMap[locale], options).format(value);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(value: number, locale: Locale, currency: string = 'MAD'): string {
  const localeMap: Record<Locale, string> = {
    fr: 'fr-MA',
    en: 'en-US',
    ar: 'ar-MA',
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format height in cm according to locale
 */
export function formatHeight(height: number, locale: Locale): string {
  const formatted = formatNumber(height, locale);
  return `${formatted} cm`;
}

/**
 * Format age range
 */
export function formatAgeRange(min: number, max: number, locale: Locale): string {
  const minFormatted = formatNumber(min, locale);
  const maxFormatted = formatNumber(max, locale);
  return `${minFormatted} - ${maxFormatted}`;
}
