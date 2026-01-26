/**
 * Server request configuration for i18n
 * Provides locale and messages for server components
 */

import { routing, type Locale } from './routing';

function hasLocale(locales: readonly string[], locale: string | undefined): locale is Locale {
  return locale !== undefined && locales.includes(locale);
}

export async function getMessages(locale: string) {
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  return (await import(`../messages/${validLocale}.json`)).default;
}

export function getValidLocale(requestedLocale: string | undefined): Locale {
  return hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
}
