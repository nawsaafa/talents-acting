import { describe, it, expect } from 'vitest';
import {
  accountStepSchema,
  companyStepSchema,
  contactStepSchema,
  termsStepSchema,
  companyProfileUpdateSchema,
  inviteMemberSchema,
  acceptInviteSchema,
  adminValidationSchema,
  INDUSTRY_OPTIONS,
} from '@/lib/company/validation';

describe('Company Validation Schemas', () => {
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

  describe('companyStepSchema', () => {
    it('validates valid company data', () => {
      const result = companyStepSchema.safeParse({
        companyName: 'Acme Productions',
        industry: 'Film Production',
        description: 'A leading film production company.',
        website: 'https://acme.com',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty company name', () => {
      const result = companyStepSchema.safeParse({
        companyName: '',
        industry: 'Film Production',
      });
      expect(result.success).toBe(false);
    });

    it('rejects company name that is too short', () => {
      const result = companyStepSchema.safeParse({
        companyName: 'A',
        industry: 'Film Production',
      });
      expect(result.success).toBe(false);
    });

    it('rejects company name that is too long', () => {
      const result = companyStepSchema.safeParse({
        companyName: 'A'.repeat(101),
        industry: 'Film Production',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty industry', () => {
      const result = companyStepSchema.safeParse({
        companyName: 'Acme Productions',
        industry: '',
      });
      expect(result.success).toBe(false);
    });

    it('accepts empty optional fields', () => {
      const result = companyStepSchema.safeParse({
        companyName: 'Acme Productions',
        industry: 'Film Production',
        description: '',
        website: '',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid website URL', () => {
      const result = companyStepSchema.safeParse({
        companyName: 'Acme Productions',
        industry: 'Film Production',
        website: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('rejects description that is too long', () => {
      const result = companyStepSchema.safeParse({
        companyName: 'Acme Productions',
        industry: 'Film Production',
        description: 'A'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('contactStepSchema', () => {
    it('validates valid contact data', () => {
      const result = contactStepSchema.safeParse({
        contactEmail: 'contact@example.com',
        contactPhone: '+1234567890',
        address: '123 Main St',
        city: 'Los Angeles',
        country: 'USA',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid contact email', () => {
      const result = contactStepSchema.safeParse({
        contactEmail: 'invalid-email',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty contact email', () => {
      const result = contactStepSchema.safeParse({
        contactEmail: '',
      });
      expect(result.success).toBe(false);
    });

    it('accepts empty optional fields', () => {
      const result = contactStepSchema.safeParse({
        contactEmail: 'contact@example.com',
        contactPhone: '',
        address: '',
        city: '',
        country: '',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid phone format', () => {
      const result = contactStepSchema.safeParse({
        contactEmail: 'contact@example.com',
        contactPhone: 'not-a-phone',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid phone formats', () => {
      const validPhones = [
        '+1 (555) 123-4567',
        '555-123-4567',
        '+44 20 7946 0958',
        '(555) 123 4567',
      ];
      for (const phone of validPhones) {
        const result = contactStepSchema.safeParse({
          contactEmail: 'contact@example.com',
          contactPhone: phone,
        });
        expect(result.success).toBe(true);
      }
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

  describe('companyProfileUpdateSchema', () => {
    it('validates a valid profile update', () => {
      const result = companyProfileUpdateSchema.safeParse({
        companyName: 'Acme Productions',
        industry: 'Film Production',
        description: 'Updated description',
        website: 'https://example.com',
        contactEmail: 'contact@example.com',
        contactPhone: '+1234567890',
        address: '123 Main St',
        city: 'Los Angeles',
        country: 'USA',
      });
      expect(result.success).toBe(true);
    });

    it('validates partial updates', () => {
      const result = companyProfileUpdateSchema.safeParse({
        companyName: 'New Name',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid website URL', () => {
      const result = companyProfileUpdateSchema.safeParse({
        website: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('accepts empty website string', () => {
      const result = companyProfileUpdateSchema.safeParse({
        website: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('inviteMemberSchema', () => {
    it('validates a valid invitation', () => {
      const result = inviteMemberSchema.safeParse({
        email: 'colleague@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'MEMBER',
      });
      expect(result.success).toBe(true);
    });

    it('validates invitation with admin role', () => {
      const result = inviteMemberSchema.safeParse({
        email: 'admin@example.com',
        role: 'ADMIN',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = inviteMemberSchema.safeParse({
        email: 'invalid-email',
        role: 'MEMBER',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty email', () => {
      const result = inviteMemberSchema.safeParse({
        email: '',
        role: 'MEMBER',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid role', () => {
      const result = inviteMemberSchema.safeParse({
        email: 'test@example.com',
        role: 'INVALID_ROLE',
      });
      expect(result.success).toBe(false);
    });

    it('accepts empty optional name fields', () => {
      const result = inviteMemberSchema.safeParse({
        email: 'test@example.com',
        firstName: '',
        lastName: '',
        role: 'MEMBER',
      });
      expect(result.success).toBe(true);
    });

    it('rejects name that is too long', () => {
      const result = inviteMemberSchema.safeParse({
        email: 'test@example.com',
        firstName: 'A'.repeat(51),
        role: 'MEMBER',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('acceptInviteSchema', () => {
    it('validates a valid invite acceptance', () => {
      const result = acceptInviteSchema.safeParse({
        token: 'abc123token',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty token', () => {
      const result = acceptInviteSchema.safeParse({
        token: '',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('rejects mismatched passwords', () => {
      const result = acceptInviteSchema.safeParse({
        token: 'abc123token',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('rejects weak password', () => {
      const result = acceptInviteSchema.safeParse({
        token: 'abc123token',
        password: 'weak',
        confirmPassword: 'weak',
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty first name', () => {
      const result = acceptInviteSchema.safeParse({
        token: 'abc123token',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: '',
        lastName: 'Doe',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty last name', () => {
      const result = acceptInviteSchema.safeParse({
        token: 'abc123token',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'John',
        lastName: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('adminValidationSchema', () => {
    it('validates approval', () => {
      const result = adminValidationSchema.safeParse({
        status: 'APPROVED',
      });
      expect(result.success).toBe(true);
    });

    it('validates rejection with reason', () => {
      const result = adminValidationSchema.safeParse({
        status: 'REJECTED',
        rejectionReason: 'Company information is incomplete.',
      });
      expect(result.success).toBe(true);
    });

    it('rejects rejection without reason', () => {
      const result = adminValidationSchema.safeParse({
        status: 'REJECTED',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid status', () => {
      const result = adminValidationSchema.safeParse({
        status: 'INVALID_STATUS',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('INDUSTRY_OPTIONS', () => {
    it('contains expected industries', () => {
      expect(INDUSTRY_OPTIONS).toContain('Film Production');
      expect(INDUSTRY_OPTIONS).toContain('TV Production');
      expect(INDUSTRY_OPTIONS).toContain('Talent Agency');
      expect(INDUSTRY_OPTIONS).toContain('Casting Agency');
      expect(INDUSTRY_OPTIONS).toContain('Other');
    });

    it('has at least 5 options', () => {
      expect(INDUSTRY_OPTIONS.length).toBeGreaterThanOrEqual(5);
    });
  });
});
