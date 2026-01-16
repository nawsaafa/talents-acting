import { prisma } from '@/lib/prisma';
import { ValidationStatus } from '@prisma/client';
import crypto from 'crypto';

// Generate a secure verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Get verification token expiry (24 hours from now)
export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}

// Create a new professional with user account
export async function createProfessionalWithUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profession: string;
  company?: string;
  phone?: string;
  reasonForAccess: string;
}) {
  const verificationToken = generateVerificationToken();
  const verificationExpires = getTokenExpiry();

  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      password: data.password,
      role: 'PROFESSIONAL',
      professionalProfile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          profession: data.profession,
          company: data.company || null,
          phone: data.phone || null,
          accessReason: data.reasonForAccess,
          verificationToken,
          verificationExpires,
          termsAcceptedAt: new Date(),
        },
      },
    },
    include: {
      professionalProfile: true,
    },
  });
}

// Find professional by user ID
export async function getProfessionalByUserId(userId: string) {
  return prisma.professionalProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });
}

// Find professional by profile ID
export async function getProfessionalById(id: string) {
  return prisma.professionalProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });
}

// Find professional by email
export async function getProfessionalByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      professionalProfile: true,
    },
  });
}

// Find professional by verification token
export async function getProfessionalByToken(token: string) {
  return prisma.professionalProfile.findUnique({
    where: { verificationToken: token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
}

// Verify email with token
export async function verifyProfessionalEmail(token: string) {
  const profile = await getProfessionalByToken(token);

  if (!profile) {
    return { success: false, error: 'Invalid verification token' };
  }

  if (profile.emailVerified) {
    return { success: true, alreadyVerified: true };
  }

  if (profile.verificationExpires && profile.verificationExpires < new Date()) {
    return { success: false, error: 'Verification token has expired' };
  }

  await prisma.professionalProfile.update({
    where: { id: profile.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  return { success: true };
}

// Regenerate verification token
export async function regenerateVerificationToken(userId: string) {
  const verificationToken = generateVerificationToken();
  const verificationExpires = getTokenExpiry();

  return prisma.professionalProfile.update({
    where: { userId },
    data: {
      verificationToken,
      verificationExpires,
      emailVerified: false,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
}

// Get all professionals with optional filters
export async function getProfessionals(options?: {
  status?: ValidationStatus;
  limit?: number;
  offset?: number;
}) {
  const where = options?.status ? { validationStatus: options.status } : {};

  return prisma.professionalProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit || 50,
    skip: options?.offset || 0,
  });
}

// Get pending professionals count
export async function getPendingProfessionalsCount() {
  return prisma.professionalProfile.count({
    where: { validationStatus: 'PENDING' },
  });
}

// Approve professional
export async function approveProfessional(professionalId: string, adminUserId: string) {
  return prisma.professionalProfile.update({
    where: { id: professionalId },
    data: {
      validationStatus: 'APPROVED',
      validatedAt: new Date(),
      validatedBy: adminUserId,
      rejectionReason: null,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
}

// Reject professional
export async function rejectProfessional(
  professionalId: string,
  adminUserId: string,
  reason: string
) {
  return prisma.professionalProfile.update({
    where: { id: professionalId },
    data: {
      validationStatus: 'REJECTED',
      validatedAt: new Date(),
      validatedBy: adminUserId,
      rejectionReason: reason,
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });
}

// Update professional profile
export async function updateProfessionalProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    profession?: string;
    company?: string;
    phone?: string;
    website?: string;
  }
) {
  return prisma.professionalProfile.update({
    where: { userId },
    data,
  });
}

// Check if email exists
export async function emailExists(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return !!user;
}

// Get professionals statistics for admin dashboard
export async function getProfessionalStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.professionalProfile.count(),
    prisma.professionalProfile.count({ where: { validationStatus: 'PENDING' } }),
    prisma.professionalProfile.count({ where: { validationStatus: 'APPROVED' } }),
    prisma.professionalProfile.count({ where: { validationStatus: 'REJECTED' } }),
  ]);

  return { total, pending, approved, rejected };
}
