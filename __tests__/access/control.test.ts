import { describe, it, expect, vi } from 'vitest';

// Mock the subscription module
vi.mock('@/lib/payment/subscription', () => ({
  hasActiveAccess: vi.fn((status: string) => {
    return ['ACTIVE', 'TRIAL', 'PAST_DUE'].includes(status);
  }),
}));

import {
  isAdminRole,
  isSubscriberRole,
  hasPremiumSubscription,
  getAccessLevel,
  checkPremiumAccess,
  canAccessTalentPremiumData,
  getSubscriptionDisplayInfo,
  buildAccessContext,
} from '@/lib/access/control';
import { ADMIN_ROLES, SUBSCRIBER_ROLES, PREMIUM_ACCESS_STATUSES } from '@/lib/access/types';

describe('Access Control Functions', () => {
  describe('isAdminRole', () => {
    it('should return true for ADMIN role', () => {
      expect(isAdminRole('ADMIN')).toBe(true);
    });

    it('should return false for PROFESSIONAL role', () => {
      expect(isAdminRole('PROFESSIONAL')).toBe(false);
    });

    it('should return false for COMPANY role', () => {
      expect(isAdminRole('COMPANY')).toBe(false);
    });

    it('should return false for TALENT role', () => {
      expect(isAdminRole('TALENT')).toBe(false);
    });

    it('should return false for VISITOR role', () => {
      expect(isAdminRole('VISITOR')).toBe(false);
    });
  });

  describe('isSubscriberRole', () => {
    it('should return true for PROFESSIONAL role', () => {
      expect(isSubscriberRole('PROFESSIONAL')).toBe(true);
    });

    it('should return true for COMPANY role', () => {
      expect(isSubscriberRole('COMPANY')).toBe(true);
    });

    it('should return false for ADMIN role', () => {
      expect(isSubscriberRole('ADMIN')).toBe(false);
    });

    it('should return false for TALENT role', () => {
      expect(isSubscriberRole('TALENT')).toBe(false);
    });

    it('should return false for VISITOR role', () => {
      expect(isSubscriberRole('VISITOR')).toBe(false);
    });
  });

  describe('hasPremiumSubscription', () => {
    it('should return true for ACTIVE status', () => {
      expect(hasPremiumSubscription('ACTIVE')).toBe(true);
    });

    it('should return true for TRIAL status', () => {
      expect(hasPremiumSubscription('TRIAL')).toBe(true);
    });

    it('should return true for PAST_DUE status', () => {
      expect(hasPremiumSubscription('PAST_DUE')).toBe(true);
    });

    it('should return false for NONE status', () => {
      expect(hasPremiumSubscription('NONE')).toBe(false);
    });

    it('should return false for CANCELLED status', () => {
      expect(hasPremiumSubscription('CANCELLED')).toBe(false);
    });

    it('should return false for EXPIRED status', () => {
      expect(hasPremiumSubscription('EXPIRED')).toBe(false);
    });
  });

  describe('getAccessLevel', () => {
    it('should return full for ADMIN regardless of subscription', () => {
      const context = {
        userId: 'admin-1',
        role: 'ADMIN' as const,
        subscriptionStatus: 'NONE' as const,
      };
      expect(getAccessLevel(context)).toBe('full');
    });

    it('should return premium for PROFESSIONAL with ACTIVE subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'ACTIVE' as const,
      };
      expect(getAccessLevel(context)).toBe('premium');
    });

    it('should return premium for COMPANY with TRIAL subscription', () => {
      const context = {
        userId: 'company-1',
        role: 'COMPANY' as const,
        subscriptionStatus: 'TRIAL' as const,
      };
      expect(getAccessLevel(context)).toBe('premium');
    });

    it('should return premium for PROFESSIONAL with PAST_DUE subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'PAST_DUE' as const,
      };
      expect(getAccessLevel(context)).toBe('premium');
    });

    it('should return public for PROFESSIONAL with NONE subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'NONE' as const,
      };
      expect(getAccessLevel(context)).toBe('public');
    });

    it('should return public for PROFESSIONAL with CANCELLED subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'CANCELLED' as const,
      };
      expect(getAccessLevel(context)).toBe('public');
    });

    it('should return public for TALENT role', () => {
      const context = {
        userId: 'talent-1',
        role: 'TALENT' as const,
        subscriptionStatus: 'ACTIVE' as const,
      };
      expect(getAccessLevel(context)).toBe('public');
    });

    it('should return public for VISITOR role', () => {
      const context = {
        userId: 'visitor-1',
        role: 'VISITOR' as const,
        subscriptionStatus: 'NONE' as const,
      };
      expect(getAccessLevel(context)).toBe('public');
    });
  });

  describe('checkPremiumAccess', () => {
    it('should grant full access to ADMIN', () => {
      const context = {
        userId: 'admin-1',
        role: 'ADMIN' as const,
        subscriptionStatus: 'NONE' as const,
      };
      const result = checkPremiumAccess(context);
      expect(result.granted).toBe(true);
      expect(result.level).toBe('full');
      expect(result.reason).toBe('Admin access');
    });

    it('should grant premium access to PROFESSIONAL with ACTIVE subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'ACTIVE' as const,
      };
      const result = checkPremiumAccess(context);
      expect(result.granted).toBe(true);
      expect(result.level).toBe('premium');
    });

    it('should deny access to PROFESSIONAL with NONE subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'NONE' as const,
      };
      const result = checkPremiumAccess(context);
      expect(result.granted).toBe(false);
      expect(result.level).toBe('public');
      expect(result.reason).toContain('subscription is required');
    });

    it('should deny access to PROFESSIONAL with CANCELLED subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'CANCELLED' as const,
      };
      const result = checkPremiumAccess(context);
      expect(result.granted).toBe(false);
      expect(result.reason).toContain('cancelled');
    });

    it('should deny access to PROFESSIONAL with EXPIRED subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'EXPIRED' as const,
      };
      const result = checkPremiumAccess(context);
      expect(result.granted).toBe(false);
      expect(result.reason).toContain('expired');
    });

    it('should deny access to TALENT role', () => {
      const context = {
        userId: 'talent-1',
        role: 'TALENT' as const,
        subscriptionStatus: 'ACTIVE' as const,
      };
      const result = checkPremiumAccess(context);
      expect(result.granted).toBe(false);
      expect(result.reason).toContain('account type');
    });

    it('should deny access to VISITOR role', () => {
      const context = {
        userId: 'visitor-1',
        role: 'VISITOR' as const,
        subscriptionStatus: 'NONE' as const,
      };
      const result = checkPremiumAccess(context);
      expect(result.granted).toBe(false);
    });
  });

  describe('canAccessTalentPremiumData', () => {
    it('should grant full access when viewing own profile', () => {
      const context = {
        userId: 'talent-1',
        role: 'TALENT' as const,
        subscriptionStatus: 'NONE' as const,
      };
      const result = canAccessTalentPremiumData(context, 'talent-1');
      expect(result.granted).toBe(true);
      expect(result.level).toBe('full');
      expect(result.reason).toBe('Viewing own profile');
    });

    it('should use standard access check for other profiles', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'ACTIVE' as const,
      };
      const result = canAccessTalentPremiumData(context, 'talent-1');
      expect(result.granted).toBe(true);
      expect(result.level).toBe('premium');
    });

    it('should deny access to other profiles without subscription', () => {
      const context = {
        userId: 'pro-1',
        role: 'PROFESSIONAL' as const,
        subscriptionStatus: 'NONE' as const,
      };
      const result = canAccessTalentPremiumData(context, 'talent-1');
      expect(result.granted).toBe(false);
    });
  });

  describe('getSubscriptionDisplayInfo', () => {
    it('should return correct info for ACTIVE status', () => {
      const info = getSubscriptionDisplayInfo('ACTIVE');
      expect(info.label).toBe('Active');
      expect(info.color).toBe('green');
      expect(info.hasAccess).toBe(true);
    });

    it('should return correct info for TRIAL status', () => {
      const info = getSubscriptionDisplayInfo('TRIAL');
      expect(info.label).toBe('Trial');
      expect(info.color).toBe('green');
      expect(info.hasAccess).toBe(true);
    });

    it('should return correct info for PAST_DUE status', () => {
      const info = getSubscriptionDisplayInfo('PAST_DUE');
      expect(info.label).toBe('Past Due');
      expect(info.color).toBe('yellow');
      expect(info.hasAccess).toBe(true);
    });

    it('should return correct info for CANCELLED status', () => {
      const info = getSubscriptionDisplayInfo('CANCELLED');
      expect(info.label).toBe('Cancelled');
      expect(info.color).toBe('red');
      expect(info.hasAccess).toBe(false);
    });

    it('should return correct info for EXPIRED status', () => {
      const info = getSubscriptionDisplayInfo('EXPIRED');
      expect(info.label).toBe('Expired');
      expect(info.color).toBe('red');
      expect(info.hasAccess).toBe(false);
    });

    it('should return correct info for NONE status', () => {
      const info = getSubscriptionDisplayInfo('NONE');
      expect(info.label).toBe('No Subscription');
      expect(info.color).toBe('gray');
      expect(info.hasAccess).toBe(false);
    });
  });

  describe('buildAccessContext', () => {
    it('should build context with all fields', () => {
      const endsAt = new Date('2025-12-31');
      const context = buildAccessContext({
        id: 'user-1',
        role: 'PROFESSIONAL',
        subscriptionStatus: 'ACTIVE',
        subscriptionEndsAt: endsAt,
      });
      expect(context.userId).toBe('user-1');
      expect(context.role).toBe('PROFESSIONAL');
      expect(context.subscriptionStatus).toBe('ACTIVE');
      expect(context.subscriptionEndsAt).toBe(endsAt);
    });

    it('should default subscriptionStatus to NONE', () => {
      const context = buildAccessContext({
        id: 'user-1',
        role: 'VISITOR',
      });
      expect(context.subscriptionStatus).toBe('NONE');
    });

    it('should default subscriptionEndsAt to null', () => {
      const context = buildAccessContext({
        id: 'user-1',
        role: 'VISITOR',
      });
      expect(context.subscriptionEndsAt).toBeNull();
    });
  });

  describe('Constants', () => {
    it('ADMIN_ROLES should include ADMIN', () => {
      expect(ADMIN_ROLES).toContain('ADMIN');
    });

    it('SUBSCRIBER_ROLES should include PROFESSIONAL and COMPANY', () => {
      expect(SUBSCRIBER_ROLES).toContain('PROFESSIONAL');
      expect(SUBSCRIBER_ROLES).toContain('COMPANY');
    });

    it('PREMIUM_ACCESS_STATUSES should include ACTIVE, TRIAL, PAST_DUE', () => {
      expect(PREMIUM_ACCESS_STATUSES).toContain('ACTIVE');
      expect(PREMIUM_ACCESS_STATUSES).toContain('TRIAL');
      expect(PREMIUM_ACCESS_STATUSES).toContain('PAST_DUE');
    });

    it('PREMIUM_ACCESS_STATUSES should not include CANCELLED or EXPIRED', () => {
      expect(PREMIUM_ACCESS_STATUSES).not.toContain('CANCELLED');
      expect(PREMIUM_ACCESS_STATUSES).not.toContain('EXPIRED');
      expect(PREMIUM_ACCESS_STATUSES).not.toContain('NONE');
    });
  });
});
