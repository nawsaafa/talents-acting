/**
 * Unit tests for locale-aware formatting utilities
 */

import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatHeight,
  formatAgeRange,
} from '@/lib/format';

describe('formatDate', () => {
  const testDate = new Date('2025-01-15T12:00:00Z');

  it('formats date in French locale', () => {
    const result = formatDate(testDate, 'fr');
    expect(result).toContain('2025');
    expect(result).toContain('janv');
  });

  it('formats date in English locale', () => {
    const result = formatDate(testDate, 'en');
    expect(result).toContain('2025');
    expect(result).toContain('Jan');
  });

  it('formats date in Arabic locale', () => {
    const result = formatDate(testDate, 'ar');
    expect(result).toBeTruthy();
    // Arabic numerals may vary by locale settings
  });

  it('accepts string date input', () => {
    const result = formatDate('2025-01-15', 'en');
    expect(result).toContain('Jan');
  });

  it('accepts timestamp input', () => {
    const timestamp = testDate.getTime();
    const result = formatDate(timestamp, 'en');
    expect(result).toContain('Jan');
  });

  it('accepts custom format string', () => {
    const result = formatDate(testDate, 'en', 'yyyy-MM-dd');
    expect(result).toBe('2025-01-15');
  });
});

describe('formatRelativeTime', () => {
  it('formats relative time in French', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
    const result = formatRelativeTime(pastDate, 'fr');
    expect(result).toContain('il y a');
  });

  it('formats relative time in English', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
    const result = formatRelativeTime(pastDate, 'en');
    expect(result).toContain('ago');
  });

  it('formats relative time in Arabic', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
    const result = formatRelativeTime(pastDate, 'ar');
    expect(result).toBeTruthy();
  });

  it('accepts string date input', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const result = formatRelativeTime(pastDate, 'en');
    expect(result).toContain('ago');
  });
});

describe('formatNumber', () => {
  it('formats number in French locale', () => {
    const result = formatNumber(1234567.89, 'fr');
    // French uses space as thousand separator and comma for decimals
    expect(result).toMatch(/1[\s\u00a0]234[\s\u00a0]567,89/);
  });

  it('formats number in English locale', () => {
    const result = formatNumber(1234567.89, 'en');
    // English uses comma as thousand separator and period for decimals
    expect(result).toBe('1,234,567.89');
  });

  it('formats number in Arabic locale', () => {
    const result = formatNumber(1234567.89, 'ar');
    expect(result).toBeTruthy();
  });

  it('accepts number format options', () => {
    const result = formatNumber(1234.567, 'en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    expect(result).toBe('1,234.57');
  });

  it('formats percentage', () => {
    const result = formatNumber(0.75, 'en', { style: 'percent' });
    expect(result).toBe('75%');
  });
});

describe('formatCurrency', () => {
  it('formats currency in French (Morocco) locale', () => {
    const result = formatCurrency(1500, 'fr');
    // French Morocco locale may use period as thousand separator
    expect(result).toMatch(/1[.\s\u00a0]?500/);
    expect(result).toContain('MAD');
  });

  it('formats currency in English locale', () => {
    const result = formatCurrency(1500, 'en');
    expect(result).toContain('MAD');
  });

  it('formats currency in Arabic locale', () => {
    const result = formatCurrency(1500, 'ar');
    expect(result).toBeTruthy();
  });

  it('accepts custom currency', () => {
    const result = formatCurrency(1500, 'en', 'USD');
    expect(result).toContain('$');
  });

  it('formats without decimal places', () => {
    const result = formatCurrency(1500.99, 'en');
    // Should round to no decimals
    expect(result).not.toContain('.99');
  });
});

describe('formatHeight', () => {
  it('formats height in French locale', () => {
    const result = formatHeight(175, 'fr');
    expect(result).toBe('175 cm');
  });

  it('formats height in English locale', () => {
    const result = formatHeight(175, 'en');
    expect(result).toBe('175 cm');
  });

  it('formats height in Arabic locale', () => {
    const result = formatHeight(175, 'ar');
    expect(result).toContain('cm');
  });

  it('formats large height values', () => {
    const result = formatHeight(200, 'en');
    expect(result).toBe('200 cm');
  });
});

describe('formatAgeRange', () => {
  it('formats age range in French locale', () => {
    const result = formatAgeRange(18, 25, 'fr');
    expect(result).toBe('18 - 25');
  });

  it('formats age range in English locale', () => {
    const result = formatAgeRange(18, 25, 'en');
    expect(result).toBe('18 - 25');
  });

  it('formats age range in Arabic locale', () => {
    const result = formatAgeRange(18, 25, 'ar');
    expect(result).toContain('-');
  });

  it('formats same min and max', () => {
    const result = formatAgeRange(30, 30, 'en');
    expect(result).toBe('30 - 30');
  });
});
