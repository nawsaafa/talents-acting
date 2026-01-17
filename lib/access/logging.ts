import { prisma } from '@/lib/prisma';
import { AccessLogEntry, ResourceType, AccessAction } from './types';
import { log } from '@/lib/logger';

/**
 * Log an access attempt to the database
 */
export async function logAccessAttempt(entry: AccessLogEntry): Promise<void> {
  try {
    await prisma.accessLog.create({
      data: {
        userId: entry.userId,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        action: entry.action,
        granted: entry.granted,
        reason: entry.reason,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    // Log error but don't throw - access logging should not break the app
    log.error('Failed to log access attempt:', error instanceof Error ? error : undefined);
  }
}

/**
 * Log a successful access
 */
export async function logAccessGranted(
  userId: string,
  resourceType: ResourceType,
  resourceId: string,
  action: AccessAction = 'view',
  context?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  await logAccessAttempt({
    userId,
    resourceType,
    resourceId,
    action,
    granted: true,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });
}

/**
 * Log a denied access
 */
export async function logAccessDenied(
  userId: string,
  resourceType: ResourceType,
  resourceId: string,
  reason: string,
  action: AccessAction = 'view',
  context?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  await logAccessAttempt({
    userId,
    resourceType,
    resourceId,
    action,
    granted: false,
    reason,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });
}

/**
 * Get access logs for a specific user
 */
export async function getAccessLogsByUser(
  userId: string,
  limit: number = 100
): Promise<
  Array<{
    id: string;
    resourceType: string;
    resourceId: string;
    action: string;
    granted: boolean;
    reason: string | null;
    createdAt: Date;
  }>
> {
  return prisma.accessLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      resourceType: true,
      resourceId: true,
      action: true,
      granted: true,
      reason: true,
      createdAt: true,
    },
  });
}

/**
 * Get access logs for a specific resource
 */
export async function getAccessLogsByResource(
  resourceType: ResourceType,
  resourceId: string,
  limit: number = 100
): Promise<
  Array<{
    id: string;
    userId: string;
    action: string;
    granted: boolean;
    reason: string | null;
    createdAt: Date;
  }>
> {
  return prisma.accessLog.findMany({
    where: { resourceType, resourceId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      userId: true,
      action: true,
      granted: true,
      reason: true,
      createdAt: true,
    },
  });
}

/**
 * Get access statistics for a time period
 */
export async function getAccessStats(
  startDate: Date,
  endDate: Date
): Promise<{
  total: number;
  granted: number;
  denied: number;
  byResourceType: Record<string, { granted: number; denied: number }>;
}> {
  const logs = await prisma.accessLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      resourceType: true,
      granted: true,
    },
  });

  const stats = {
    total: logs.length,
    granted: 0,
    denied: 0,
    byResourceType: {} as Record<string, { granted: number; denied: number }>,
  };

  for (const log of logs) {
    if (log.granted) {
      stats.granted++;
    } else {
      stats.denied++;
    }

    if (!stats.byResourceType[log.resourceType]) {
      stats.byResourceType[log.resourceType] = { granted: 0, denied: 0 };
    }

    if (log.granted) {
      stats.byResourceType[log.resourceType].granted++;
    } else {
      stats.byResourceType[log.resourceType].denied++;
    }
  }

  return stats;
}

/**
 * Clean up old access logs (for maintenance)
 */
export async function cleanupOldAccessLogs(olderThanDays: number = 90): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const result = await prisma.accessLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}
