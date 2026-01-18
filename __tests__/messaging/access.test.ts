import { describe, it, expect } from 'vitest';
import { Role, SubscriptionStatus } from '@prisma/client';
import {
  canInitiateConversation,
  canReplyToConversation,
  canViewConversation,
  buildMessagingContext,
} from '@/lib/messaging/access';
import type { MessagingContext } from '@/lib/messaging/types';

// Helper to create messaging context
function createContext(
  role: Role,
  subscriptionStatus: SubscriptionStatus = 'NONE'
): MessagingContext {
  return {
    userId: 'test-user-id',
    role,
    subscriptionStatus,
  };
}

describe('canInitiateConversation', () => {
  describe('Admin users', () => {
    it('should allow admins to initiate conversations with talents', () => {
      const admin = createContext('ADMIN');
      const result = canInitiateConversation(admin, 'TALENT');

      expect(result.canSend).toBe(true);
      expect(result.reason).toBe('Admin access');
    });

    it('should allow admins to message any role', () => {
      const admin = createContext('ADMIN');

      expect(canInitiateConversation(admin, 'TALENT').canSend).toBe(true);
      expect(canInitiateConversation(admin, 'PROFESSIONAL').canSend).toBe(true);
      expect(canInitiateConversation(admin, 'COMPANY').canSend).toBe(true);
    });
  });

  describe('Talent users', () => {
    it('should not allow talents to initiate conversations', () => {
      const talent = createContext('TALENT');
      const result = canInitiateConversation(talent, 'PROFESSIONAL');

      expect(result.canSend).toBe(false);
      expect(result.reason).toContain('Talents can only reply');
    });

    it('should not allow talents to initiate even with subscription', () => {
      const talent = createContext('TALENT', 'ACTIVE');
      const result = canInitiateConversation(talent, 'PROFESSIONAL');

      expect(result.canSend).toBe(false);
    });
  });

  describe('Visitor users', () => {
    it('should not allow visitors to send messages', () => {
      const visitor = createContext('VISITOR');
      const result = canInitiateConversation(visitor, 'TALENT');

      expect(result.canSend).toBe(false);
      expect(result.reason).toContain('sign in');
    });
  });

  describe('Professional users', () => {
    it('should allow professionals with active subscription to message talents', () => {
      const professional = createContext('PROFESSIONAL', 'ACTIVE');
      const result = canInitiateConversation(professional, 'TALENT');

      expect(result.canSend).toBe(true);
      expect(result.reason).toBe('Active subscription');
    });

    it('should not allow professionals without subscription to message talents', () => {
      const professional = createContext('PROFESSIONAL', 'NONE');
      const result = canInitiateConversation(professional, 'TALENT');

      expect(result.canSend).toBe(false);
      expect(result.requiresSubscription).toBe(true);
      expect(result.reason).toContain('subscription');
    });

    it('should not allow professionals with expired subscription to message talents', () => {
      const professional = createContext('PROFESSIONAL', 'EXPIRED');
      const result = canInitiateConversation(professional, 'TALENT');

      expect(result.canSend).toBe(false);
      expect(result.requiresSubscription).toBe(true);
      expect(result.reason).toContain('expired');
    });

    it('should not allow professionals with cancelled subscription to message talents', () => {
      const professional = createContext('PROFESSIONAL', 'CANCELLED');
      const result = canInitiateConversation(professional, 'TALENT');

      expect(result.canSend).toBe(false);
      expect(result.requiresSubscription).toBe(true);
      expect(result.reason).toContain('cancelled');
    });

    it('should not allow professionals to message non-talent users', () => {
      const professional = createContext('PROFESSIONAL', 'ACTIVE');
      const result = canInitiateConversation(professional, 'PROFESSIONAL');

      expect(result.canSend).toBe(false);
      expect(result.reason).toContain('only message talents');
    });
  });

  describe('Company users', () => {
    it('should allow companies with active subscription to message talents', () => {
      const company = createContext('COMPANY', 'ACTIVE');
      const result = canInitiateConversation(company, 'TALENT');

      expect(result.canSend).toBe(true);
      expect(result.reason).toBe('Active subscription');
    });

    it('should not allow companies without subscription to message talents', () => {
      const company = createContext('COMPANY', 'NONE');
      const result = canInitiateConversation(company, 'TALENT');

      expect(result.canSend).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });

    it('should not allow companies to message non-talent users', () => {
      const company = createContext('COMPANY', 'ACTIVE');
      const result = canInitiateConversation(company, 'COMPANY');

      expect(result.canSend).toBe(false);
      expect(result.reason).toContain('only message talents');
    });
  });
});

describe('canReplyToConversation', () => {
  describe('Non-participants', () => {
    it('should not allow non-participants to reply', () => {
      const professional = createContext('PROFESSIONAL', 'ACTIVE');
      const result = canReplyToConversation(professional, false);

      expect(result.canSend).toBe(false);
      expect(result.reason).toContain('not a participant');
    });

    it('should not allow admins who are not participants to reply (blocked first)', () => {
      // Note: In practice, admins bypass via canViewConversation, but reply still checks participation
      const admin = createContext('ADMIN');
      const result = canReplyToConversation(admin, false);

      expect(result.canSend).toBe(false);
    });
  });

  describe('Admin participants', () => {
    it('should allow admin participants to reply', () => {
      const admin = createContext('ADMIN');
      const result = canReplyToConversation(admin, true);

      expect(result.canSend).toBe(true);
      expect(result.reason).toBe('Admin access');
    });
  });

  describe('Talent participants', () => {
    it('should allow talent participants to reply', () => {
      const talent = createContext('TALENT');
      const result = canReplyToConversation(talent, true);

      expect(result.canSend).toBe(true);
      expect(result.reason).toContain('Replying');
    });

    it('should allow talent participants to reply regardless of subscription', () => {
      const talent = createContext('TALENT', 'NONE');
      const result = canReplyToConversation(talent, true);

      expect(result.canSend).toBe(true);
    });
  });

  describe('Professional participants', () => {
    it('should allow professional participants with active subscription to reply', () => {
      const professional = createContext('PROFESSIONAL', 'ACTIVE');
      const result = canReplyToConversation(professional, true);

      expect(result.canSend).toBe(true);
      expect(result.reason).toBe('Active subscription');
    });

    it('should not allow professional participants without subscription to reply', () => {
      const professional = createContext('PROFESSIONAL', 'NONE');
      const result = canReplyToConversation(professional, true);

      expect(result.canSend).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });

    it('should not allow professional participants with expired subscription to reply', () => {
      const professional = createContext('PROFESSIONAL', 'EXPIRED');
      const result = canReplyToConversation(professional, true);

      expect(result.canSend).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });

  describe('Company participants', () => {
    it('should allow company participants with active subscription to reply', () => {
      const company = createContext('COMPANY', 'ACTIVE');
      const result = canReplyToConversation(company, true);

      expect(result.canSend).toBe(true);
    });

    it('should not allow company participants without subscription to reply', () => {
      const company = createContext('COMPANY', 'NONE');
      const result = canReplyToConversation(company, true);

      expect(result.canSend).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });

  describe('Visitor users', () => {
    it('should not allow visitors to reply even if somehow a participant', () => {
      const visitor = createContext('VISITOR');
      const result = canReplyToConversation(visitor, true);

      expect(result.canSend).toBe(false);
      expect(result.reason).toContain('sign in');
    });
  });
});

describe('canViewConversation', () => {
  const participantIds = ['user-1', 'user-2'];

  describe('Admin users', () => {
    it('should allow admins to view any conversation', () => {
      const result = canViewConversation('admin-user', participantIds, 'ADMIN');
      expect(result).toBe(true);
    });

    it('should allow admins to view conversations they are not part of', () => {
      const result = canViewConversation('other-admin', [], 'ADMIN');
      expect(result).toBe(true);
    });
  });

  describe('Participants', () => {
    it('should allow participants to view their conversations', () => {
      const result = canViewConversation('user-1', participantIds, 'PROFESSIONAL');
      expect(result).toBe(true);
    });

    it('should allow talent participants to view their conversations', () => {
      const result = canViewConversation('user-2', participantIds, 'TALENT');
      expect(result).toBe(true);
    });
  });

  describe('Non-participants', () => {
    it('should not allow non-participants to view conversations', () => {
      const result = canViewConversation('other-user', participantIds, 'PROFESSIONAL');
      expect(result).toBe(false);
    });

    it('should not allow non-participant talents to view conversations', () => {
      const result = canViewConversation('other-talent', participantIds, 'TALENT');
      expect(result).toBe(false);
    });

    it('should not allow visitors to view conversations', () => {
      const result = canViewConversation('visitor', participantIds, 'VISITOR');
      expect(result).toBe(false);
    });
  });
});

describe('buildMessagingContext', () => {
  it('should build context with all provided fields', () => {
    const context = buildMessagingContext({
      id: 'user-123',
      role: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE',
    });

    expect(context.userId).toBe('user-123');
    expect(context.role).toBe('PROFESSIONAL');
    expect(context.subscriptionStatus).toBe('ACTIVE');
  });

  it('should default subscriptionStatus to NONE when not provided', () => {
    const context = buildMessagingContext({
      id: 'user-456',
      role: 'TALENT',
    });

    expect(context.userId).toBe('user-456');
    expect(context.role).toBe('TALENT');
    expect(context.subscriptionStatus).toBe('NONE');
  });

  it('should build context for admin without subscription', () => {
    const context = buildMessagingContext({
      id: 'admin-789',
      role: 'ADMIN',
    });

    expect(context.role).toBe('ADMIN');
    expect(context.subscriptionStatus).toBe('NONE');
  });

  it('should preserve undefined subscription status as NONE', () => {
    const context = buildMessagingContext({
      id: 'company-abc',
      role: 'COMPANY',
      subscriptionStatus: undefined,
    });

    expect(context.subscriptionStatus).toBe('NONE');
  });
});
