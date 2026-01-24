import type { NotificationType, ContactRequestStatus, ProjectType } from '@prisma/client';

// =============================================================================
// ACTIVITY TYPES
// =============================================================================

// Unified activity item type for activity feed
export type ActivityType = 'MESSAGE' | 'CONTACT_REQUEST' | 'COLLECTION' | 'NOTIFICATION';

// Base activity item interface for unified feed display
export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  actionLink: string | null;
  // Actor info (who caused this activity)
  actorId: string | null;
  actorName: string | null;
  actorPhoto: string | null;
  // Read/seen status
  isRead: boolean;
  // Extra metadata based on type
  metadata?: ActivityMetadata;
}

// Type-specific metadata
export interface ActivityMetadata {
  // Message-specific
  conversationId?: string;
  // Contact request-specific
  requestStatus?: ContactRequestStatus;
  projectType?: ProjectType;
  // Collection-specific
  collectionId?: string;
  talentCount?: number;
  // Notification-specific
  notificationType?: NotificationType;
}

// =============================================================================
// DASHBOARD STATISTICS
// =============================================================================

// Unified dashboard stats for all user types
export interface DashboardStats {
  // Message counts
  unreadMessages: number;
  totalConversations: number;
  // Contact request counts
  pendingContactRequests: number;
  sentContactRequests?: number; // For professionals/companies
  receivedContactRequests?: number; // For talents
  // Collection counts (professionals/companies only)
  totalCollections?: number;
  totalTalentsInCollections?: number;
  // Notification counts
  unreadNotifications: number;
  // Profile view stats (talents only)
  profileViews?: ProfileViewStats;
  // Response rate (talents only)
  responseRate?: ResponseRateStats;
}

// Profile view statistics for talents
export interface ProfileViewStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

// Response rate for contact requests (talents)
export interface ResponseRateStats {
  totalReceived: number;
  approved: number;
  declined: number;
  pending: number;
  responseRate: number; // Percentage of responded (approved + declined)
}

// =============================================================================
// ACTIVITY FEED OPTIONS
// =============================================================================

// Options for fetching recent activity
export interface ActivityFeedOptions {
  limit?: number;
  offset?: number;
  types?: ActivityType[];
  unreadOnly?: boolean;
}

// Result of fetching activity feed
export interface ActivityFeedResult {
  items: ActivityItem[];
  total: number;
  hasMore: boolean;
}

// =============================================================================
// PROFILE VIEW TRACKING
// =============================================================================

// Result of tracking a profile view
export interface TrackProfileViewResult {
  success: boolean;
  error?: string;
}

// Result of getting profile view stats
export interface GetProfileViewsResult {
  success: boolean;
  stats?: ProfileViewStats;
  error?: string;
}

// =============================================================================
// ROLE-SPECIFIC DASHBOARD DATA
// =============================================================================

// Talent dashboard data
export interface TalentDashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  pendingRequests: PendingRequestSummary[];
}

// Professional dashboard data
export interface ProfessionalDashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  recentCollections: CollectionSummary[];
}

// Company dashboard data
export interface CompanyDashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  recentCollections: CollectionSummary[];
  teamActivitySummary?: TeamActivitySummary;
}

// Summary of pending contact requests
export interface PendingRequestSummary {
  id: string;
  requesterName: string;
  requesterCompany: string | null;
  projectType: ProjectType;
  createdAt: Date;
}

// Summary of collections for dashboard
export interface CollectionSummary {
  id: string;
  name: string;
  talentCount: number;
  updatedAt: Date;
}

// Team activity summary for company dashboard
export interface TeamActivitySummary {
  totalMembers: number;
  activeMembers: number;
  messagesSentThisWeek: number;
  collectionsCreatedThisWeek: number;
}

// =============================================================================
// SERVER ACTION RESULTS
// =============================================================================

// Generic result type for dashboard data fetching
export interface DashboardDataResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
