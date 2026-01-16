import { prisma } from '@/lib/prisma';
import { ValidationStatus, CompanyMemberStatus, CompanyMemberRole } from '@prisma/client';
import crypto from 'crypto';

// Generate a secure verification token
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate a secure invitation token
export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Get verification token expiry (24 hours from now)
export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}

// Create a new company with user account
export async function createCompanyWithUser(data: {
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
}) {
  const verificationToken = generateVerificationToken();
  const verificationExpires = getTokenExpiry();

  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      password: data.password,
      role: 'COMPANY',
      companyProfile: {
        create: {
          companyName: data.companyName,
          industry: data.industry,
          description: data.description || null,
          website: data.website || null,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone || null,
          address: data.address || null,
          city: data.city || null,
          country: data.country || null,
          verificationToken,
          verificationExpires,
          termsAcceptedAt: new Date(),
        },
      },
    },
    include: {
      companyProfile: true,
    },
  });
}

// Find company by user ID
export async function getCompanyByUserId(userId: string) {
  return prisma.companyProfile.findUnique({
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
      members: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

// Find company by profile ID
export async function getCompanyById(id: string) {
  return prisma.companyProfile.findUnique({
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
      members: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

// Find company by email
export async function getCompanyByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      companyProfile: {
        include: {
          members: true,
        },
      },
    },
  });
}

// Find company by verification token
export async function getCompanyByToken(token: string) {
  return prisma.companyProfile.findUnique({
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
export async function verifyCompanyEmail(token: string) {
  const profile = await getCompanyByToken(token);

  if (!profile) {
    return { success: false, error: 'Invalid verification token' };
  }

  if (profile.emailVerified) {
    return { success: true, alreadyVerified: true };
  }

  if (profile.verificationExpires && profile.verificationExpires < new Date()) {
    return { success: false, error: 'Verification token has expired' };
  }

  await prisma.companyProfile.update({
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

  return prisma.companyProfile.update({
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

// Get all companies with optional filters
export async function getCompanies(options?: {
  status?: ValidationStatus;
  limit?: number;
  offset?: number;
}) {
  const where = options?.status ? { validationStatus: options.status } : {};

  return prisma.companyProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      },
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit || 50,
    skip: options?.offset || 0,
  });
}

// Get pending companies count
export async function getPendingCompaniesCount() {
  return prisma.companyProfile.count({
    where: { validationStatus: 'PENDING' },
  });
}

// Approve company
export async function approveCompany(companyId: string, adminUserId: string) {
  return prisma.companyProfile.update({
    where: { id: companyId },
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

// Reject company
export async function rejectCompany(companyId: string, adminUserId: string, reason: string) {
  return prisma.companyProfile.update({
    where: { id: companyId },
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

// Update company profile
export async function updateCompanyProfile(
  userId: string,
  data: {
    companyName?: string;
    industry?: string;
    description?: string;
    website?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    city?: string;
    country?: string;
  }
) {
  return prisma.companyProfile.update({
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

// Get company statistics for admin dashboard
export async function getCompanyStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.companyProfile.count(),
    prisma.companyProfile.count({ where: { validationStatus: 'PENDING' } }),
    prisma.companyProfile.count({ where: { validationStatus: 'APPROVED' } }),
    prisma.companyProfile.count({ where: { validationStatus: 'REJECTED' } }),
  ]);

  return { total, pending, approved, rejected };
}

// ============================================================================
// TEAM MEMBER QUERIES
// ============================================================================

// Invite a team member
export async function inviteTeamMember(
  companyId: string,
  invitedBy: string,
  data: {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: CompanyMemberRole;
  }
) {
  const inviteToken = generateInviteToken();

  // Check if member already exists for this company
  const existingMember = await prisma.companyMember.findUnique({
    where: {
      companyId_email: {
        companyId,
        email: data.email.toLowerCase(),
      },
    },
  });

  if (existingMember) {
    // If pending, regenerate token and resend
    if (existingMember.status === 'PENDING') {
      return prisma.companyMember.update({
        where: { id: existingMember.id },
        data: {
          inviteToken,
          invitedAt: new Date(),
          invitedBy,
          firstName: data.firstName || existingMember.firstName,
          lastName: data.lastName || existingMember.lastName,
        },
      });
    }
    // If active or inactive, return error
    return { error: 'This email is already a team member' };
  }

  return prisma.companyMember.create({
    data: {
      companyId,
      email: data.email.toLowerCase(),
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      role: data.role || 'MEMBER',
      inviteToken,
      invitedBy,
    },
  });
}

// Get team member by invite token
export async function getMemberByInviteToken(token: string) {
  return prisma.companyMember.findUnique({
    where: { inviteToken: token },
    include: {
      company: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });
}

// Accept invitation for new user (creates user account)
export async function acceptInviteNewUser(
  token: string,
  data: {
    password: string;
    firstName: string;
    lastName: string;
  }
) {
  const member = await getMemberByInviteToken(token);

  if (!member) {
    return { success: false, error: 'Invalid invitation token' };
  }

  if (member.status !== 'PENDING') {
    return { success: false, error: 'This invitation has already been used' };
  }

  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: member.email },
  });

  if (existingUser) {
    return { success: false, error: 'An account with this email already exists. Please sign in.' };
  }

  // Create user and update member in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user account
    const user = await tx.user.create({
      data: {
        email: member.email,
        password: data.password,
        role: 'COMPANY',
      },
    });

    // Update member record
    const updatedMember = await tx.companyMember.update({
      where: { id: member.id },
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        status: 'ACTIVE',
        acceptedAt: new Date(),
        inviteToken: null,
      },
      include: {
        company: true,
      },
    });

    return { user, member: updatedMember };
  });

  return { success: true, ...result };
}

// Accept invitation for existing user (links to company)
export async function acceptInviteExistingUser(token: string, userId: string) {
  const member = await getMemberByInviteToken(token);

  if (!member) {
    return { success: false, error: 'Invalid invitation token' };
  }

  if (member.status !== 'PENDING') {
    return { success: false, error: 'This invitation has already been used' };
  }

  // Verify the user email matches the invitation
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email.toLowerCase() !== member.email.toLowerCase()) {
    return { success: false, error: 'This invitation was sent to a different email address' };
  }

  // Update member record
  const updatedMember = await prisma.companyMember.update({
    where: { id: member.id },
    data: {
      userId,
      status: 'ACTIVE',
      acceptedAt: new Date(),
      inviteToken: null,
    },
    include: {
      company: true,
    },
  });

  return { success: true, member: updatedMember };
}

// Get team members for a company
export async function getTeamMembers(companyId: string, status?: CompanyMemberStatus) {
  const where = status ? { companyId, status } : { companyId };

  return prisma.companyMember.findMany({
    where,
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
  });
}

// Get active team member count
export async function getActiveTeamMemberCount(companyId: string) {
  return prisma.companyMember.count({
    where: { companyId, status: 'ACTIVE' },
  });
}

// Check if user is a member of a company
export async function isCompanyMember(userId: string, companyId: string) {
  const member = await prisma.companyMember.findFirst({
    where: {
      companyId,
      userId,
      status: 'ACTIVE',
    },
  });
  return !!member;
}

// Get company membership for a user
export async function getUserCompanyMembership(userId: string) {
  return prisma.companyMember.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
    },
    include: {
      company: true,
    },
  });
}

// Update team member role
export async function updateMemberRole(memberId: string, role: CompanyMemberRole) {
  return prisma.companyMember.update({
    where: { id: memberId },
    data: { role },
  });
}

// Deactivate team member
export async function deactivateMember(memberId: string) {
  return prisma.companyMember.update({
    where: { id: memberId },
    data: { status: 'INACTIVE' },
  });
}

// Delete pending invitation
export async function deletePendingInvite(memberId: string) {
  return prisma.companyMember.delete({
    where: { id: memberId, status: 'PENDING' },
  });
}
