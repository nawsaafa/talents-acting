import { describe, it, expect } from 'vitest';
import {
  AVAILABILITY_TYPES,
  AVAILABILITY_TYPE_LABELS,
  getAvailabilityLabel,
  getAvailabilityLabels,
  isValidAvailabilityType,
  parseAvailabilityTypes,
} from '@/lib/talents/availability-types';
import { AvailabilityType } from '@prisma/client';

describe('availability-types', () => {
  describe('AVAILABILITY_TYPES', () => {
    it('should contain all 9 availability types', () => {
      expect(AVAILABILITY_TYPES).toHaveLength(9);
    });

    it('should include expected types', () => {
      expect(AVAILABILITY_TYPES).toContain('ALWAYS');
      expect(AVAILABILITY_TYPES).toContain('SHORT_TERM_1_2_DAYS');
      expect(AVAILABILITY_TYPES).toContain('MEDIUM_TERM_1_2_WEEKS');
      expect(AVAILABILITY_TYPES).toContain('LONG_TERM_1_4_MONTHS');
      expect(AVAILABILITY_TYPES).toContain('WEEKENDS_AND_HOLIDAYS');
      expect(AVAILABILITY_TYPES).toContain('HOLIDAYS_ONLY');
      expect(AVAILABILITY_TYPES).toContain('WEEKENDS_ONLY');
      expect(AVAILABILITY_TYPES).toContain('EVENINGS');
      expect(AVAILABILITY_TYPES).toContain('DAYS');
    });
  });

  describe('AVAILABILITY_TYPE_LABELS', () => {
    it('should have a label for each availability type', () => {
      for (const type of AVAILABILITY_TYPES) {
        expect(AVAILABILITY_TYPE_LABELS[type]).toBeDefined();
        expect(typeof AVAILABILITY_TYPE_LABELS[type]).toBe('string');
      }
    });

    it('should have human-readable labels', () => {
      expect(AVAILABILITY_TYPE_LABELS.ALWAYS).toBe('Always available');
      expect(AVAILABILITY_TYPE_LABELS.SHORT_TERM_1_2_DAYS).toBe('1-2 days');
      expect(AVAILABILITY_TYPE_LABELS.WEEKENDS_ONLY).toBe('Weekends only');
    });
  });

  describe('getAvailabilityLabel', () => {
    it('should return correct label for valid type', () => {
      expect(getAvailabilityLabel('ALWAYS')).toBe('Always available');
      expect(getAvailabilityLabel('EVENINGS')).toBe('Evenings only');
      expect(getAvailabilityLabel('DAYS')).toBe('Daytime only');
    });

    it('should return the type itself for unknown type', () => {
      // TypeScript would normally prevent this, but testing runtime behavior
      expect(getAvailabilityLabel('UNKNOWN' as AvailabilityType)).toBe('UNKNOWN');
    });
  });

  describe('getAvailabilityLabels', () => {
    it('should return labels for array of types', () => {
      const types: AvailabilityType[] = ['ALWAYS', 'WEEKENDS_ONLY'];
      const labels = getAvailabilityLabels(types);

      expect(labels).toEqual(['Always available', 'Weekends only']);
    });

    it('should return empty array for empty input', () => {
      expect(getAvailabilityLabels([])).toEqual([]);
    });
  });

  describe('isValidAvailabilityType', () => {
    it('should return true for valid types', () => {
      expect(isValidAvailabilityType('ALWAYS')).toBe(true);
      expect(isValidAvailabilityType('SHORT_TERM_1_2_DAYS')).toBe(true);
      expect(isValidAvailabilityType('EVENINGS')).toBe(true);
    });

    it('should return false for invalid types', () => {
      expect(isValidAvailabilityType('invalid')).toBe(false);
      expect(isValidAvailabilityType('SOMETIMES')).toBe(false);
      expect(isValidAvailabilityType('')).toBe(false);
    });
  });

  describe('parseAvailabilityTypes', () => {
    it('should filter valid types from array', () => {
      const input = ['ALWAYS', 'invalid', 'WEEKENDS_ONLY', 'unknown'];
      const result = parseAvailabilityTypes(input);

      expect(result).toEqual(['ALWAYS', 'WEEKENDS_ONLY']);
    });

    it('should return empty array for all invalid', () => {
      expect(parseAvailabilityTypes(['invalid', 'unknown'])).toEqual([]);
    });

    it('should return all for all valid', () => {
      const input = ['ALWAYS', 'DAYS'];
      expect(parseAvailabilityTypes(input)).toEqual(['ALWAYS', 'DAYS']);
    });

    it('should return empty array for empty input', () => {
      expect(parseAvailabilityTypes([])).toEqual([]);
    });
  });
});
