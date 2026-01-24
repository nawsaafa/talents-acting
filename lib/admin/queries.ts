import { prisma } from '@/lib/prisma';
import { ValidationStatus, Role, Prisma } from '@prisma/client';
import type { UserFilterInput, ValidationFilterInput } from './validation';

// Dashboard statistics
export async function getDashboardStats() {
  const [
    pendingTalents,
    pendingProfessionals,
    pendingCompanies,
    activeTalents,
    totalUsers,
    pendingContactRequests,
    totalContactRequests,
  ] = await Promise.all([
    prisma.talentProfile.count({
      where: { validationStatus: ValidationStatus.PENDING },
    }),
    prisma.professionalProfile.count({
      where: { validationStatus: ValidationStatus.PENDING },
    }),
    prisma.companyProfile.count({
      where: { validationStatus: ValidationStatus.PENDING },
    }),
    prisma.talentProfile.count({
      where: {
        validationStatus: ValidationStatus.APPROVED,
        isPublic: true,
      },
    }),
    prisma.user.count(),
    prisma.contactRequest.count({
      where: { status: 'PENDING' },
    }),
    prisma.contactRequest.count(),
  ]);

  return {
    pendingTalents,
    pendingProfessionals,
    pendingCompanies,
    activeTalents,
    totalUsers,
    pendingContactRequests,
    totalContactRequests,
    totalPending: pendingTalents + pendingProfessionals + pendingCompanies,
  };
}

// Talent validation queue
const talentQueueSelect = {
  id: true,
  firstName: true,
  lastName: true,
  photo: true,
  gender: true,
  location: true,
  validationStatus: true,
  createdAt: true,
  user: {
    select: {
      email: true,
    },
  },
} as const;

export type TalentQueueItem = Prisma.TalentProfileGetPayload<{
  select: typeof talentQueueSelect;
}>;

export async function getTalentValidationQueue(filters: ValidationFilterInput) {
  const { status, page, limit } = filters;

  const where: Prisma.TalentProfileWhereInput = {
    validationStatus: status as ValidationStatus,
  };

  const [talents, total] = await Promise.all([
    prisma.talentProfile.findMany({
      where,
      select: talentQueueSelect,
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.talentProfile.count({ where }),
  ]);

  return {
    items: talents,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get full talent details for admin review
const talentFullSelect = {
  id: true,
  userId: true,
  firstName: true,
  lastName: true,
  photo: true,
  gender: true,
  dateOfBirth: true,
  ageRangeMin: true,
  ageRangeMax: true,
  height: true,
  physique: true,
  ethnicAppearance: true,
  hairColor: true,
  eyeColor: true,
  hairLength: true,
  beardType: true,
  hasTattoos: true,
  hasScars: true,
  tattooDescription: true,
  scarDescription: true,
  languages: true,
  accents: true,
  athleticSkills: true,
  musicalInstruments: true,
  performanceSkills: true,
  danceStyles: true,
  hasShowreel: true,
  showreel: true,
  presentationVideo: true,
  isAvailable: true,
  dailyRate: true,
  rateNegotiable: true,
  location: true,
  bio: true,
  contactEmail: true,
  contactPhone: true,
  portfolio: true,
  socialMedia: true,
  validationStatus: true,
  validatedAt: true,
  validatedBy: true,
  rejectionReason: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  },
} as const;

export type TalentFullDetails = Prisma.TalentProfileGetPayload<{
  select: typeof talentFullSelect;
}>;

export async function getTalentForReview(id: string) {
  return prisma.talentProfile.findUnique({
    where: { id },
    select: talentFullSelect,
  });
}

// Professional validation queue
const professionalQueueSelect = {
  id: true,
  firstName: true,
  lastName: true,
  profession: true,
  company: true,
  validationStatus: true,
  createdAt: true,
  user: {
    select: {
      email: true,
    },
  },
} as const;

export type ProfessionalQueueItem = Prisma.ProfessionalProfileGetPayload<{
  select: typeof professionalQueueSelect;
}>;

export async function getProfessionalValidationQueue(filters: ValidationFilterInput) {
  const { status, page, limit } = filters;

  const where: Prisma.ProfessionalProfileWhereInput = {
    validationStatus: status as ValidationStatus,
  };

  const [professionals, total] = await Promise.all([
    prisma.professionalProfile.findMany({
      where,
      select: professionalQueueSelect,
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.professionalProfile.count({ where }),
  ]);

  return {
    items: professionals,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get full professional details for admin review
const professionalFullSelect = {
  id: true,
  userId: true,
  firstName: true,
  lastName: true,
  profession: true,
  company: true,
  phone: true,
  website: true,
  reasonForAccess: true,
  emailVerified: true,
  subscriptionStatus: true,
  subscriptionEndsAt: true,
  termsAcceptedAt: true,
  validationStatus: true,
  validatedAt: true,
  validatedBy: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  },
} as const;

export type ProfessionalFullDetails = Prisma.ProfessionalProfileGetPayload<{
  select: typeof professionalFullSelect;
}>;

export async function getProfessionalForReview(id: string) {
  return prisma.professionalProfile.findUnique({
    where: { id },
    select: professionalFullSelect,
  });
}

// Company validation queue
const companyQueueSelect = {
  id: true,
  companyName: true,
  industry: true,
  city: true,
  country: true,
  validationStatus: true,
  createdAt: true,
  user: {
    select: {
      email: true,
    },
  },
} as const;

export type CompanyQueueItem = Prisma.CompanyProfileGetPayload<{
  select: typeof companyQueueSelect;
}>;

export async function getCompanyValidationQueue(filters: ValidationFilterInput) {
  const { status, page, limit } = filters;

  const where: Prisma.CompanyProfileWhereInput = {
    validationStatus: status as ValidationStatus,
  };

  const [companies, total] = await Promise.all([
    prisma.companyProfile.findMany({
      where,
      select: companyQueueSelect,
      orderBy: { createdAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.companyProfile.count({ where }),
  ]);

  return {
    items: companies,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get full company details for admin review
const companyFullSelect = {
  id: true,
  userId: true,
  companyName: true,
  industry: true,
  description: true,
  website: true,
  contactEmail: true,
  contactPhone: true,
  address: true,
  city: true,
  country: true,
  emailVerified: true,
  subscriptionStatus: true,
  subscriptionEndsAt: true,
  termsAcceptedAt: true,
  validationStatus: true,
  validatedAt: true,
  validatedBy: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  },
  members: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      acceptedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' as const },
  },
} as const;

export type CompanyFullDetails = Prisma.CompanyProfileGetPayload<{
  select: typeof companyFullSelect;
}>;

export async function getCompanyForReview(id: string) {
  return prisma.companyProfile.findUnique({
    where: { id },
    select: companyFullSelect,
  });
}

// User management
const userListSelect = {
  id: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  talentProfile: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      validationStatus: true,
    },
  },
  professionalProfile: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      validationStatus: true,
    },
  },
  companyProfile: {
    select: {
      id: true,
      companyName: true,
      validationStatus: true,
    },
  },
} as const;

export type UserListItem = Prisma.UserGetPayload<{
  select: typeof userListSelect;
}>;

export async function getUsers(filters: UserFilterInput) {
  const { role, status, search, page, limit } = filters;

  const where: Prisma.UserWhereInput = {
    ...(role !== 'ALL' && { role: role as Role }),
    ...(status === 'ACTIVE' && { isActive: true }),
    ...(status === 'INACTIVE' && { isActive: false }),
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        {
          talentProfile: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
            ],
          },
        },
        {
          professionalProfile: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' as const } },
              { lastName: { contains: search, mode: 'insensitive' as const } },
            ],
          },
        },
        {
          companyProfile: {
            companyName: { contains: search, mode: 'insensitive' as const },
          },
        },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userListSelect,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Get user by ID for details
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userListSelect,
  });
}
