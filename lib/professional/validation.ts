import { z } from 'zod';

// Common profession options for the dropdown
export const PROFESSION_OPTIONS = [
  'Casting Director',
  'Film Director',
  'TV Director',
  'Producer',
  'Executive Producer',
  'Line Producer',
  'Talent Agent',
  'Talent Manager',
  'Production Manager',
  'Assistant Director',
  'Cinematographer',
  'Screenwriter',
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

// Step 2: Personal information
export const personalStepSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  profession: z.string().min(1, 'Profession is required'),
});

// Step 3: Professional details
export const professionalStepSchema = z.object({
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  reasonForAccess: z
    .string()
    .min(20, 'Please provide at least 20 characters explaining your reason')
    .max(1000, 'Reason must be less than 1000 characters'),
});

// Step 4: Terms acceptance
export const termsStepSchema = z.object({
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
  acceptPrivacy: z.boolean().refine((val) => val === true, 'You must accept the privacy policy'),
});

// Complete registration schema (all steps combined)
export const professionalRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  profession: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
  reasonForAccess: z.string().min(20),
  acceptTerms: z.boolean(),
  acceptPrivacy: z.boolean(),
});

// Profile update schema (for editing existing profile)
export const professionalProfileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  profession: z.string().min(1).optional(),
  company: z.string().max(100).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
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
      message: 'Rejection reason is required when rejecting a professional',
      path: ['rejectionReason'],
    }
  );

// Type exports
export type AccountStepData = z.infer<typeof accountStepSchema>;
export type PersonalStepData = z.infer<typeof personalStepSchema>;
export type ProfessionalStepData = z.infer<typeof professionalStepSchema>;
export type TermsStepData = z.infer<typeof termsStepSchema>;
export type ProfessionalRegistrationData = z.infer<typeof professionalRegistrationSchema>;
export type ProfessionalProfileUpdateData = z.infer<typeof professionalProfileUpdateSchema>;
export type AdminValidationData = z.infer<typeof adminValidationSchema>;

// Combined wizard data type
export type WizardData = {
  account: Partial<AccountStepData>;
  personal: Partial<PersonalStepData>;
  professional: Partial<ProfessionalStepData>;
  terms: Partial<TermsStepData>;
};

// Initial wizard state
export const initialWizardData: WizardData = {
  account: {},
  personal: {},
  professional: {},
  terms: {},
};
