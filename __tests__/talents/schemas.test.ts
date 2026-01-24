import { describe, it, expect } from 'vitest';
import { imdbUrlSchema, AvailabilityTypeSchema } from '@/lib/talents/validation';

describe('talent validation schemas', () => {
  describe('imdbUrlSchema', () => {
    it('should accept valid IMDB URLs', () => {
      const validUrls = [
        'https://www.imdb.com/name/nm1234567/',
        'https://www.imdb.com/name/nm0000001/',
        'https://imdb.com/name/nm9999999/',
        'http://www.imdb.com/name/nm123/',
        'http://imdb.com/name/nm1/',
      ];

      for (const url of validUrls) {
        const result = imdbUrlSchema.safeParse(url);
        expect(result.success, `Expected ${url} to be valid`).toBe(true);
      }
    });

    it('should reject invalid IMDB URLs', () => {
      const invalidUrls = [
        'https://www.imdb.com/title/tt1234567/', // title not name
        'https://www.imdb.com/name/abc123/', // no nm prefix
        'https://google.com/name/nm1234567/', // wrong domain
        'www.imdb.com/name/nm1234567/', // no protocol
        'https://www.imdb.com/actor/nm1234567/', // wrong path
        'https://www.imdb.com/name/', // missing nm number
        'not-a-url',
      ];

      for (const url of invalidUrls) {
        const result = imdbUrlSchema.safeParse(url);
        expect(result.success, `Expected ${url} to be invalid`).toBe(false);
      }
    });

    it('should accept null values', () => {
      const result = imdbUrlSchema.safeParse(null);
      expect(result.success).toBe(true);
    });

    it('should accept undefined values', () => {
      const result = imdbUrlSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });
  });

  describe('AvailabilityTypeSchema', () => {
    it('should accept valid availability types', () => {
      const validTypes = [
        'ALWAYS',
        'SHORT_TERM_1_2_DAYS',
        'MEDIUM_TERM_1_2_WEEKS',
        'LONG_TERM_1_4_MONTHS',
        'WEEKENDS_AND_HOLIDAYS',
        'HOLIDAYS_ONLY',
        'WEEKENDS_ONLY',
        'EVENINGS',
        'DAYS',
      ];

      for (const type of validTypes) {
        const result = AvailabilityTypeSchema.safeParse(type);
        expect(result.success, `Expected ${type} to be valid`).toBe(true);
      }
    });

    it('should reject invalid availability types', () => {
      const invalidTypes = ['INVALID', 'sometimes', 'weekly', '', null, undefined, 123];

      for (const type of invalidTypes) {
        const result = AvailabilityTypeSchema.safeParse(type);
        expect(result.success, `Expected ${type} to be invalid`).toBe(false);
      }
    });
  });
});
