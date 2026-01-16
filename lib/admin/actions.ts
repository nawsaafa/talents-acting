'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/utils';
import { ValidationStatus } from '@prisma/client';
import {
  approveProfileSchema,
  rejectProfileSchema,
  toggleUserStatusSchema,
  type ApproveProfileInput,
  type RejectProfileInput,
  type ToggleUserStatusInput,
} from './validation';

type ActionResult = {
  success: boolean;
  error?: string;
};

// Approve a profile (talent, professional, or company)
export async function approveProfile(input: ApproveProfileInput): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = approveProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { profileId, profileType } = parsed.data;

  try {
    const updateData = {
      validationStatus: ValidationStatus.APPROVED,
      validatedAt: new Date(),
      validatedBy: admin.id,
      rejectionReason: null,
    };

    switch (profileType) {
      case 'talent':
        await prisma.talentProfile.update({
          where: { id: profileId },
          data: {
            ...updateData,
            isPublic: true,
          },
        });
        break;
      case 'professional':
        await prisma.professionalProfile.update({
          where: { id: profileId },
          data: updateData,
        });
        break;
      case 'company':
        await prisma.companyProfile.update({
          where: { id: profileId },
          data: {
            ...updateData,
            isVerifiedCompany: true,
          },
        });
        break;
    }

    revalidatePath('/admin');
    revalidatePath('/admin/talents');
    revalidatePath('/admin/professionals');
    revalidatePath('/admin/companies');
    revalidatePath('/talents');

    return { success: true };
  } catch (error) {
    console.error('Failed to approve profile:', error);
    return { success: false, error: 'Failed to approve profile. Please try again.' };
  }
}

// Reject a profile with reason
export async function rejectProfile(input: RejectProfileInput): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = rejectProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { profileId, profileType, reason } = parsed.data;

  try {
    const updateData = {
      validationStatus: ValidationStatus.REJECTED,
      validatedAt: new Date(),
      validatedBy: admin.id,
      rejectionReason: reason,
    };

    switch (profileType) {
      case 'talent':
        await prisma.talentProfile.update({
          where: { id: profileId },
          data: {
            ...updateData,
            isPublic: false,
          },
        });
        break;
      case 'professional':
        await prisma.professionalProfile.update({
          where: { id: profileId },
          data: updateData,
        });
        break;
      case 'company':
        await prisma.companyProfile.update({
          where: { id: profileId },
          data: {
            ...updateData,
            isVerifiedCompany: false,
          },
        });
        break;
    }

    revalidatePath('/admin');
    revalidatePath('/admin/talents');
    revalidatePath('/admin/professionals');
    revalidatePath('/admin/companies');

    return { success: true };
  } catch (error) {
    console.error('Failed to reject profile:', error);
    return { success: false, error: 'Failed to reject profile. Please try again.' };
  }
}

// Toggle user active status
export async function toggleUserStatus(input: ToggleUserStatusInput): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = toggleUserStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { userId, isActive } = parsed.data;

  // Prevent admin from deactivating themselves
  if (userId === admin.id && !isActive) {
    return { success: false, error: 'You cannot deactivate your own account' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    revalidatePath('/admin/users');

    return { success: true };
  } catch (error) {
    console.error('Failed to toggle user status:', error);
    return { success: false, error: 'Failed to update user status. Please try again.' };
  }
}

// Suspend a profile (different from reject - can be reactivated)
export async function suspendProfile(
  profileId: string,
  profileType: 'talent' | 'professional' | 'company'
): Promise<ActionResult> {
  await requireAdmin();

  try {
    const updateData = {
      validationStatus: ValidationStatus.SUSPENDED,
    };

    switch (profileType) {
      case 'talent':
        await prisma.talentProfile.update({
          where: { id: profileId },
          data: {
            ...updateData,
            isPublic: false,
          },
        });
        break;
      case 'professional':
        await prisma.professionalProfile.update({
          where: { id: profileId },
          data: updateData,
        });
        break;
      case 'company':
        await prisma.companyProfile.update({
          where: { id: profileId },
          data: updateData,
        });
        break;
    }

    revalidatePath('/admin');
    revalidatePath('/admin/talents');
    revalidatePath('/admin/professionals');
    revalidatePath('/admin/companies');
    revalidatePath('/talents');

    return { success: true };
  } catch (error) {
    console.error('Failed to suspend profile:', error);
    return { success: false, error: 'Failed to suspend profile. Please try again.' };
  }
}
