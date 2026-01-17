import { Role, SubscriptionStatus } from '@prisma/client';

// Access level for talent data
export type AccessLevel = 'public' | 'premium' | 'full';

// Result of an access check
export interface AccessCheckResult {
  granted: boolean;
  level: AccessLevel;
  reason?: string;
}

// User context for access checks
export interface AccessContext {
  userId: string;
  role: Role;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndsAt?: Date | null;
}

// Resource types for access logging
export type ResourceType = 'talent_profile' | 'contact_info' | 'premium_data';

// Actions for access logging
export type AccessAction = 'view' | 'download' | 'export';

// Access log entry input
export interface AccessLogEntry {
  userId: string;
  resourceType: ResourceType;
  resourceId: string;
  action: AccessAction;
  granted: boolean;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Subscription statuses that grant premium access
export const PREMIUM_ACCESS_STATUSES: SubscriptionStatus[] = ['ACTIVE', 'TRIAL', 'PAST_DUE'];

// Roles that always have full access (bypass subscription check)
export const ADMIN_ROLES: Role[] = ['ADMIN'];

// Roles that can potentially access premium data (with subscription)
export const SUBSCRIBER_ROLES: Role[] = ['PROFESSIONAL', 'COMPANY'];
