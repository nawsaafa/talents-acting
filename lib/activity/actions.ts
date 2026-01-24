'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/utils';
import { log } from '@/lib/logger';
import {
  getTalentDashboardStats,
  getProfessionalDashboardStats,
  getCompanyDashboardStats,
  getRecentActivity,
  getRecentCollections,
  getPendingRequestsSummary,
  getTeamActivitySummary,
  getProfileViewStats,
} from './queries';
import type {
  TrackProfileViewResult,
  GetProfileViewsResult,
  DashboardDataResult,
  TalentDashboardData,
  ProfessionalDashboardData,
  CompanyDashboardData,
  ActivityFeedOptions,
  ActivityFeedResult,
} from './types';

// =============================================================================
// PROFILE VIEW TRACKING
// =============================================================================

/**
 * Track a profile view for a talent (aggregate count only).
 * Called when someone views a talent profile.
 */
export async function trackProfileView(talentProfileId: string): Promise<TrackProfileViewResult> {
  try {
    const user = await getCurrentUser();
    // Anonymous views are tracked, but we don't store viewer IDs for privacy
    // Just check that we have a valid talent profile

    const talent = await db.talentProfile.findUnique({
      where: { id: talentProfileId },
      select: { id: true, userId: true },
    });

    if (!talent) {
      return { success: false, error: 'Talent profile not found' };
    }

    // Don't track self-views
    if (user?.id === talent.userId) {
      return { success: true }; // Silently succeed but don't count
    }

    // Get today's date (without time) for daily aggregation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert the daily view count
    await db.profileView.upsert({
      where: {
        talentProfileId_date: {
          talentProfileId,
          date: today,
        },
      },
      update: {
        viewCount: { increment: 1 },
      },
      create: {
        talentProfileId,
        date: today,
        viewCount: 1,
      },
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to track profile view',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Get profile view statistics for the current user's talent profile.
 */
export async function getMyProfileViews(): Promise<GetProfileViewsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const talent = await db.talentProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!talent) {
      return { success: false, error: 'Talent profile not found' };
    }

    const stats = await getProfileViewStats(talent.id);
    return { success: true, stats };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to get profile views',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}

// =============================================================================
// DASHBOARD DATA ACTIONS
// =============================================================================

/**
 * Get talent dashboard data including stats and recent activity.
 */
export async function getTalentDashboardData(): Promise<DashboardDataResult<TalentDashboardData>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const talent = await db.talentProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!talent) {
      return { success: false, error: 'Talent profile not found' };
    }

    const [stats, recentActivity, pendingRequests] = await Promise.all([
      getTalentDashboardStats(user.id, talent.id),
      getRecentActivity(user.id, { limit: 10 }),
      getPendingRequestsSummary(talent.id, 5),
    ]);

    return {
      success: true,
      data: {
        stats,
        recentActivity: recentActivity.items,
        pendingRequests,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to get talent dashboard data',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Get professional dashboard data including stats and recent activity.
 */
export async function getProfessionalDashboardData(): Promise<
  DashboardDataResult<ProfessionalDashboardData>
> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const [stats, recentActivity, recentCollections] = await Promise.all([
      getProfessionalDashboardStats(user.id),
      getRecentActivity(user.id, { limit: 10 }),
      getRecentCollections(user.id, 5),
    ]);

    return {
      success: true,
      data: {
        stats,
        recentActivity: recentActivity.items,
        recentCollections,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to get professional dashboard data',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Get company dashboard data including stats, activity, and team summary.
 */
export async function getCompanyDashboardData(): Promise<
  DashboardDataResult<CompanyDashboardData>
> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const company = await db.companyProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    const [stats, recentActivity, recentCollections, teamActivitySummary] = await Promise.all([
      getCompanyDashboardStats(user.id),
      getRecentActivity(user.id, { limit: 10 }),
      getRecentCollections(user.id, 5),
      company ? getTeamActivitySummary(company.id) : Promise.resolve(undefined),
    ]);

    return {
      success: true,
      data: {
        stats,
        recentActivity: recentActivity.items,
        recentCollections,
        teamActivitySummary,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to get company dashboard data',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}

/**
 * Get activity feed for the current user.
 */
export async function getActivityFeed(
  options: ActivityFeedOptions = {}
): Promise<DashboardDataResult<ActivityFeedResult>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    const result = await getRecentActivity(user.id, options);
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error(
      'Failed to get activity feed',
      error instanceof Error ? error : new Error(errorMessage)
    );
    return { success: false, error: errorMessage };
  }
}
