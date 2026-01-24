import { db } from '@/lib/db';
import type { Role } from '@prisma/client';
import type {
  ActivityItem,
  ActivityFeedOptions,
  ActivityFeedResult,
  DashboardStats,
  ProfileViewStats,
  ResponseRateStats,
  CollectionSummary,
  PendingRequestSummary,
  TeamActivitySummary,
} from './types';

const DEFAULT_ACTIVITY_LIMIT = 10;

// =============================================================================
// USER DISPLAY INFO
// =============================================================================

/**
 * Get user display info (name, photo, role) for activity items
 */
async function getUserDisplayInfo(userId: string): Promise<{
  name: string;
  photo: string | null;
  role: Role;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      talentProfile: { select: { firstName: true, lastName: true, photo: true } },
      professionalProfile: { select: { firstName: true, lastName: true } },
      companyProfile: { select: { companyName: true } },
    },
  });

  if (!user) {
    return { name: 'Unknown User', photo: null, role: 'VISITOR' };
  }

  let name = 'User';
  let photo: string | null = null;

  if (user.talentProfile) {
    name = `${user.talentProfile.firstName} ${user.talentProfile.lastName}`;
    photo = user.talentProfile.photo;
  } else if (user.professionalProfile) {
    name = `${user.professionalProfile.firstName} ${user.professionalProfile.lastName}`;
  } else if (user.companyProfile) {
    name = user.companyProfile.companyName;
  }

  return { name, photo, role: user.role };
}

// =============================================================================
// DASHBOARD STATISTICS
// =============================================================================

/**
 * Get dashboard statistics for a talent user
 */
export async function getTalentDashboardStats(
  userId: string,
  talentProfileId: string
): Promise<DashboardStats> {
  const [
    unreadMessages,
    totalConversations,
    pendingRequests,
    unreadNotifications,
    profileViews,
    responseRate,
  ] = await Promise.all([
    getUnreadMessageCount(userId),
    getTotalConversationCount(userId),
    getPendingContactRequestCount(talentProfileId, 'talent'),
    getUnreadNotificationCount(userId),
    getProfileViewStats(talentProfileId),
    getResponseRateStats(talentProfileId),
  ]);

  return {
    unreadMessages,
    totalConversations,
    pendingContactRequests: pendingRequests,
    receivedContactRequests: pendingRequests,
    unreadNotifications,
    profileViews,
    responseRate,
  };
}

/**
 * Get dashboard statistics for a professional user
 */
export async function getProfessionalDashboardStats(userId: string): Promise<DashboardStats> {
  const [
    unreadMessages,
    totalConversations,
    pendingRequests,
    sentRequests,
    unreadNotifications,
    collectionsData,
  ] = await Promise.all([
    getUnreadMessageCount(userId),
    getTotalConversationCount(userId),
    getSentPendingContactRequestCount(userId),
    getTotalSentContactRequestCount(userId),
    getUnreadNotificationCount(userId),
    getCollectionStats(userId),
  ]);

  return {
    unreadMessages,
    totalConversations,
    pendingContactRequests: pendingRequests,
    sentContactRequests: sentRequests,
    unreadNotifications,
    totalCollections: collectionsData.totalCollections,
    totalTalentsInCollections: collectionsData.totalTalents,
  };
}

/**
 * Get dashboard statistics for a company user
 */
export async function getCompanyDashboardStats(userId: string): Promise<DashboardStats> {
  // Company stats are similar to professional stats
  return getProfessionalDashboardStats(userId);
}

// =============================================================================
// MESSAGE COUNTS
// =============================================================================

/**
 * Count unread messages for a user
 */
async function getUnreadMessageCount(userId: string): Promise<number> {
  // Get all conversations the user is part of
  const participations = await db.conversationParticipant.findMany({
    where: { userId },
    select: { conversationId: true },
  });

  if (participations.length === 0) return 0;

  const conversationIds = participations.map((p) => p.conversationId);

  // Count unread messages (not sent by user, not read)
  return db.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: userId },
      readAt: null,
    },
  });
}

/**
 * Count total conversations for a user
 */
async function getTotalConversationCount(userId: string): Promise<number> {
  return db.conversationParticipant.count({
    where: { userId },
  });
}

// =============================================================================
// CONTACT REQUEST COUNTS
// =============================================================================

/**
 * Count pending contact requests for a talent (received)
 */
async function getPendingContactRequestCount(
  talentProfileId: string,
  type: 'talent' | 'requester'
): Promise<number> {
  if (type === 'talent') {
    return db.contactRequest.count({
      where: {
        talentProfileId,
        status: 'PENDING',
      },
    });
  }
  return 0;
}

/**
 * Count sent pending contact requests for a requester
 */
async function getSentPendingContactRequestCount(requesterId: string): Promise<number> {
  return db.contactRequest.count({
    where: {
      requesterId,
      status: 'PENDING',
    },
  });
}

/**
 * Count total sent contact requests for a requester
 */
async function getTotalSentContactRequestCount(requesterId: string): Promise<number> {
  return db.contactRequest.count({
    where: { requesterId },
  });
}

// =============================================================================
// NOTIFICATION COUNTS
// =============================================================================

/**
 * Count unread notifications for a user
 */
async function getUnreadNotificationCount(userId: string): Promise<number> {
  return db.notification.count({
    where: {
      recipientId: userId,
      readAt: null,
    },
  });
}

// =============================================================================
// COLLECTION STATS
// =============================================================================

/**
 * Get collection statistics for a user
 */
async function getCollectionStats(userId: string): Promise<{
  totalCollections: number;
  totalTalents: number;
}> {
  const collections = await db.collection.findMany({
    where: { ownerId: userId },
    include: {
      _count: { select: { talents: true } },
    },
  });

  const totalCollections = collections.length;
  const totalTalents = collections.reduce((sum, c) => sum + c._count.talents, 0);

  return { totalCollections, totalTalents };
}

/**
 * Get recent collections for dashboard display
 */
export async function getRecentCollections(
  userId: string,
  limit: number = 5
): Promise<CollectionSummary[]> {
  const collections = await db.collection.findMany({
    where: { ownerId: userId },
    include: {
      _count: { select: { talents: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    talentCount: c._count.talents,
    updatedAt: c.updatedAt,
  }));
}

// =============================================================================
// PROFILE VIEW STATS
// =============================================================================

/**
 * Get profile view statistics for a talent
 */
export async function getProfileViewStats(talentProfileId: string): Promise<ProfileViewStats> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [todayViews, weekViews, monthViews, totalViews] = await Promise.all([
    db.profileView.aggregate({
      where: {
        talentProfileId,
        date: { equals: today },
      },
      _sum: { viewCount: true },
    }),
    db.profileView.aggregate({
      where: {
        talentProfileId,
        date: { gte: weekAgo },
      },
      _sum: { viewCount: true },
    }),
    db.profileView.aggregate({
      where: {
        talentProfileId,
        date: { gte: monthAgo },
      },
      _sum: { viewCount: true },
    }),
    db.profileView.aggregate({
      where: { talentProfileId },
      _sum: { viewCount: true },
    }),
  ]);

  return {
    today: todayViews._sum.viewCount || 0,
    thisWeek: weekViews._sum.viewCount || 0,
    thisMonth: monthViews._sum.viewCount || 0,
    total: totalViews._sum.viewCount || 0,
  };
}

// =============================================================================
// RESPONSE RATE STATS
// =============================================================================

/**
 * Get response rate statistics for a talent
 */
export async function getResponseRateStats(talentProfileId: string): Promise<ResponseRateStats> {
  const [totalReceived, approved, declined] = await Promise.all([
    db.contactRequest.count({ where: { talentProfileId } }),
    db.contactRequest.count({ where: { talentProfileId, status: 'APPROVED' } }),
    db.contactRequest.count({ where: { talentProfileId, status: 'DECLINED' } }),
  ]);

  const pending = totalReceived - approved - declined;
  const responded = approved + declined;
  const responseRate = totalReceived > 0 ? Math.round((responded / totalReceived) * 100) : 0;

  return {
    totalReceived,
    approved,
    declined,
    pending,
    responseRate,
  };
}

// =============================================================================
// PENDING REQUESTS SUMMARY
// =============================================================================

/**
 * Get pending contact requests for talent dashboard
 */
export async function getPendingRequestsSummary(
  talentProfileId: string,
  limit: number = 5
): Promise<PendingRequestSummary[]> {
  const requests = await db.contactRequest.findMany({
    where: {
      talentProfileId,
      status: 'PENDING',
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  const summaries: PendingRequestSummary[] = await Promise.all(
    requests.map(async (req) => {
      const requesterInfo = await getUserDisplayInfo(req.requesterId);
      // Get company info if available
      const user = await db.user.findUnique({
        where: { id: req.requesterId },
        include: {
          professionalProfile: { select: { company: true } },
          companyProfile: { select: { companyName: true } },
        },
      });

      const company =
        user?.professionalProfile?.company || user?.companyProfile?.companyName || null;

      return {
        id: req.id,
        requesterName: requesterInfo.name,
        requesterCompany: company,
        projectType: req.projectType,
        createdAt: req.createdAt,
      };
    })
  );

  return summaries;
}

// =============================================================================
// TEAM ACTIVITY SUMMARY (Company)
// =============================================================================

/**
 * Get team activity summary for company dashboard
 */
export async function getTeamActivitySummary(companyId: string): Promise<TeamActivitySummary> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get company members
  const members = await db.companyMember.findMany({
    where: { companyId },
    select: { userId: true, status: true },
  });

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'ACTIVE').length;

  // Get active member user IDs
  const activeMemberUserIds = members
    .filter((m) => m.status === 'ACTIVE' && m.userId)
    .map((m) => m.userId as string);

  // Count messages sent by team this week
  let messagesSentThisWeek = 0;
  if (activeMemberUserIds.length > 0) {
    messagesSentThisWeek = await db.message.count({
      where: {
        senderId: { in: activeMemberUserIds },
        createdAt: { gte: weekAgo },
      },
    });
  }

  // Count collections created by team this week
  let collectionsCreatedThisWeek = 0;
  if (activeMemberUserIds.length > 0) {
    collectionsCreatedThisWeek = await db.collection.count({
      where: {
        ownerId: { in: activeMemberUserIds },
        createdAt: { gte: weekAgo },
      },
    });
  }

  return {
    totalMembers,
    activeMembers,
    messagesSentThisWeek,
    collectionsCreatedThisWeek,
  };
}

// =============================================================================
// ACTIVITY FEED
// =============================================================================

/**
 * Get recent activity feed for a user
 */
export async function getRecentActivity(
  userId: string,
  options: ActivityFeedOptions = {}
): Promise<ActivityFeedResult> {
  const { limit = DEFAULT_ACTIVITY_LIMIT, offset = 0, types, unreadOnly } = options;

  const activities: ActivityItem[] = [];

  // Determine which activity types to fetch
  const fetchTypes = types || ['MESSAGE', 'CONTACT_REQUEST', 'COLLECTION', 'NOTIFICATION'];

  // Fetch each type and merge
  const fetchPromises: Promise<ActivityItem[]>[] = [];

  if (fetchTypes.includes('MESSAGE')) {
    fetchPromises.push(getRecentMessageActivity(userId, limit));
  }
  if (fetchTypes.includes('CONTACT_REQUEST')) {
    fetchPromises.push(getRecentContactRequestActivity(userId, limit));
  }
  if (fetchTypes.includes('NOTIFICATION')) {
    fetchPromises.push(getRecentNotificationActivity(userId, limit, unreadOnly));
  }

  const results = await Promise.all(fetchPromises);
  results.forEach((items) => activities.push(...items));

  // Sort by timestamp descending
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Apply pagination
  const paginatedItems = activities.slice(offset, offset + limit);
  const hasMore = activities.length > offset + limit;

  return {
    items: paginatedItems,
    total: activities.length,
    hasMore,
  };
}

/**
 * Get recent message activity items
 */
async function getRecentMessageActivity(userId: string, limit: number): Promise<ActivityItem[]> {
  // Get conversations with recent messages
  const participations = await db.conversationParticipant.findMany({
    where: { userId },
    select: { conversationId: true },
  });

  if (participations.length === 0) return [];

  const conversationIds = participations.map((p) => p.conversationId);

  const messages = await db.message.findMany({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: userId }, // Messages received, not sent
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      conversation: {
        include: {
          participants: { select: { userId: true } },
        },
      },
    },
  });

  const items: ActivityItem[] = await Promise.all(
    messages.map(async (msg) => {
      const senderInfo = await getUserDisplayInfo(msg.senderId);
      return {
        id: `msg-${msg.id}`,
        type: 'MESSAGE' as const,
        title: 'New message',
        description: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : ''),
        timestamp: msg.createdAt,
        actionLink: `/messages/${msg.conversationId}`,
        actorId: msg.senderId,
        actorName: senderInfo.name,
        actorPhoto: senderInfo.photo,
        isRead: msg.readAt !== null,
        metadata: {
          conversationId: msg.conversationId,
        },
      };
    })
  );

  return items;
}

/**
 * Get recent contact request activity items
 */
async function getRecentContactRequestActivity(
  userId: string,
  limit: number
): Promise<ActivityItem[]> {
  // Get user's talent profile if they are a talent
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { talentProfile: { select: { id: true } } },
  });

  const items: ActivityItem[] = [];

  // If user is a talent, get received requests
  if (user?.talentProfile) {
    const receivedRequests = await db.contactRequest.findMany({
      where: { talentProfileId: user.talentProfile.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    for (const req of receivedRequests) {
      const requesterInfo = await getUserDisplayInfo(req.requesterId);
      items.push({
        id: `req-recv-${req.id}`,
        type: 'CONTACT_REQUEST' as const,
        title:
          req.status === 'PENDING'
            ? 'New contact request'
            : `Contact request ${req.status.toLowerCase()}`,
        description: `${requesterInfo.name} - ${req.projectType.replace(/_/g, ' ')}`,
        timestamp: req.respondedAt || req.createdAt,
        actionLink: `/dashboard/requests`,
        actorId: req.requesterId,
        actorName: requesterInfo.name,
        actorPhoto: requesterInfo.photo,
        isRead: req.status !== 'PENDING',
        metadata: {
          requestStatus: req.status,
          projectType: req.projectType,
        },
      });
    }
  }

  // Also get sent requests (for professionals/companies)
  const sentRequests = await db.contactRequest.findMany({
    where: { requesterId: userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      talentProfile: { select: { firstName: true, lastName: true, photo: true } },
    },
  });

  for (const req of sentRequests) {
    const talentName = `${req.talentProfile.firstName} ${req.talentProfile.lastName}`;
    items.push({
      id: `req-sent-${req.id}`,
      type: 'CONTACT_REQUEST' as const,
      title: `Request ${req.status.toLowerCase()}`,
      description: `To ${talentName} - ${req.projectType.replace(/_/g, ' ')}`,
      timestamp: req.respondedAt || req.createdAt,
      actionLink: `/dashboard/requests`,
      actorId: null,
      actorName: talentName,
      actorPhoto: req.talentProfile.photo,
      isRead: req.status !== 'PENDING',
      metadata: {
        requestStatus: req.status,
        projectType: req.projectType,
      },
    });
  }

  return items;
}

/**
 * Get recent notification activity items
 */
async function getRecentNotificationActivity(
  userId: string,
  limit: number,
  unreadOnly?: boolean
): Promise<ActivityItem[]> {
  const notifications = await db.notification.findMany({
    where: {
      recipientId: userId,
      ...(unreadOnly && { readAt: null }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  const items: ActivityItem[] = await Promise.all(
    notifications.map(async (notif) => {
      let actorInfo = { name: null as string | null, photo: null as string | null };
      if (notif.senderId) {
        const info = await getUserDisplayInfo(notif.senderId);
        actorInfo = { name: info.name, photo: info.photo };
      }

      return {
        id: `notif-${notif.id}`,
        type: 'NOTIFICATION' as const,
        title: notif.title,
        description: notif.content.substring(0, 100) + (notif.content.length > 100 ? '...' : ''),
        timestamp: notif.createdAt,
        actionLink: notif.actionLink,
        actorId: notif.senderId,
        actorName: actorInfo.name,
        actorPhoto: actorInfo.photo,
        isRead: notif.readAt !== null,
        metadata: {
          notificationType: notif.type,
        },
      };
    })
  );

  return items;
}
