/**
 * Unit tests for migration validator
 * Tests profile validation and duplicate detection logic
 */

import {
  isValidEmail,
  isValidUrl,
  isAsciiOnly,
  validateProfile,
  validateAllProfiles,
  findDuplicateEmails,
  generateValidationSummary,
} from '../../scripts/migration/validator';
import { ParsedWordPressProfile } from '../../scripts/migration/types';

describe('migration validator', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('a@b.co')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
      expect(isValidEmail('spaces in@email.com')).toBe(false);
      expect(isValidEmail('double@@at.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://www.example.com/path?query=value')).toBe(true);
      expect(isValidUrl('ftp://files.example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('/relative/path')).toBe(false);
    });
  });

  describe('isAsciiOnly', () => {
    it('should return true for ASCII-only strings', () => {
      expect(isAsciiOnly('Hello World')).toBe(true);
      expect(isAsciiOnly('abc123!@#')).toBe(true);
      expect(isAsciiOnly('')).toBe(true);
      expect(isAsciiOnly('   ')).toBe(true);
    });

    it('should return false for strings with non-ASCII characters', () => {
      expect(isAsciiOnly('caf\u00e9')).toBe(false);
      expect(isAsciiOnly('\u00e0 la carte')).toBe(false);
      expect(isAsciiOnly('\u4e2d\u6587')).toBe(false);
      expect(isAsciiOnly('\u0645\u0631\u062d\u0628\u0627')).toBe(false);
      expect(isAsciiOnly('emoji \ud83d\ude00')).toBe(false);
    });
  });

  describe('validateProfile', () => {
    const createValidProfile = (): ParsedWordPressProfile => ({
      userId: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      ageMin: 25,
      ageMax: 35,
    });

    it('should validate a complete valid profile', () => {
      const profile = createValidProfile();
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(result.legacyId).toBe('123');
      expect(result.issues).toHaveLength(0);
    });

    it('should validate with missing email (email not in required fields)', () => {
      // Note: email is validated for format but not as required field
      // in the current implementation since profiles come from WordPress
      // which always has an email
      const profile = createValidProfile();
      profile.email = '';
      const result = validateProfile(profile);

      // Profile is still valid because email is not in REQUIRED_PROFILE_FIELDS
      expect(result.isValid).toBe(true);
    });

    it('should fail validation for missing firstName', () => {
      const profile = createValidProfile();
      profile.firstName = '';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'firstName' && i.type === 'error')).toBe(true);
    });

    it('should fail validation for missing lastName', () => {
      const profile = createValidProfile();
      profile.lastName = '';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(result.issues.some((i) => i.field === 'lastName' && i.type === 'error')).toBe(true);
    });

    it('should fail validation for invalid email format', () => {
      const profile = createValidProfile();
      profile.email = 'invalid-email';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(false);
      expect(
        result.issues.some((i) => i.field === 'email' && i.message === 'Invalid email format')
      ).toBe(true);
    });

    it('should handle unknown gender value', () => {
      const profile = createValidProfile();
      profile.gender = 'unknown_gender';
      const result = validateProfile(profile);

      // Unknown gender value triggers the special handling in validator
      // The profile is still valid because gender has a value (just not mappable)
      // and will default to OTHER in transformation
      expect(result.isValid).toBe(true);
    });

    it('should add warning for age below minimum', () => {
      const profile = createValidProfile();
      profile.ageMin = 0;
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true); // Warnings don't fail validation
      expect(result.issues.some((i) => i.field === 'ageMin' && i.type === 'warning')).toBe(true);
    });

    it('should add warning for age above maximum', () => {
      const profile = createValidProfile();
      profile.ageMax = 150;
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(result.issues.some((i) => i.field === 'ageMax' && i.type === 'warning')).toBe(true);
    });

    it('should add warning when ageMin > ageMax', () => {
      const profile = createValidProfile();
      profile.ageMin = 40;
      profile.ageMax = 30;
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(
        result.issues.some(
          (i) => i.field === 'ageRange' && i.message === 'ageMin is greater than ageMax'
        )
      ).toBe(true);
    });

    it('should add warning for height below minimum', () => {
      const profile = createValidProfile();
      profile.height = 40; // Min is 50
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(result.issues.some((i) => i.field === 'height' && i.type === 'warning')).toBe(true);
    });

    it('should add warning for height above maximum', () => {
      const profile = createValidProfile();
      profile.height = 350; // Max is 300
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(result.issues.some((i) => i.field === 'height' && i.type === 'warning')).toBe(true);
    });

    it('should add warning for array exceeding max length', () => {
      const profile = createValidProfile();
      // Max for languages is 20, so use 25
      profile.languages = Array.from({ length: 25 }, (_, i) => `Language${i}`);
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(
        result.issues.some(
          (i) => i.field === 'languages' && i.message.includes('Array exceeds maximum')
        )
      ).toBe(true);
    });

    it('should add warning for invalid IMDB URL', () => {
      const profile = createValidProfile();
      profile.imdbUrl = 'not-a-valid-url';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(
        result.issues.some((i) => i.field === 'imdbUrl' && i.message === 'Invalid IMDB URL format')
      ).toBe(true);
    });

    it('should add warning for invalid showreel URL', () => {
      const profile = createValidProfile();
      profile.showreel = 'invalid-url';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(
        result.issues.some(
          (i) => i.field === 'showreel' && i.message === 'Invalid showreel URL format'
        )
      ).toBe(true);
    });

    it('should add warning for invalid presentation video URL', () => {
      const profile = createValidProfile();
      profile.presentationVideo = 'bad-url';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(
        result.issues.some(
          (i) =>
            i.field === 'presentationVideo' && i.message === 'Invalid presentation video URL format'
        )
      ).toBe(true);
    });

    it('should add warning for non-ASCII characters in text fields', () => {
      const profile = createValidProfile();
      profile.firstName = 'Ren\u00e9';
      const result = validateProfile(profile);

      expect(result.isValid).toBe(true);
      expect(
        result.issues.some(
          (i) => i.field === 'firstName' && i.message.includes('non-ASCII characters')
        )
      ).toBe(true);
    });

    it('should not add warning for ASCII-only text fields', () => {
      const profile = createValidProfile();
      profile.firstName = 'John';
      profile.lastName = 'Doe';
      const result = validateProfile(profile);

      expect(result.issues.some((i) => i.message.includes('non-ASCII'))).toBe(false);
    });
  });

  describe('validateAllProfiles', () => {
    it('should validate multiple profiles and generate report', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
        {
          userId: '2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
        },
      ];

      const report = validateAllProfiles(profiles);

      expect(report.totalProfiles).toBe(2);
      expect(report.validProfiles).toBe(2);
      expect(report.invalidProfiles).toBe(0);
      expect(report.results).toHaveLength(2);
    });

    it('should count invalid profiles correctly', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
        {
          userId: '2',
          email: '', // Invalid - missing email
          firstName: '',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
        },
      ];

      const report = validateAllProfiles(profiles);

      expect(report.totalProfiles).toBe(2);
      expect(report.validProfiles).toBe(1);
      expect(report.invalidProfiles).toBe(1);
    });

    it('should count errors and warnings separately', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
          height: 40, // Warning - below minimum (50)
        },
        {
          userId: '2',
          email: 'user2@example.com',
          firstName: '', // Error - required field missing
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
          height: 40, // Warning - below minimum (50)
        },
      ];

      const report = validateAllProfiles(profiles);

      expect(report.errorCount).toBeGreaterThan(0);
      expect(report.warningCount).toBeGreaterThan(0);
    });

    it('should return empty report for empty input', () => {
      const report = validateAllProfiles([]);

      expect(report.totalProfiles).toBe(0);
      expect(report.validProfiles).toBe(0);
      expect(report.invalidProfiles).toBe(0);
      expect(report.results).toHaveLength(0);
    });
  });

  describe('findDuplicateEmails', () => {
    it('should return empty map when no duplicates', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
        {
          userId: '2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
        },
      ];

      const duplicates = findDuplicateEmails(profiles);

      expect(duplicates.size).toBe(0);
    });

    it('should find duplicate emails', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'duplicate@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
        {
          userId: '2',
          email: 'unique@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
        },
        {
          userId: '3',
          email: 'duplicate@example.com',
          firstName: 'User',
          lastName: 'Three',
          gender: 'male',
          ageMin: 35,
          ageMax: 45,
        },
      ];

      const duplicates = findDuplicateEmails(profiles);

      expect(duplicates.size).toBe(1);
      expect(duplicates.has('duplicate@example.com')).toBe(true);
      expect(duplicates.get('duplicate@example.com')).toEqual(['1', '3']);
    });

    it('should be case-insensitive for email comparison', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'Test@Example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
        {
          userId: '2',
          email: 'test@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
        },
      ];

      const duplicates = findDuplicateEmails(profiles);

      expect(duplicates.size).toBe(1);
      expect(duplicates.has('test@example.com')).toBe(true);
    });

    it('should find multiple groups of duplicates', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'dup1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
        {
          userId: '2',
          email: 'dup2@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
        },
        {
          userId: '3',
          email: 'dup1@example.com',
          firstName: 'User',
          lastName: 'Three',
          gender: 'male',
          ageMin: 35,
          ageMax: 45,
        },
        {
          userId: '4',
          email: 'dup2@example.com',
          firstName: 'User',
          lastName: 'Four',
          gender: 'female',
          ageMin: 40,
          ageMax: 50,
        },
      ];

      const duplicates = findDuplicateEmails(profiles);

      expect(duplicates.size).toBe(2);
      expect(duplicates.has('dup1@example.com')).toBe(true);
      expect(duplicates.has('dup2@example.com')).toBe(true);
    });

    it('should return empty map for empty input', () => {
      const duplicates = findDuplicateEmails([]);
      expect(duplicates.size).toBe(0);
    });
  });

  describe('generateValidationSummary', () => {
    it('should generate summary for valid profiles', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
      ];

      const report = validateAllProfiles(profiles);
      const summary = generateValidationSummary(report);

      expect(summary).toContain('Validation Summary');
      expect(summary).toContain('Total profiles: 1');
      expect(summary).toContain('Valid: 1');
      expect(summary).toContain('Invalid: 0');
    });

    it('should list invalid profiles in summary', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: '', // Invalid - missing email
          firstName: '', // Invalid - missing firstName
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
      ];

      const report = validateAllProfiles(profiles);
      const summary = generateValidationSummary(report);

      expect(summary).toContain('Invalid: 1');
      expect(summary).toContain('Invalid Profiles');
      expect(summary).toContain('Legacy ID: 1');
      expect(summary).toContain('[ERROR]');
    });

    it('should list profiles with warnings', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
          height: 40, // Warning - below minimum (50)
        },
      ];

      const report = validateAllProfiles(profiles);
      const summary = generateValidationSummary(report);

      expect(summary).toContain('Profiles with Warnings');
      expect(summary).toContain('[WARN]');
    });

    it('should include error and warning counts', () => {
      const profiles: ParsedWordPressProfile[] = [
        {
          userId: '1',
          email: '', // Error
          firstName: 'User',
          lastName: 'One',
          gender: 'male',
          ageMin: 25,
          ageMax: 35,
        },
        {
          userId: '2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          gender: 'female',
          ageMin: 30,
          ageMax: 40,
          height: 40, // Warning - below minimum (50)
        },
      ];

      const report = validateAllProfiles(profiles);
      const summary = generateValidationSummary(report);

      expect(summary).toContain('Errors:');
      expect(summary).toContain('Warnings:');
    });
  });
});
