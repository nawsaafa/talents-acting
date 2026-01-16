import { z } from 'zod';

// Common industry options for the dropdown
export const INDUSTRY_OPTIONS = [
  'Film Production',
  'TV Production',
  'Advertising Agency',
  'Talent Agency',
  'Casting Agency',
  'Theater Production',
  'Event Production',
  'Music Production',
  'Digital Content',
  'Other',
] as const;

// Step 1: Account information
export const accountStepSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and a number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Step 2: Company information
export const companyStepSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  industry: z.string().min(1, 'Industry is required'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

// Step 3: Contact details
export const contactStepSchema = z.object({
  contactEmail: z
    .string()
    .min(1, 'Contact email is required')
    .email('Please enter a valid email address'),
  contactPhone: z
    .string()
    .regex(/^[+]?[\d\s()-]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  city: z.string().max(100, 'City must be less than 100 characters').optional().or(z.literal('')),
  country: z
    .string()
    .max(100, 'Country must be less than 100 characters')
    .optional()
    .or(z.literal('')),
});

// Step 4: Terms acceptance
export const termsStepSchema = z.object({
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
  acceptPrivacy: z.boolean().refine((val) => val === true, 'You must accept the privacy policy'),
});

// Complete registration schema (all steps combined)
export const companyRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().min(2),
  industry: z.string().min(1),
  description: z.string().optional(),
  website: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  acceptTerms: z.boolean(),
  acceptPrivacy: z.boolean(),
});

// Profile update schema (for editing existing company profile)
export const companyProfileUpdateSchema = z.object({
  companyName: z.string().min(2).max(100).optional(),
  industry: z.string().min(1).optional(),
  description: z.string().max(1000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

// Team member invitation schema
export const inviteMemberSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  firstName: z
    .string()
    .max(50, 'First name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .max(50, 'Last name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  role: z.enum(['ADMIN', 'MEMBER']),
});

// Accept invitation schema (for new users accepting invite)
export const acceptInviteSchema = z
  .object({
    token: z.string().min(1, 'Invalid invitation token'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and a number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must be less than 50 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .max(50, 'Last name must be less than 50 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Accept invitation for existing users
export const acceptInviteExistingUserSchema = z.object({
  token: z.string().min(1, 'Invalid invitation token'),
});

// Admin validation schema
export const adminValidationSchema = z
  .object({
    status: z.enum(['APPROVED', 'REJECTED']),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === 'REJECTED' && !data.rejectionReason) {
        return false;
      }
      return true;
    },
    {
      message: 'Rejection reason is required when rejecting a company',
      path: ['rejectionReason'],
    }
  );

// Type exports
export type AccountStepData = z.infer<typeof accountStepSchema>;
export type CompanyStepData = z.infer<typeof companyStepSchema>;
export type ContactStepData = z.infer<typeof contactStepSchema>;
export type TermsStepData = z.infer<typeof termsStepSchema>;
export type CompanyRegistrationData = z.infer<typeof companyRegistrationSchema>;
export type CompanyProfileUpdateData = z.infer<typeof companyProfileUpdateSchema>;
export type InviteMemberData = z.infer<typeof inviteMemberSchema>;
export type AcceptInviteData = z.infer<typeof acceptInviteSchema>;
export type AcceptInviteExistingUserData = z.infer<typeof acceptInviteExistingUserSchema>;
export type AdminValidationData = z.infer<typeof adminValidationSchema>;

// Combined wizard data type
export type WizardData = {
  account: Partial<AccountStepData>;
  company: Partial<CompanyStepData>;
  contact: Partial<ContactStepData>;
  terms: Partial<TermsStepData>;
};

// Initial wizard state
export const initialWizardData: WizardData = {
  account: {},
  company: {},
  contact: {},
  terms: {},
};
