import { describe, it, expect } from 'vitest';
import type { ContactRequestStatus } from '@prisma/client';
import {
  canCreateContactRequest,
  canViewContactRequest,
  canRespondToContactRequest,
  checkRateLimit,
  canViewRevealedContactInfo,
  validateContactRequestInput,
  hasPendingRequestToTalent,
  talentCanBeContacted,
  MAX_PENDING_REQUESTS_PER_DAY,
} from '@/lib/contact-requests/access';

describe('canCreateContactRequest', () => {
  describe('Role validation', () => {
    it('should allow PROFESSIONAL with active subscription and approved validation', () => {
      const result = canCreateContactRequest({
        role: 'PROFESSIONAL',
        subscriptionStatus: 'ACTIVE',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(true);
      expect(result.canView).toBe(true);
    });

    it('should allow COMPANY with active subscription and approved validation', () => {
      const result = canCreateContactRequest({
        role: 'COMPANY',
        subscriptionStatus: 'ACTIVE',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(true);
    });

    it('should not allow TALENT to create contact requests', () => {
      const result = canCreateContactRequest({
        role: 'TALENT',
        subscriptionStatus: 'ACTIVE',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain('Only professionals and companies');
    });

    it('should not allow VISITOR to create contact requests', () => {
      const result = canCreateContactRequest({
        role: 'VISITOR',
        subscriptionStatus: 'NONE',
        validationStatus: 'PENDING',
      });

      expect(result.canCreate).toBe(false);
    });

    it('should not allow ADMIN to create contact requests through this path', () => {
      const result = canCreateContactRequest({
        role: 'ADMIN',
        subscriptionStatus: 'NONE',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(false);
    });
  });

  describe('Subscription validation', () => {
    it('should not allow users without subscription', () => {
      const result = canCreateContactRequest({
        role: 'PROFESSIONAL',
        subscriptionStatus: 'NONE',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(false);
      expect(result.canView).toBe(true);
      expect(result.reason).toContain('active subscription');
    });

    it('should allow users with TRIAL subscription', () => {
      const result = canCreateContactRequest({
        role: 'PROFESSIONAL',
        subscriptionStatus: 'TRIAL',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(true);
    });

    it('should allow users with PAST_DUE subscription', () => {
      const result = canCreateContactRequest({
        role: 'PROFESSIONAL',
        subscriptionStatus: 'PAST_DUE',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(true);
    });

    it('should not allow users with EXPIRED subscription', () => {
      const result = canCreateContactRequest({
        role: 'PROFESSIONAL',
        subscriptionStatus: 'EXPIRED',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(false);
    });

    it('should not allow users with CANCELLED subscription', () => {
      const result = canCreateContactRequest({
        role: 'PROFESSIONAL',
        subscriptionStatus: 'CANCELLED',
        validationStatus: 'APPROVED',
      });

      expect(result.canCreate).toBe(false);
    });
  });

  describe('Validation status', () => {
    it('should not allow users with PENDING validation', () => {
      const result = canCreateContactRequest({
        role: 'PROFESSIONAL',
        subscriptionStatus: 'ACTIVE',
        validationStatus: 'PENDING',
      });

      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain('must be approved');
    });

    it('should not allow users with REJECTED validation', () => {
      const result = canCreateContactRequest({
        role: 'COMPANY',
        subscriptionStatus: 'ACTIVE',
        validationStatus: 'REJECTED',
      });

      expect(result.canCreate).toBe(false);
    });
  });
});

describe('canViewContactRequest', () => {
  it('should allow admins to view any request', () => {
    const result = canViewContactRequest('admin-user', 'ADMIN', 'requester-user', 'talent-user');

    expect(result.canView).toBe(true);
    expect(result.reason).toBe('Admin access');
  });

  it('should allow requester to view their own request', () => {
    const result = canViewContactRequest(
      'requester-user',
      'PROFESSIONAL',
      'requester-user',
      'talent-user'
    );

    expect(result.canView).toBe(true);
    expect(result.canRespond).toBe(false);
  });

  it('should allow talent to view requests sent to them', () => {
    const result = canViewContactRequest('talent-user', 'TALENT', 'requester-user', 'talent-user');

    expect(result.canView).toBe(true);
    expect(result.canRespond).toBe(true);
  });

  it('should not allow other users to view requests', () => {
    const result = canViewContactRequest(
      'other-user',
      'PROFESSIONAL',
      'requester-user',
      'talent-user'
    );

    expect(result.canView).toBe(false);
    expect(result.canRespond).toBe(false);
    expect(result.reason).toContain('not have permission');
  });
});

describe('canRespondToContactRequest', () => {
  it('should allow talent to respond to pending requests', () => {
    const result = canRespondToContactRequest('talent-user', 'talent-user', 'PENDING');

    expect(result.canRespond).toBe(true);
  });

  it('should not allow non-talent to respond', () => {
    const result = canRespondToContactRequest('other-user', 'talent-user', 'PENDING');

    expect(result.canRespond).toBe(false);
    expect(result.reason).toContain('Only the talent');
  });

  it('should not allow response to already approved requests', () => {
    const result = canRespondToContactRequest('talent-user', 'talent-user', 'APPROVED');

    expect(result.canRespond).toBe(false);
    expect(result.reason).toContain('already been responded');
  });

  it('should not allow response to declined requests', () => {
    const result = canRespondToContactRequest('talent-user', 'talent-user', 'DECLINED');

    expect(result.canRespond).toBe(false);
  });
});

describe('checkRateLimit', () => {
  it('should allow when under rate limit', () => {
    const result = checkRateLimit(3);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(MAX_PENDING_REQUESTS_PER_DAY - 3);
  });

  it('should allow when at zero requests', () => {
    const result = checkRateLimit(0);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(MAX_PENDING_REQUESTS_PER_DAY);
  });

  it('should not allow when at rate limit', () => {
    const result = checkRateLimit(MAX_PENDING_REQUESTS_PER_DAY);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.reason).toContain('Rate limit reached');
  });

  it('should not allow when over rate limit', () => {
    const result = checkRateLimit(MAX_PENDING_REQUESTS_PER_DAY + 1);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should calculate reset time when oldest date provided', () => {
    const oldestDate = new Date(Date.now() - 12 * 60 * 60 * 1000); // 12 hours ago
    const result = checkRateLimit(MAX_PENDING_REQUESTS_PER_DAY, oldestDate);

    expect(result.allowed).toBe(false);
    expect(result.resetAt).toBeDefined();
    expect(result.resetAt!.getTime()).toBeGreaterThan(Date.now());
  });
});

describe('canViewRevealedContactInfo', () => {
  it('should allow requester to view approved request contact info', () => {
    const result = canViewRevealedContactInfo('requester-user', 'requester-user', 'APPROVED');

    expect(result).toBe(true);
  });

  it('should not allow non-requester to view contact info', () => {
    const result = canViewRevealedContactInfo('other-user', 'requester-user', 'APPROVED');

    expect(result).toBe(false);
  });

  it('should not allow viewing contact info for pending requests', () => {
    const result = canViewRevealedContactInfo('requester-user', 'requester-user', 'PENDING');

    expect(result).toBe(false);
  });

  it('should not allow viewing contact info for declined requests', () => {
    const result = canViewRevealedContactInfo('requester-user', 'requester-user', 'DECLINED');

    expect(result).toBe(false);
  });
});

describe('validateContactRequestInput', () => {
  it('should accept valid purpose with minimum length', () => {
    const result = validateContactRequestInput({
      purpose: 'a'.repeat(50),
    });

    expect(result.valid).toBe(true);
  });

  it('should accept valid purpose and message', () => {
    const result = validateContactRequestInput({
      purpose: 'a'.repeat(100),
      message: 'Hello, I would like to discuss a project.',
    });

    expect(result.valid).toBe(true);
  });

  it('should reject purpose under minimum length', () => {
    const result = validateContactRequestInput({
      purpose: 'a'.repeat(49),
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 50 characters');
  });

  it('should reject empty purpose', () => {
    const result = validateContactRequestInput({
      purpose: '',
    });

    expect(result.valid).toBe(false);
  });

  it('should reject purpose over maximum length', () => {
    const result = validateContactRequestInput({
      purpose: 'a'.repeat(2001),
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceed 2000 characters');
  });

  it('should reject message over maximum length', () => {
    const result = validateContactRequestInput({
      purpose: 'a'.repeat(100),
      message: 'a'.repeat(1001),
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceed 1000 characters');
  });

  it('should trim whitespace from purpose', () => {
    const result = validateContactRequestInput({
      purpose: '   ' + 'a'.repeat(45) + '   ', // 45 chars when trimmed
    });

    expect(result.valid).toBe(false);
    expect(result.error).toContain('at least 50 characters');
  });
});

describe('hasPendingRequestToTalent', () => {
  it('should return true when there is a pending request', () => {
    const requests = [
      { status: 'PENDING' as ContactRequestStatus },
      { status: 'APPROVED' as ContactRequestStatus },
    ];

    expect(hasPendingRequestToTalent(requests)).toBe(true);
  });

  it('should return false when there are no pending requests', () => {
    const requests = [
      { status: 'APPROVED' as ContactRequestStatus },
      { status: 'DECLINED' as ContactRequestStatus },
    ];

    expect(hasPendingRequestToTalent(requests)).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(hasPendingRequestToTalent([])).toBe(false);
  });
});

describe('talentCanBeContacted', () => {
  it('should return true when talent has email', () => {
    expect(
      talentCanBeContacted({
        contactEmail: 'talent@example.com',
        contactPhone: null,
      })
    ).toBe(true);
  });

  it('should return true when talent has phone', () => {
    expect(
      talentCanBeContacted({
        contactEmail: null,
        contactPhone: '+1234567890',
      })
    ).toBe(true);
  });

  it('should return true when talent has both', () => {
    expect(
      talentCanBeContacted({
        contactEmail: 'talent@example.com',
        contactPhone: '+1234567890',
      })
    ).toBe(true);
  });

  it('should return false when talent has no contact info', () => {
    expect(
      talentCanBeContacted({
        contactEmail: null,
        contactPhone: null,
      })
    ).toBe(false);
  });
});
