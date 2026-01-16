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
  getCompanyInviteEmailHtml,
  getCompanyInviteEmailText,
} from '@/lib/email/templates/company-invitation';
import {
  createCompanyWithUser,
  emailExists,
  verifyCompanyEmail,
  regenerateVerificationToken,
  getCompanyByUserId,
  approveCompany,
  rejectCompany,
  updateCompanyProfile,
  inviteTeamMember,
  getMemberByInviteToken,
  acceptInviteNewUser,
  acceptInviteExistingUser,
  getTeamMembers,
  deletePendingInvite,
  deactivateMember,
} from './queries';
import {
  companyRegistrationSchema,
  companyProfileUpdateSchema,
  adminValidationSchema,
  inviteMemberSchema,
  acceptInviteSchema,
} from './validation';

interface ActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

// Register a new company
export async function registerCompany(data: {
  email: string;
  password: string;
  companyName: string;
  industry: string;
  description?: string;
  website?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  country?: string;
}): Promise<ActionResult> {
  try {
    // Validate input
    const validated = companyRegistrationSchema.safeParse({
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

    // Create user and company profile
    const user = await createCompanyWithUser({
      ...data,
      password: hashedPassword,
    });

    // Send verification email
    const verificationToken = user.companyProfile?.verificationToken;
    if (verificationToken) {
      await sendEmail({
        to: data.email,
        subject: 'Verify your email - Talents Acting',
        html: getVerificationEmailHtml({
          firstName: data.companyName,
          verificationToken,
          accountType: 'company',
        }),
        text: getVerificationEmailText({
          firstName: data.companyName,
          verificationToken,
          accountType: 'company',
        }),
      });
    }

    return {
      success: true,
      data: { userId: user.id },
    };
  } catch (error) {
    console.error('Company registration error:', error);
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

    const result = await verifyCompanyEmail(token);

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
        firstName: profile.companyName,
        verificationToken: profile.verificationToken,
        accountType: 'company',
      }),
      text: getVerificationEmailText({
        firstName: profile.companyName,
        verificationToken: profile.verificationToken,
        accountType: 'company',
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

// Admin: Approve a company
export async function adminApproveCompany(companyId: string): Promise<ActionResult> {
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

    const company = await approveCompany(companyId, session.user.id);

    // Send approval email
    await sendEmail({
      to: company.user.email,
      subject: 'Your company account has been approved - Talents Acting',
      html: getApprovedEmailHtml({ firstName: company.companyName, accountType: 'company' }),
      text: getApprovedEmailText({ firstName: company.companyName, accountType: 'company' }),
    });

    revalidatePath('/admin/companies');
    return { success: true };
  } catch (error) {
    console.error('Admin approval error:', error);
    return {
      success: false,
      error: 'Failed to approve company. Please try again.',
    };
  }
}

// Admin: Reject a company
export async function adminRejectCompany(companyId: string, reason: string): Promise<ActionResult> {
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

    const company = await rejectCompany(companyId, session.user.id, reason);

    // Send rejection email
    await sendEmail({
      to: company.user.email,
      subject: 'Update on your company account application - Talents Acting',
      html: getRejectedEmailHtml({
        firstName: company.companyName,
        reason,
        accountType: 'company',
      }),
      text: getRejectedEmailText({
        firstName: company.companyName,
        reason,
        accountType: 'company',
      }),
    });

    revalidatePath('/admin/companies');
    return { success: true };
  } catch (error) {
    console.error('Admin rejection error:', error);
    return {
      success: false,
      error: 'Failed to reject company. Please try again.',
    };
  }
}

// Update company profile
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
    const validated = companyProfileUpdateSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid input',
      };
    }

    await updateCompanyProfile(session.user.id, validated.data);

    revalidatePath('/dashboard/company/profile');
    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Failed to update profile. Please try again.',
    };
  }
}

// Get current user's company profile
export async function getCurrentCompanyProfile(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    const profile = await getCompanyByUserId(session.user.id);
    if (!profile) {
      return {
        success: false,
        error: 'Company profile not found',
      };
    }

    return {
      success: true,
      data: {
        profile: {
          id: profile.id,
          companyName: profile.companyName,
          industry: profile.industry,
          description: profile.description,
          website: profile.website,
          contactEmail: profile.contactEmail,
          contactPhone: profile.contactPhone,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          emailVerified: profile.emailVerified,
          validationStatus: profile.validationStatus,
          subscriptionStatus: profile.subscriptionStatus,
          subscriptionEndsAt: profile.subscriptionEndsAt,
          createdAt: profile.createdAt,
        },
        user: profile.user,
        members: profile.members,
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

// ============================================================================
// TEAM MEMBER ACTIONS
// ============================================================================

// Invite a team member
export async function inviteMember(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'MEMBER';
}): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    // Validate input
    const validated = inviteMemberSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid input',
      };
    }

    // Get company profile
    const company = await getCompanyByUserId(session.user.id);
    if (!company) {
      return {
        success: false,
        error: 'Company profile not found',
      };
    }

    // Create invitation
    const result = await inviteTeamMember(company.id, session.user.id, validated.data);

    if ('error' in result) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Send invitation email
    if (result.inviteToken) {
      await sendEmail({
        to: data.email,
        subject: `You're invited to join ${company.companyName} on Talents Acting`,
        html: getCompanyInviteEmailHtml({
          companyName: company.companyName,
          inviterEmail: session.user.email || '',
          inviteToken: result.inviteToken,
          firstName: data.firstName,
        }),
        text: getCompanyInviteEmailText({
          companyName: company.companyName,
          inviterEmail: session.user.email || '',
          inviteToken: result.inviteToken,
          firstName: data.firstName,
        }),
      });
    }

    revalidatePath('/dashboard/company/team');
    return {
      success: true,
      data: { memberId: result.id },
    };
  } catch (error) {
    console.error('Invite member error:', error);
    return {
      success: false,
      error: 'Failed to send invitation. Please try again.',
    };
  }
}

// Get invitation details by token
export async function getInviteDetails(token: string): Promise<ActionResult> {
  try {
    if (!token) {
      return {
        success: false,
        error: 'Invalid invitation token',
      };
    }

    const member = await getMemberByInviteToken(token);
    if (!member) {
      return {
        success: false,
        error: 'Invalid or expired invitation',
      };
    }

    if (member.status !== 'PENDING') {
      return {
        success: false,
        error: 'This invitation has already been used',
      };
    }

    return {
      success: true,
      data: {
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        companyName: member.company.companyName,
        invitedBy: member.company.user.email,
      },
    };
  } catch (error) {
    console.error('Get invite details error:', error);
    return {
      success: false,
      error: 'Failed to load invitation details. Please try again.',
    };
  }
}

// Accept invitation (new user - creates account)
export async function acceptInviteAsNewUser(data: {
  token: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}): Promise<ActionResult> {
  try {
    // Validate input
    const validated = acceptInviteSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || 'Invalid input',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Accept invitation
    const result = await acceptInviteNewUser(data.token, {
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    if (!result.success) {
      return {
        success: false,
        error: 'error' in result ? result.error : 'Failed to accept invitation',
      };
    }

    // At this point, result.success is true, so user and member exist
    const successResult = result as {
      success: true;
      user: { id: string };
      member: { company: { companyName: string } };
    };

    return {
      success: true,
      data: {
        userId: successResult.user.id,
        companyName: successResult.member.company.companyName,
      },
    };
  } catch (error) {
    console.error('Accept invite error:', error);
    return {
      success: false,
      error: 'Failed to accept invitation. Please try again.',
    };
  }
}

// Accept invitation (existing user - links to company)
export async function acceptInviteAsExistingUser(token: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to accept this invitation',
      };
    }

    const result = await acceptInviteExistingUser(token, session.user.id);

    if (!result.success) {
      return {
        success: false,
        error: 'error' in result ? result.error : 'Failed to accept invitation',
      };
    }

    // At this point, result.success is true, so member exists
    const successResult = result as { success: true; member: { company: { companyName: string } } };

    revalidatePath('/dashboard/company');
    return {
      success: true,
      data: {
        companyName: successResult.member.company.companyName,
      },
    };
  } catch (error) {
    console.error('Accept invite error:', error);
    return {
      success: false,
      error: 'Failed to accept invitation. Please try again.',
    };
  }
}

// Get team members for current company
export async function getCompanyTeamMembers(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    const company = await getCompanyByUserId(session.user.id);
    if (!company) {
      return {
        success: false,
        error: 'Company profile not found',
      };
    }

    const members = await getTeamMembers(company.id);

    return {
      success: true,
      data: { members },
    };
  } catch (error) {
    console.error('Get team members error:', error);
    return {
      success: false,
      error: 'Failed to load team members. Please try again.',
    };
  }
}

// Cancel a pending invitation
export async function cancelInvitation(memberId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    await deletePendingInvite(memberId);

    revalidatePath('/dashboard/company/team');
    return { success: true };
  } catch (error) {
    console.error('Cancel invitation error:', error);
    return {
      success: false,
      error: 'Failed to cancel invitation. Please try again.',
    };
  }
}

// Remove a team member
export async function removeMember(memberId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in',
      };
    }

    await deactivateMember(memberId);

    revalidatePath('/dashboard/company/team');
    return { success: true };
  } catch (error) {
    console.error('Remove member error:', error);
    return {
      success: false,
      error: 'Failed to remove team member. Please try again.',
    };
  }
}
