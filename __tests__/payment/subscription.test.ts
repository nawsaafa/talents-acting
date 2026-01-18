import { describe, it, expect, vi } from 'vitest';

// Mock Stripe before importing subscription module
vi.mock('@/lib/payment/stripe', () => ({
  stripe: {
    subscriptions: {
      retrieve: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
    },
    customers: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
    invoices: {
      retrieveUpcoming: vi.fn(),
      list: vi.fn(),
    },
  },
}));

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import {
  mapStripeStatus,
  hasActiveAccess,
  isInGracePeriod,
  daysUntilExpiration,
  isExpiringSoon,
  formatSubscriptionEndDate,
} from '@/lib/payment/subscription';

describe('Subscription Functions', () => {
  describe('mapStripeStatus', () => {
    it('should map active status correctly', () => {
      expect(mapStripeStatus('active')).toBe('ACTIVE');
    });

    it('should map trialing status correctly', () => {
      expect(mapStripeStatus('trialing')).toBe('TRIAL');
    });

    it('should map past_due status correctly', () => {
      expect(mapStripeStatus('past_due')).toBe('PAST_DUE');
    });

    it('should map canceled status correctly', () => {
      expect(mapStripeStatus('canceled')).toBe('CANCELLED');
    });

    it('should map incomplete status correctly', () => {
      expect(mapStripeStatus('incomplete')).toBe('NONE');
    });

    it('should map incomplete_expired status correctly', () => {
      expect(mapStripeStatus('incomplete_expired')).toBe('EXPIRED');
    });

    it('should map unpaid status correctly', () => {
      expect(mapStripeStatus('unpaid')).toBe('PAST_DUE');
    });

    it('should map paused status correctly', () => {
      expect(mapStripeStatus('paused')).toBe('CANCELLED');
    });
  });

  describe('hasActiveAccess', () => {
    it('should return true for ACTIVE status', () => {
      expect(hasActiveAccess('ACTIVE')).toBe(true);
    });

    it('should return true for TRIAL status', () => {
      expect(hasActiveAccess('TRIAL')).toBe(true);
    });

    it('should return false for NONE status', () => {
      expect(hasActiveAccess('NONE')).toBe(false);
    });

    it('should return true for PAST_DUE status (grace period access)', () => {
      expect(hasActiveAccess('PAST_DUE')).toBe(true);
    });

    it('should return false for CANCELLED status', () => {
      expect(hasActiveAccess('CANCELLED')).toBe(false);
    });

    it('should return false for EXPIRED status', () => {
      expect(hasActiveAccess('EXPIRED')).toBe(false);
    });
  });

  describe('isInGracePeriod', () => {
    it('should return true for PAST_DUE status', () => {
      expect(isInGracePeriod('PAST_DUE')).toBe(true);
    });

    it('should return false for ACTIVE status', () => {
      expect(isInGracePeriod('ACTIVE')).toBe(false);
    });

    it('should return false for NONE status', () => {
      expect(isInGracePeriod('NONE')).toBe(false);
    });

    it('should return false for CANCELLED status', () => {
      expect(isInGracePeriod('CANCELLED')).toBe(false);
    });
  });

  describe('daysUntilExpiration', () => {
    it('should return null for null date', () => {
      expect(daysUntilExpiration(null)).toBeNull();
    });

    it('should return positive number for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const result = daysUntilExpiration(futureDate);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(31);
    });

    it('should return 0 or negative for past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const result = daysUntilExpiration(pastDate);
      expect(result).toBeLessThanOrEqual(0);
    });

    it('should return approximately 365 for date one year from now', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = daysUntilExpiration(futureDate);
      expect(result).toBeGreaterThan(360);
      expect(result).toBeLessThanOrEqual(370);
    });
  });

  describe('isExpiringSoon', () => {
    it('should return true for date within 30 days', () => {
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 15);
      expect(isExpiringSoon(soonDate)).toBe(true);
    });

    it('should return true for date 29 days away (within threshold)', () => {
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 29);
      expect(isExpiringSoon(soonDate)).toBe(true);
    });

    it('should return false for date more than 30 days away', () => {
      const laterDate = new Date();
      laterDate.setDate(laterDate.getDate() + 60);
      expect(isExpiringSoon(laterDate)).toBe(false);
    });

    it('should return false for null date', () => {
      expect(isExpiringSoon(null)).toBe(false);
    });

    it('should return false for past dates (already expired)', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      // Already expired dates don't count as "expiring soon"
      expect(isExpiringSoon(pastDate)).toBe(false);
    });

    it('should respect custom threshold', () => {
      const date = new Date();
      date.setDate(date.getDate() + 45);
      expect(isExpiringSoon(date, 30)).toBe(false);
      expect(isExpiringSoon(date, 60)).toBe(true);
    });
  });

  describe('formatSubscriptionEndDate', () => {
    it('should return formatted date string', () => {
      const date = new Date('2025-12-15');
      const result = formatSubscriptionEndDate(date);
      expect(result).toContain('2025');
      expect(result).toContain('December');
      expect(result).toContain('15');
    });

    it('should return N/A for null date', () => {
      expect(formatSubscriptionEndDate(null)).toBe('N/A');
    });
  });
});
