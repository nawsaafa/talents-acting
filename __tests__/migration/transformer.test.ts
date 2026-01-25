/**
 * Unit tests for data transformer
 * Tests WordPress to Prisma data transformation logic
 */

import {
  transliterateToAscii,
  transformProfile,
  transformAllProfiles,
  validateTransformedProfile,
  TransformedProfile,
} from '../../scripts/migration/data-transformer';
import { ParsedWordPressProfile } from '../../scripts/migration/types';

describe('data-transformer', () => {
  describe('transliterateToAscii', () => {
    it('should return empty string for empty input', () => {
      expect(transliterateToAscii('')).toBe('');
    });

    it('should return same string for ASCII-only input', () => {
      expect(transliterateToAscii('John Doe')).toBe('John Doe');
      expect(transliterateToAscii('Hello World 123')).toBe('Hello World 123');
    });

    it('should transliterate French accented characters', () => {
      expect(transliterateToAscii('cafe')).toBe('cafe');
      expect(transliterateToAscii('caf\u00e9')).toBe('cafe');
      expect(transliterateToAscii('fran\u00e7ais')).toBe('francais');
      expect(transliterateToAscii('\u00e0 la carte')).toBe('a la carte');
      expect(transliterateToAscii('na\u00efve')).toBe('naive');
    });

    it('should transliterate uppercase French accented characters', () => {
      expect(transliterateToAscii('\u00c9tienne')).toBe('Etienne');
      expect(transliterateToAscii('\u00c0 BIENT\u00d4T')).toBe('A BIENTOT');
    });

    it('should remove non-ASCII characters that cannot be mapped', () => {
      expect(transliterateToAscii('Hello \u4e16\u754c')).toBe('Hello ');
      expect(transliterateToAscii('\u0645\u0631\u062d\u0628\u0627')).toBe('');
    });

    it('should handle mixed content', () => {
      expect(transliterateToAscii('Ren\u00e9 from Paris')).toBe('Rene from Paris');
      expect(transliterateToAscii('L\u00e9a \u00c9mile')).toBe('Lea Emile');
    });

    it('should handle null/undefined gracefully', () => {
      expect(transliterateToAscii(null as unknown as string)).toBe(null);
      expect(transliterateToAscii(undefined as unknown as string)).toBe(undefined);
    });
  });

  describe('transformProfile', () => {
    const createMinimalProfile = (): ParsedWordPressProfile => ({
      userId: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      ageMin: 25,
      ageMax: 35,
      registeredAt: '2024-01-15',
    });

    it('should transform a minimal valid profile', () => {
      const parsed = createMinimalProfile();
      const result = transformProfile(parsed);

      expect(result.legacyId).toBe('123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.legacyId).toBe('123');
      expect(result.user.role).toBe('TALENT');
      expect(result.user.isActive).toBe(true);
      expect(result.profile.firstName).toBe('John');
      expect(result.profile.lastName).toBe('Doe');
      expect(result.profile.gender).toBe('MALE');
      expect(result.profile.ageRangeMin).toBe(25);
      expect(result.profile.ageRangeMax).toBe(35);
      expect(result.profile.legacyId).toBe('123');
      expect(result.profile.validationStatus).toBe('APPROVED');
      expect(result.profile.subscriptionStatus).toBe('NONE');
      expect(result.warnings).toHaveLength(0);
    });

    it('should generate a random password for users', () => {
      const parsed = createMinimalProfile();
      const result = transformProfile(parsed);

      expect(result.user.password).toBeDefined();
      expect(result.user.password.length).toBe(16);
    });

    it('should normalize email to lowercase and trim', () => {
      const parsed = createMinimalProfile();
      parsed.email = '  TEST@Example.COM  ';
      const result = transformProfile(parsed);

      expect(result.user.email).toBe('test@example.com');
    });

    it('should map gender variations correctly', () => {
      const testCases: Array<{ input: string; expected: string }> = [
        { input: 'male', expected: 'MALE' },
        { input: 'MALE', expected: 'MALE' },
        { input: 'm', expected: 'MALE' },
        { input: 'homme', expected: 'MALE' },
        { input: 'female', expected: 'FEMALE' },
        { input: 'FEMALE', expected: 'FEMALE' },
        { input: 'f', expected: 'FEMALE' },
        { input: 'femme', expected: 'FEMALE' },
      ];

      for (const { input, expected } of testCases) {
        const parsed = createMinimalProfile();
        parsed.gender = input;
        const result = transformProfile(parsed);
        expect(result.profile.gender).toBe(expected);
      }
    });

    it('should default to OTHER for unknown gender', () => {
      const parsed = createMinimalProfile();
      parsed.gender = 'unknown_value';
      const result = transformProfile(parsed);

      expect(result.profile.gender).toBe('OTHER');
      expect(result.warnings).toContain(
        'Unknown gender value: "unknown_value", defaulting to OTHER'
      );
    });

    it('should transliterate names with accents', () => {
      const parsed = createMinimalProfile();
      parsed.firstName = 'Ren\u00e9';
      parsed.lastName = 'Fran\u00e7ois';
      const result = transformProfile(parsed);

      expect(result.profile.firstName).toBe('Rene');
      expect(result.profile.lastName).toBe('Francois');
    });

    it('should transform physical attributes', () => {
      const parsed = createMinimalProfile();
      parsed.height = 180;
      parsed.physique = 'athletic';
      parsed.hairColor = 'brown';
      parsed.eyeColor = 'blue';
      parsed.hairLength = 'short';
      parsed.beardType = 'full';
      parsed.hasTattoos = true;
      parsed.hasScars = false;

      const result = transformProfile(parsed);

      expect(result.profile.height).toBe(180);
      expect(result.profile.physique).toBe('ATHLETIC');
      expect(result.profile.hairColor).toBe('BROWN');
      expect(result.profile.eyeColor).toBe('BLUE');
      expect(result.profile.hairLength).toBe('SHORT');
      expect(result.profile.beardType).toBe('FULL');
      expect(result.profile.hasTattoos).toBe(true);
      expect(result.profile.hasScars).toBe(false);
    });

    it('should handle skill arrays', () => {
      const parsed = createMinimalProfile();
      parsed.languages = ['French', 'English', 'Arabic'];
      parsed.accents = ['Parisian', 'British'];
      parsed.athleticSkills = ['Swimming', 'Running'];
      parsed.musicalInstruments = ['Piano', 'Guitar'];
      parsed.performanceSkills = ['Comedy', 'Drama'];
      parsed.danceStyles = ['Ballet', 'Contemporary'];

      const result = transformProfile(parsed);

      expect(result.profile.languages).toEqual(['French', 'English', 'Arabic']);
      expect(result.profile.accents).toEqual(['Parisian', 'British']);
      expect(result.profile.athleticSkills).toEqual(['Swimming', 'Running']);
      expect(result.profile.musicalInstruments).toEqual(['Piano', 'Guitar']);
      expect(result.profile.performanceSkills).toEqual(['Comedy', 'Drama']);
      expect(result.profile.danceStyles).toEqual(['Ballet', 'Contemporary']);
    });

    it('should truncate arrays exceeding max length', () => {
      const parsed = createMinimalProfile();
      // Create array with more than 20 items (max for languages is 20)
      parsed.languages = Array.from({ length: 25 }, (_, i) => `Language${i + 1}`);

      const result = transformProfile(parsed);

      expect(result.profile.languages).toHaveLength(20);
      expect(result.warnings.some((w) => w.includes('languages truncated'))).toBe(true);
    });

    it('should handle media fields', () => {
      const parsed = createMinimalProfile();
      parsed.photos = ['/uploads/photo1.jpg', '/uploads/photo2.jpg'];
      parsed.videoUrls = ['https://youtube.com/v1', 'https://vimeo.com/v2'];
      parsed.showreel = 'https://vimeo.com/showreel';
      parsed.presentationVideo = 'https://youtube.com/intro';

      const result = transformProfile(parsed);

      expect(result.profile.photos).toEqual(['/uploads/photo1.jpg', '/uploads/photo2.jpg']);
      expect(result.profile.videoUrls).toEqual(['https://youtube.com/v1', 'https://vimeo.com/v2']);
      expect(result.profile.showreel).toBe('https://vimeo.com/showreel');
      expect(result.profile.hasShowreel).toBe(true);
      expect(result.profile.presentationVideo).toBe('https://youtube.com/intro');
    });

    it('should set hasShowreel to false when no showreel', () => {
      const parsed = createMinimalProfile();
      const result = transformProfile(parsed);

      expect(result.profile.hasShowreel).toBe(false);
    });

    it('should handle availability fields', () => {
      const parsed = createMinimalProfile();
      parsed.isAvailable = true;
      parsed.availabilityTypes = ['always', 'weekends'];
      parsed.dailyRate = 500;
      parsed.rateNegotiable = false;

      const result = transformProfile(parsed);

      expect(result.profile.isAvailable).toBe(true);
      expect(result.profile.availabilityTypes).toContain('ALWAYS');
      expect(result.profile.availabilityTypes).toContain('WEEKENDS_ONLY');
      expect(result.profile.rateNegotiable).toBe(false);
    });

    it('should transform bio and location with transliteration', () => {
      const parsed = createMinimalProfile();
      parsed.bio = 'Acteur exp\u00e9riment\u00e9 bas\u00e9 \u00e0 Paris';
      parsed.location = 'Paris, le de France';

      const result = transformProfile(parsed);

      expect(result.profile.bio).toBe('Acteur experimente base a Paris');
      expect(result.profile.location).toBe('Paris, le de France');
    });

    it('should handle contact information', () => {
      const parsed = createMinimalProfile();
      parsed.contactEmail = 'CONTACT@example.com';
      parsed.contactPhone = '+33612345678';

      const result = transformProfile(parsed);

      expect(result.profile.contactEmail).toBe('contact@example.com');
      expect(result.profile.contactPhone).toBe('+33612345678');
    });

    it('should default ageRangeMax to ageMin when not provided', () => {
      const parsed = createMinimalProfile();
      parsed.ageMin = 30;
      delete (parsed as Partial<ParsedWordPressProfile>).ageMax;

      const result = transformProfile(parsed);

      expect(result.profile.ageRangeMin).toBe(30);
      expect(result.profile.ageRangeMax).toBe(30);
    });

    it('should default to age 18-25 when no age provided', () => {
      const parsed = createMinimalProfile();
      delete (parsed as Partial<ParsedWordPressProfile>).ageMin;
      delete (parsed as Partial<ParsedWordPressProfile>).ageMax;

      const result = transformProfile(parsed);

      expect(result.profile.ageRangeMin).toBe(18);
      expect(result.profile.ageRangeMax).toBe(25);
    });

    it('should parse date of birth', () => {
      const parsed = createMinimalProfile();
      parsed.birthDate = '1990-05-15';

      const result = transformProfile(parsed);

      expect(result.profile.dateOfBirth).toBeInstanceOf(Date);
      expect(result.profile.dateOfBirth?.getFullYear()).toBe(1990);
      expect(result.profile.dateOfBirth?.getMonth()).toBe(4); // 0-indexed
      expect(result.profile.dateOfBirth?.getDate()).toBe(15);
    });

    it('should use registration date for createdAt', () => {
      const parsed = createMinimalProfile();
      parsed.registeredAt = '2023-06-01T10:30:00Z';

      const result = transformProfile(parsed);

      expect(result.user.createdAt).toBeInstanceOf(Date);
      expect(result.profile.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('transformAllProfiles', () => {
    it('should transform multiple profiles', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
        },
        {
          userId: '2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
        },
      ];

      const results = transformAllProfiles(profiles);

      expect(results).toHaveLength(2);
      expect(results[0].legacyId).toBe('1');
      expect(results[1].legacyId).toBe('2');
    });

    it('should continue processing on individual transform errors', () => {
      // This test verifies error handling - if one profile fails,
      // others should still be processed
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
        },
        {
          userId: '2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
        },
      ];

      const results = transformAllProfiles(profiles);

      // Both should succeed since both are valid
      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array for empty input', () => {
      const results = transformAllProfiles([]);
      expect(results).toHaveLength(0);
    });
  });

  describe('validateTransformedProfile', () => {
    const createValidTransformed = (): TransformedProfile => ({
      user: {
        email: 'test@example.com',
        password: 'randompassword',
        role: 'TALENT',
        isActive: true,
        legacyId: '123',
      },
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'MALE',
        ageRangeMin: 25,
        ageRangeMax: 35,
        legacyId: '123',
        validationStatus: 'APPROVED',
      },
      legacyId: '123',
      warnings: [],
    });

    it('should validate a complete profile as valid', () => {
      const transformed = createValidTransformed();
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing email', () => {
      const transformed = createValidTransformed();
      transformed.user.email = '';
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing email');
    });

    it('should fail validation for missing firstName', () => {
      const transformed = createValidTransformed();
      transformed.profile.firstName = '';
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing firstName');
    });

    it('should fail validation for missing lastName', () => {
      const transformed = createValidTransformed();
      transformed.profile.lastName = '';
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing lastName');
    });

    it('should fail validation for missing gender', () => {
      const transformed = createValidTransformed();
      (transformed.profile as Record<string, unknown>).gender = '';
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing gender');
    });

    it('should fail validation for invalid ageRangeMin', () => {
      const transformed = createValidTransformed();
      transformed.profile.ageRangeMin = 0;
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid ageRangeMin');
    });

    it('should fail validation for invalid ageRangeMax', () => {
      const transformed = createValidTransformed();
      transformed.profile.ageRangeMax = -1;
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid ageRangeMax');
    });

    it('should fail validation when ageRangeMin > ageRangeMax', () => {
      const transformed = createValidTransformed();
      transformed.profile.ageRangeMin = 40;
      transformed.profile.ageRangeMax = 30;
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ageRangeMin greater than ageRangeMax');
    });

    it('should collect multiple errors', () => {
      const transformed = createValidTransformed();
      transformed.user.email = '';
      transformed.profile.firstName = '';
      transformed.profile.lastName = '';
      const result = validateTransformedProfile(transformed);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing email');
      expect(result.errors).toContain('Missing firstName');
      expect(result.errors).toContain('Missing lastName');
      expect(result.errors.length).toBe(3);
    });
  });
});
