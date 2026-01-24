import { ContactRequestStatus, ProjectType } from '@prisma/client';

// Contact request with requester and talent info for display
export interface ContactRequestInfo {
  id: string;
  status: ContactRequestStatus;
  projectType: ProjectType;
  projectName: string | null;
  purpose: string;
  message: string | null;
  declineReason: string | null;
  createdAt: Date;
  respondedAt: Date | null;
  expiresAt: Date | null;
  // Requester info
  requesterId: string;
  requesterName: string;
  requesterEmail: string | null;
  requesterCompany: string | null;
  requesterProfession: string | null;
  // Talent info
  talentProfileId: string;
  talentName: string;
  talentPhoto: string | null;
  // Revealed contact info (only if approved)
  talentEmail: string | null;
  talentPhone: string | null;
}

// Input for creating a contact request
export interface CreateContactRequestInput {
  talentProfileId: string;
  projectType: ProjectType;
  projectName?: string;
  purpose: string;
  message?: string;
}

// Result of creating a contact request
export interface CreateContactRequestResult {
  success: boolean;
  request?: ContactRequestInfo;
  error?: string;
}

// Input for responding to a contact request
export interface RespondToContactRequestInput {
  requestId: string;
  approve: boolean;
  declineReason?: string;
}

// Result of responding to a contact request
export interface RespondToContactRequestResult {
  success: boolean;
  request?: ContactRequestInfo;
  error?: string;
}

// Result of fetching contact requests
export interface ContactRequestsResult {
  requests: ContactRequestInfo[];
  total: number;
  hasMore: boolean;
}

// Pagination and filter options for contact requests
export interface ContactRequestPaginationOptions {
  limit?: number;
  offset?: number;
  status?: ContactRequestStatus;
}

// Filter options for requester (sent requests)
export interface RequesterContactRequestsOptions extends ContactRequestPaginationOptions {
  requesterId: string;
}

// Filter options for talent (received requests)
export interface TalentContactRequestsOptions extends ContactRequestPaginationOptions {
  talentProfileId: string;
}

// Context for contact request access checks
export interface ContactRequestContext {
  userId: string;
  userRole: string;
  requestId?: string;
  talentProfileId?: string;
}

// Result of checking contact request access
export interface ContactRequestAccessResult {
  canCreate: boolean;
  canView: boolean;
  canRespond: boolean;
  reason?: string;
}

// Rate limiting check result
export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  resetAt?: Date;
  reason?: string;
}

// Contact info that can be revealed after approval
export interface RevealedContactInfo {
  email: string | null;
  phone: string | null;
  agentName?: string | null;
  agentEmail?: string | null;
  agentPhone?: string | null;
}

// Summary counts for dashboard display
export interface ContactRequestCounts {
  pending: number;
  approved: number;
  declined: number;
  total: number;
}
