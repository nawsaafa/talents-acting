'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';
import { sendEmail } from '@/lib/email/send';
import {
  getVerificationEmailHtml,
  getVerificationEmailText,
} from '@/lib/email/templates/verification';
import { getApprovedEmailHtml, getApprovedEmailText } from '@/lib/email/templates/approved';
import { getRejectedEmailHtml, getRejectedEmailText } from '@/lib/email/templates/rejected';
import {
  createProfessionalWithUser,
  emailExists,
  verifyProfessionalEmail,
  regenerateVerificationToken,
  getProfessionalByUserId,
  approveProfessional,
  rejectProfessional,
  updateProfessionalProfile,
} from './queries';
import {
  professionalRegistrationSchema,
  professionalProfileUpdateSchema,
  adminValidationSchema,
} from './validation';

interface ActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

// Register a new professional
export async function registerProfessional(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profession: string;
  company?: string;
  phone?: string;
  reasonForAccess: string;
}): Promise<ActionResult> {
  try {
    // Validate input
    const validated = professionalRegistrationSchema.safeParse({
      ...data,
      acceptTerms: true,
      acceptPrivacy: true,
    });

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid input',
      };
    }

    // Check if email already exists
    const exists = await emailExists(data.email);
    if (exists) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user and professional profile
    const user = await createProfessionalWithUser({
      ...data,
      password: hashedPassword,
    });

    // Send verification email
    const verificationToken = user.professionalProfile?.verificationToken;
    if (verificationToken) {
      await sendEmail({
        to: data.email,
        subject: 'Verify your email - Talents Acting',
        html: getVerificationEmailHtml({
          firstName: data.firstName,
          verificationToken,
        }),
        text: getVerificationEmailText({
          firstName: data.firstName,
          verificationToken,
        }),
      });
    }

    return {
      success: true,
      data: { userId: user.id },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Failed to create account. Please try again.',
    };
  }
}

// Verify email with token
export async function verifyEmail(token: string): Promise<ActionResult> {
  try {
    if (!token) {
      return {
        success: false,
        error: 'Verification token is required',
      };
    }

    const result = await verifyProfessionalEmail(token);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    if (result.alreadyVerified) {
      return {
        success: true,
        data: { alreadyVerified: true },
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: 'Failed to verify email. Please try again.',
    };
  }
}

// Resend verification email
export async function resendVerificationEmail(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to resend verification email',
      };
    }

    const profile = await regenerateVerificationToken(session.user.id);
    if (!profile || !profile.verificationToken) {
      return {
        success: false,
        error: 'Failed to generate verification token',
      };
    }

    await sendEmail({
      to: profile.user.email,
      subject: 'Verify your email - Talents Acting',
      html: getVerificationEmailHtml({
        firstName: profile.firstName,
        verificationToken: profile.verificationToken,
      }),
      text: getVerificationEmailText({
        firstName: profile.firstName,
        verificationToken: profile.verificationToken,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'Failed to resend verification email. Please try again.',
    };
  }
}

// Admin: Approve a professional
export async function adminApproveProfessional(professionalId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return {
        success: false,
        error: 'You do not have permission to perform this action',
      };
    }

    const professional = await approveProfessional(professionalId, session.user.id);

    // Send approval email
    await sendEmail({
      to: professional.user.email,
      subject: 'Your account has been approved - Talents Acting',
      html: getApprovedEmailHtml({ firstName: professional.firstName }),
      text: getApprovedEmailText({ firstName: professional.firstName }),
    });

    revalidatePath('/admin/professionals');
    return { success: true };
  } catch (error) {
    console.error('Admin approval error:', error);
    return {
      success: false,
      error: 'Failed to approve professional. Please try again.',
    };
  }
}

// Admin: Reject a professional
export async function adminRejectProfessional(
  professionalId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return {
        success: false,
        error: 'You do not have permission to perform this action',
      };
    }

    // Validate input
    const validated = adminValidationSchema.safeParse({
      status: 'REJECTED',
      rejectionReason: reason,
    });

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Rejection reason is required',
      };
    }

    const professional = await rejectProfessional(professionalId, session.user.id, reason);

    // Send rejection email
    await sendEmail({
      to: professional.user.email,
      subject: 'Update on your account application - Talents Acting',
      html: getRejectedEmailHtml({
        firstName: professional.firstName,
        reason,
      }),
      text: getRejectedEmailText({
        firstName: professional.firstName,
        reason,
      }),
    });

    revalidatePath('/admin/professionals');
    return { success: true };
  } catch (error) {
    console.error('Admin rejection error:', error);
    return {
      success: false,
      error: 'Failed to reject professional. Please try again.',
    };
  }
}

// Update professional profile
export async function updateProfile(data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    // Validate input
    const validated = professionalProfileUpdateSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid input',
      };
    }

    await updateProfessionalProfile(session.user.id, validated.data);

    revalidatePath('/dashboard/professional/profile');
    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
}

// Get current user's professional profile
export async function getCurrentProfessionalProfile(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    const profile = await getProfessionalByUserId(session.user.id);
    if (!profile) {
      return {
        success: false,
        error: 'Professional profile not found',
      };
    }

    return {
      success: true,
      data: {
        profile: {
          id: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          profession: profile.profession,
          company: profile.company,
          phone: profile.phone,
          website: profile.website,
          emailVerified: profile.emailVerified,
          validationStatus: profile.validationStatus,
          subscriptionStatus: profile.subscriptionStatus,
          subscriptionEndsAt: profile.subscriptionEndsAt,
          createdAt: profile.createdAt,
        },
        user: profile.user,
      },
    };
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: 'Failed to load profile. Please try again.',
    };
  }
}
