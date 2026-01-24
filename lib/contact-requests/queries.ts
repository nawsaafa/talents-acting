import { db } from '@/lib/db';
import { Prisma, SubscriptionStatus, ValidationStatus } from '@prisma/client';
import type {
  ContactRequestInfo,
  ContactRequestPaginationOptions,
  ContactRequestsResult,
  RequesterContactRequestsOptions,
  TalentContactRequestsOptions,
  ContactRequestCounts,
  RevealedContactInfo,
} from './types';
import { RATE_LIMIT_WINDOW_MS } from './access';

const DEFAULT_CONTACT_REQUEST_LIMIT = 20;

/**
 * Get requester display info based on their profile type
 */
async function getRequesterDisplayInfo(requesterId: string): Promise<{
  name: string;
  email: string | null;
  company: string | null;
  profession: string | null;
}> {
  const user = await db.user.findUnique({
    where: { id: requesterId },
    include: {
      professionalProfile: {
        select: {
          firstName: true,
          lastName: true,
          company: true,
          profession: true,
          contactEmail: true,
        },
      },
      companyProfile: {
        select: { companyName: true, contactEmail: true },
      },
    },
  });

  if (!user) {
    return { name: 'Unknown', email: null, company: null, profession: null };
  }

  if (user.professionalProfile) {
    return {
      name: `${user.professionalProfile.firstName} ${user.professionalProfile.lastName}`,
      email: user.professionalProfile.contactEmail,
      company: user.professionalProfile.company,
      profession: user.professionalProfile.profession,
    };
  }

  if (user.companyProfile) {
    return {
      name: user.companyProfile.companyName,
      email: user.companyProfile.contactEmail,
      company: user.companyProfile.companyName,
      profession: null,
    };
  }

  return { name: 'User', email: user.email, company: null, profession: null };
}

/**
 * Transform a raw contact request to ContactRequestInfo
 */
async function toContactRequestInfo(
  request: Prisma.ContactRequestGetPayload<{
    include: {
      talentProfile: {
        select: {
          firstName: true;
          lastName: true;
          photo: true;
          contactEmail: true;
          contactPhone: true;
          userId: true;
        };
      };
    };
  }>,
  includeContactInfo: boolean = false
): Promise<ContactRequestInfo> {
  const requesterInfo = await getRequesterDisplayInfo(request.requesterId);

  return {
    id: request.id,
    status: request.status,
    projectType: request.projectType,
    projectName: request.projectName,
    purpose: request.purpose,
    message: request.message,
    declineReason: request.declineReason,
    createdAt: request.createdAt,
    respondedAt: request.respondedAt,
    expiresAt: request.expiresAt,
    // Requester info
    requesterId: request.requesterId,
    requesterName: requesterInfo.name,
    requesterEmail: requesterInfo.email,
    requesterCompany: requesterInfo.company,
    requesterProfession: requesterInfo.profession,
    // Talent info
    talentProfileId: request.talentProfileId,
    talentName: `${request.talentProfile.firstName} ${request.talentProfile.lastName}`,
    talentPhoto: request.talentProfile.photo,
    // Contact info - only if approved and requester is viewing
    talentEmail:
      includeContactInfo && request.status === 'APPROVED'
        ? request.talentProfile.contactEmail
        : null,
    talentPhone:
      includeContactInfo && request.status === 'APPROVED'
        ? request.talentProfile.contactPhone
        : null,
  };
}

/**
 * Get a single contact request by ID
 */
export async function getContactRequestById(requestId: string): Promise<ContactRequestInfo | null> {
  const request = await db.contactRequest.findUnique({
    where: { id: requestId },
    include: {
      talentProfile: {
        select: {
          firstName: true,
          lastName: true,
          photo: true,
          contactEmail: true,
          contactPhone: true,
          userId: true,
        },
      },
    },
  });

  if (!request) {
    return null;
  }

  return toContactRequestInfo(request, false);
}

/**
 * Get a contact request with revealed contact info (for approved requests only)
 */
export async function getContactRequestWithRevealedInfo(
  requestId: string,
  requesterId: string
): Promise<ContactRequestInfo | null> {
  const request = await db.contactRequest.findUnique({
    where: { id: requestId },
    include: {
      talentProfile: {
        select: {
          firstName: true,
          lastName: true,
          photo: true,
          contactEmail: true,
          contactPhone: true,
          userId: true,
        },
      },
    },
  });

  if (!request) {
    return null;
  }

  // Only reveal contact info if the user is the requester and status is APPROVED
  const includeContactInfo = request.requesterId === requesterId && request.status === 'APPROVED';

  return toContactRequestInfo(request, includeContactInfo);
}

/**
 * Get contact requests sent by a requester (professional/company)
 */
export async function getRequesterContactRequests(
  options: RequesterContactRequestsOptions
): Promise<ContactRequestsResult> {
  const { requesterId, limit = DEFAULT_CONTACT_REQUEST_LIMIT, offset = 0, status } = options;

  const where: Prisma.ContactRequestWhereInput = {
    requesterId,
    ...(status && { status }),
  };

  const [requests, total] = await Promise.all([
    db.contactRequest.findMany({
      where,
      include: {
        talentProfile: {
          select: {
            firstName: true,
            lastName: true,
            photo: true,
            contactEmail: true,
            contactPhone: true,
            userId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit + 1, // Fetch one extra to check if there are more
    }),
    db.contactRequest.count({ where }),
  ]);

  const hasMore = requests.length > limit;
  const trimmedRequests = hasMore ? requests.slice(0, limit) : requests;

  // Include contact info only for approved requests
  const requestsWithInfo = await Promise.all(
    trimmedRequests.map((request) => toContactRequestInfo(request, request.status === 'APPROVED'))
  );

  return {
    requests: requestsWithInfo,
    total,
    hasMore,
  };
}

/**
 * Get contact requests received by a talent
 */
export async function getTalentContactRequests(
  options: TalentContactRequestsOptions
): Promise<ContactRequestsResult> {
  const { talentProfileId, limit = DEFAULT_CONTACT_REQUEST_LIMIT, offset = 0, status } = options;

  const where: Prisma.ContactRequestWhereInput = {
    talentProfileId,
    ...(status && { status }),
  };

  const [requests, total] = await Promise.all([
    db.contactRequest.findMany({
      where,
      include: {
        talentProfile: {
          select: {
            firstName: true,
            lastName: true,
            photo: true,
            contactEmail: true,
            contactPhone: true,
            userId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit + 1,
    }),
    db.contactRequest.count({ where }),
  ]);

  const hasMore = requests.length > limit;
  const trimmedRequests = hasMore ? requests.slice(0, limit) : requests;

  // Talent view - never include revealed contact info (they already have it)
  const requestsWithInfo = await Promise.all(
    trimmedRequests.map((request) => toContactRequestInfo(request, false))
  );

  return {
    requests: requestsWithInfo,
    total,
    hasMore,
  };
}

/**
 * Get all contact requests (for admin view)
 */
export async function getAllContactRequests(
  options: ContactRequestPaginationOptions = {}
): Promise<ContactRequestsResult> {
  const { limit = DEFAULT_CONTACT_REQUEST_LIMIT, offset = 0, status } = options;

  const where: Prisma.ContactRequestWhereInput = {
    ...(status && { status }),
  };

  const [requests, total] = await Promise.all([
    db.contactRequest.findMany({
      where,
      include: {
        talentProfile: {
          select: {
            firstName: true,
            lastName: true,
            photo: true,
            contactEmail: true,
            contactPhone: true,
            userId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit + 1,
    }),
    db.contactRequest.count({ where }),
  ]);

  const hasMore = requests.length > limit;
  const trimmedRequests = hasMore ? requests.slice(0, limit) : requests;

  const requestsWithInfo = await Promise.all(
    trimmedRequests.map((request) => toContactRequestInfo(request, false))
  );

  return {
    requests: requestsWithInfo,
    total,
    hasMore,
  };
}

/**
 * Get pending contact request count for a requester within rate limit window
 */
export async function getPendingRequestCountForRequester(
  requesterId: string
): Promise<{ count: number; oldestDate?: Date }> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  const requests = await db.contactRequest.findMany({
    where: {
      requesterId,
      status: 'PENDING',
      createdAt: { gte: windowStart },
    },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });

  return {
    count: requests.length,
    oldestDate: requests[0]?.createdAt,
  };
}

/**
 * Check if requester already has a pending request to a specific talent
 */
export async function hasExistingPendingRequest(
  requesterId: string,
  talentProfileId: string
): Promise<boolean> {
  const request = await db.contactRequest.findFirst({
    where: {
      requesterId,
      talentProfileId,
      status: 'PENDING',
    },
  });

  return !!request;
}

/**
 * Create a new contact request
 */
export async function createContactRequest(data: {
  requesterId: string;
  talentProfileId: string;
  projectType: Prisma.ContactRequestCreateInput['projectType'];
  projectName?: string;
  purpose: string;
  message?: string;
}): Promise<ContactRequestInfo> {
  const request = await db.contactRequest.create({
    data: {
      requesterId: data.requesterId,
      talentProfileId: data.talentProfileId,
      projectType: data.projectType,
      projectName: data.projectName,
      purpose: data.purpose,
      message: data.message,
      status: 'PENDING',
    },
    include: {
      talentProfile: {
        select: {
          firstName: true,
          lastName: true,
          photo: true,
          contactEmail: true,
          contactPhone: true,
          userId: true,
        },
      },
    },
  });

  return toContactRequestInfo(request, false);
}

/**
 * Update contact request status (approve or decline)
 */
export async function updateContactRequestStatus(
  requestId: string,
  status: 'APPROVED' | 'DECLINED',
  declineReason?: string
): Promise<ContactRequestInfo> {
  const request = await db.contactRequest.update({
    where: { id: requestId },
    data: {
      status,
      declineReason: status === 'DECLINED' ? declineReason : null,
      respondedAt: new Date(),
    },
    include: {
      talentProfile: {
        select: {
          firstName: true,
          lastName: true,
          photo: true,
          contactEmail: true,
          contactPhone: true,
          userId: true,
        },
      },
    },
  });

  return toContactRequestInfo(request, false);
}

/**
 * Get contact request counts for a user (dashboard summary)
 */
export async function getContactRequestCounts(
  userId: string,
  type: 'requester' | 'talent',
  talentProfileId?: string
): Promise<ContactRequestCounts> {
  const where: Prisma.ContactRequestWhereInput =
    type === 'requester' ? { requesterId: userId } : { talentProfileId: talentProfileId };

  const [pending, approved, declined, total] = await Promise.all([
    db.contactRequest.count({ where: { ...where, status: 'PENDING' } }),
    db.contactRequest.count({ where: { ...where, status: 'APPROVED' } }),
    db.contactRequest.count({ where: { ...where, status: 'DECLINED' } }),
    db.contactRequest.count({ where }),
  ]);

  return { pending, approved, declined, total };
}

/**
 * Get revealed contact info for an approved request
 */
export async function getRevealedContactInfo(
  requestId: string,
  requesterId: string
): Promise<RevealedContactInfo | null> {
  const request = await db.contactRequest.findUnique({
    where: { id: requestId },
    include: {
      talentProfile: {
        select: { contactEmail: true, contactPhone: true },
      },
    },
  });

  // Only return contact info if request exists, is approved, and requester matches
  if (!request || request.status !== 'APPROVED' || request.requesterId !== requesterId) {
    return null;
  }

  return {
    email: request.talentProfile.contactEmail,
    phone: request.talentProfile.contactPhone,
  };
}

/**
 * Get talent profile by ID (for contact request creation)
 */
export async function getTalentProfileById(talentProfileId: string) {
  return db.talentProfile.findUnique({
    where: { id: talentProfileId },
    select: {
      id: true,
      userId: true,
      firstName: true,
      lastName: true,
      contactEmail: true,
      contactPhone: true,
      validationStatus: true,
      isPublic: true,
    },
  });
}

/**
 * Get user profile info for access control checks
 */
export async function getUserProfileInfo(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      professionalProfile: {
        select: { subscriptionStatus: true, validationStatus: true },
      },
      companyProfile: {
        select: { subscriptionStatus: true, validationStatus: true },
      },
      talentProfile: {
        select: { id: true, subscriptionStatus: true, validationStatus: true },
      },
    },
  });

  if (!user) {
    return null;
  }

  // Get subscription and validation status based on role
  let subscriptionStatus: SubscriptionStatus = 'NONE';
  let validationStatus: ValidationStatus = 'PENDING';
  let talentProfileId: string | null = null;

  if (user.professionalProfile) {
    subscriptionStatus = user.professionalProfile.subscriptionStatus;
    validationStatus = user.professionalProfile.validationStatus;
  } else if (user.companyProfile) {
    subscriptionStatus = user.companyProfile.subscriptionStatus;
    validationStatus = user.companyProfile.validationStatus;
  } else if (user.talentProfile) {
    talentProfileId = user.talentProfile.id;
    validationStatus = user.talentProfile.validationStatus;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    subscriptionStatus,
    validationStatus,
    talentProfileId,
  };
}

/**
 * Get user email for notifications
 */
export async function getUserEmail(userId: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  return user?.email || null;
}
