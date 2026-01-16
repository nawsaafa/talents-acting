import { describe, it, expect } from 'vitest';
import {
  accountStepSchema,
  personalStepSchema,
  professionalStepSchema,
  termsStepSchema,
  professionalProfileUpdateSchema,
  PROFESSION_OPTIONS,
} from '@/lib/professional/validation';

describe('Professional Validation Schemas', () => {
  describe('accountStepSchema', () => {
    it('validates a valid email and password', () => {
      const result = accountStepSchema.safeParse({
        email: 'test@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = accountStepSchema.safeParse({
        email: 'invalid-email',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password shorter than 8 characters', () => {
      const result = accountStepSchema.safeParse({
        email: 'test@example.com',
        password: 'Short1!',
        confirmPassword: 'Short1!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without uppercase letter', () => {
      const result = accountStepSchema.safeParse({
        email: 'test@example.com',
        password: 'nouppercase123!',
        confirmPassword: 'nouppercase123!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without lowercase letter', () => {
      const result = accountStepSchema.safeParse({
        email: 'test@example.com',
        password: 'NOLOWERCASE123!',
        confirmPassword: 'NOLOWERCASE123!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects password without number', () => {
      const result = accountStepSchema.safeParse({
        email: 'test@example.com',
        password: 'NoNumber!!',
        confirmPassword: 'NoNumber!!',
      });
      expect(result.success).toBe(false);
    });

    it('rejects mismatched passwords', () => {
      const result = accountStepSchema.safeParse({
        email: 'test@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('personalStepSchema', () => {
    it('validates valid personal data', () => {
      const result = personalStepSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Casting Director',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty first name', () => {
      const result = personalStepSchema.safeParse({
        firstName: '',
        lastName: 'Doe',
        profession: 'Casting Director',
      });
      expect(result.success).toBe(false);
    });

    it('rejects first name that is too long', () => {
      const result = personalStepSchema.safeParse({
        firstName: 'A'.repeat(101),
        lastName: 'Doe',
        profession: 'Casting Director',
      });
      expect(result.success).toBe(false);
    });

    it('accepts all valid profession options', () => {
      for (const profession of PROFESSION_OPTIONS) {
        const result = personalStepSchema.safeParse({
          firstName: 'John',
          lastName: 'Doe',
          profession,
        });
        expect(result.success).toBe(true);
      }
    });

    it('accepts any non-empty profession string', () => {
      const result = personalStepSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Custom Profession',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty profession', () => {
      const result = personalStepSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('professionalStepSchema', () => {
    it('validates valid professional data with optional fields', () => {
      const result = professionalStepSchema.safeParse({
        company: 'Acme Productions',
        phone: '+1234567890',
        reasonForAccess: 'Looking for talent for upcoming film production.',
      });
      expect(result.success).toBe(true);
    });

    it('validates without optional fields', () => {
      const result = professionalStepSchema.safeParse({
        reasonForAccess: 'Looking for talent for upcoming film production.',
      });
      expect(result.success).toBe(true);
    });

    it('rejects too short reason for access', () => {
      const result = professionalStepSchema.safeParse({
        reasonForAccess: 'Short',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid phone format', () => {
      const result = professionalStepSchema.safeParse({
        phone: 'not-a-phone',
        reasonForAccess: 'Looking for talent for upcoming film production.',
      });
      expect(result.success).toBe(false);
    });

    it('accepts empty optional fields', () => {
      const result = professionalStepSchema.safeParse({
        company: '',
        phone: '',
        reasonForAccess: 'Looking for talent for upcoming film production.',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('termsStepSchema', () => {
    it('validates when both terms are accepted', () => {
      const result = termsStepSchema.safeParse({
        acceptTerms: true,
        acceptPrivacy: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects when terms not accepted', () => {
      const result = termsStepSchema.safeParse({
        acceptTerms: false,
        acceptPrivacy: true,
      });
      expect(result.success).toBe(false);
    });

    it('rejects when privacy not accepted', () => {
      const result = termsStepSchema.safeParse({
        acceptTerms: true,
        acceptPrivacy: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('professionalProfileUpdateSchema', () => {
    it('validates a valid profile update', () => {
      const result = professionalProfileUpdateSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Producer',
        company: 'Acme Studios',
        phone: '+1234567890',
        website: 'https://example.com',
      });
      expect(result.success).toBe(true);
    });

    it('validates without optional fields', () => {
      const result = professionalProfileUpdateSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Producer',
      });
      expect(result.success).toBe(true);
    });

    it('accepts any non-empty profession string', () => {
      const result = professionalProfileUpdateSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Custom Profession',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid website URL', () => {
      const result = professionalProfileUpdateSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Producer',
        website: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('accepts empty website string', () => {
      const result = professionalProfileUpdateSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        profession: 'Producer',
        website: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('PROFESSION_OPTIONS', () => {
    it('contains expected professions', () => {
      expect(PROFESSION_OPTIONS).toContain('Casting Director');
      expect(PROFESSION_OPTIONS).toContain('Producer');
      expect(PROFESSION_OPTIONS).toContain('Film Director');
      expect(PROFESSION_OPTIONS).toContain('Talent Agent');
      expect(PROFESSION_OPTIONS).toContain('Other');
    });

    it('has at least 5 options', () => {
      expect(PROFESSION_OPTIONS.length).toBeGreaterThanOrEqual(5);
    });
  });
});
