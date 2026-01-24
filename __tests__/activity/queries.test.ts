import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma client
vi.mock('@/lib/db', () => ({
  db: {
    profileView: {
      upsert: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    message: {
      count: vi.fn(),
      groupBy: vi.fn(),
      findMany: vi.fn(),
    },
    conversationParticipant: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    contactRequest: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    notification: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    collection: {
      count: vi.fn(),
      aggregate: vi.fn(),
      findMany: vi.fn(),
    },
    collectionItem: {
      count: vi.fn(),
    },
    talentProfile: {
      findUnique: vi.fn(),
    },
    companyProfile: {
      findUnique: vi.fn(),
    },
    companyMember: {
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  log: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock auth
vi.mock('@/lib/auth/utils', () => ({
  getCurrentUser: vi.fn(),
}));

import { db } from '@/lib/db';
import {
  getProfileViewStats,
  getRecentCollections,
  getPendingRequestsSummary,
} from '@/lib/activity/queries';

describe('getProfileViewStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return profile view statistics for a talent', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mock aggregate for total views
    vi.mocked(db.profileView.aggregate).mockResolvedValue({
      _sum: { viewCount: 150 },
    } as never);

    // Mock groupBy for period views
    vi.mocked(db.profileView.groupBy).mockResolvedValue([
      { date: today, _sum: { viewCount: 10 } },
      { date: new Date(today.getTime() - 86400000), _sum: { viewCount: 15 } },
      { date: new Date(today.getTime() - 2 * 86400000), _sum: { viewCount: 12 } },
    ] as never);

    const result = await getProfileViewStats('talent-123');

    expect(result.total).toBe(150);
    expect(result.today).toBeGreaterThanOrEqual(0);
    expect(result.thisWeek).toBeGreaterThanOrEqual(0);
    expect(result.thisMonth).toBeGreaterThanOrEqual(0);
    expect(db.profileView.aggregate).toHaveBeenCalledWith({
      where: { talentProfileId: 'talent-123' },
      _sum: { viewCount: true },
    });
  });

  it('should return zero stats when no views exist', async () => {
    vi.mocked(db.profileView.aggregate).mockResolvedValue({
      _sum: { viewCount: null },
    } as never);

    vi.mocked(db.profileView.groupBy).mockResolvedValue([] as never);

    const result = await getProfileViewStats('talent-123');

    expect(result.total).toBe(0);
    expect(result.today).toBe(0);
    expect(result.thisWeek).toBe(0);
    expect(result.thisMonth).toBe(0);
  });
});

describe('getRecentCollections', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return recent collections for a user', async () => {
    vi.mocked(db.collection.findMany).mockResolvedValue([
      {
        id: 'coll-1',
        name: 'Top Actors',
        updatedAt: new Date(),
        _count: { talents: 5 },
      },
      {
        id: 'coll-2',
        name: 'Directors',
        updatedAt: new Date(Date.now() - 86400000),
        _count: { talents: 3 },
      },
    ] as never);

    const result = await getRecentCollections('user-123', 5);

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Top Actors');
    expect(result[0].talentCount).toBe(5);
    expect(result[1].name).toBe('Directors');
    expect(result[1].talentCount).toBe(3);
  });

  it('should return empty array when no collections exist', async () => {
    vi.mocked(db.collection.findMany).mockResolvedValue([]);

    const result = await getRecentCollections('user-123', 5);

    expect(result.length).toBe(0);
  });
});

describe('getPendingRequestsSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return pending contact requests for a talent', async () => {
    vi.mocked(db.contactRequest.findMany).mockResolvedValue([
      {
        id: 'req-1',
        createdAt: new Date(),
        projectType: 'FILM',
        requesterId: 'user-jane',
      },
    ] as never);

    // Mock user lookup - returns professional profile
    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: 'user-jane',
      name: 'Jane Smith',
      role: 'PROFESSIONAL',
      talentProfile: null,
      professionalProfile: { firstName: 'Jane', lastName: 'Smith', company: 'Film Co' },
      companyProfile: null,
    } as never);

    const result = await getPendingRequestsSummary('talent-123', 5);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('req-1');
    expect(result[0].projectType).toBe('FILM');
    expect(db.contactRequest.findMany).toHaveBeenCalledWith({
      where: {
        talentProfileId: 'talent-123',
        status: 'PENDING',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  });

  it('should return empty array when no pending requests', async () => {
    vi.mocked(db.contactRequest.findMany).mockResolvedValue([]);

    const result = await getPendingRequestsSummary('talent-123', 5);

    expect(result.length).toBe(0);
  });
});
