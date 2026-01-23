import { describe, it, expect } from 'vitest';
import { Role, SubscriptionStatus } from '@prisma/client';
import {
  canCreateCollection,
  canViewCollection,
  canEditCollection,
  canDeleteCollection,
  canModifyCollectionTalents,
  canShareCollection,
  canExportCollection,
  buildCollectionContext,
} from '@/lib/collections/access';
import type { CollectionContext } from '@/lib/collections/types';

// Helper to create collection context
function createContext(
  role: Role,
  subscriptionStatus: SubscriptionStatus = 'NONE',
  userId: string = 'test-user-id'
): CollectionContext {
  return {
    userId,
    role,
    subscriptionStatus,
  };
}

describe('canCreateCollection', () => {
  describe('Admin users', () => {
    it('should allow admins to create collections', () => {
      const admin = createContext('ADMIN');
      const result = canCreateCollection(admin);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Admin access');
    });

    it('should allow admins without subscription', () => {
      const admin = createContext('ADMIN', 'NONE');
      const result = canCreateCollection(admin);

      expect(result.canAccess).toBe(true);
    });
  });

  describe('Professional users', () => {
    it('should allow professionals with active subscription', () => {
      const professional = createContext('PROFESSIONAL', 'ACTIVE');
      const result = canCreateCollection(professional);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Active subscription');
    });

    it('should allow professionals with trial subscription', () => {
      const professional = createContext('PROFESSIONAL', 'TRIAL');
      const result = canCreateCollection(professional);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Active subscription');
    });

    it('should not allow professionals without subscription', () => {
      const professional = createContext('PROFESSIONAL', 'NONE');
      const result = canCreateCollection(professional);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
      expect(result.reason).toContain('subscription');
    });

    it('should not allow professionals with expired subscription', () => {
      const professional = createContext('PROFESSIONAL', 'EXPIRED');
      const result = canCreateCollection(professional);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });

    it('should not allow professionals with cancelled subscription', () => {
      const professional = createContext('PROFESSIONAL', 'CANCELLED');
      const result = canCreateCollection(professional);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });

  describe('Company users', () => {
    it('should allow companies with active subscription', () => {
      const company = createContext('COMPANY', 'ACTIVE');
      const result = canCreateCollection(company);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Active subscription');
    });

    it('should not allow companies without subscription', () => {
      const company = createContext('COMPANY', 'NONE');
      const result = canCreateCollection(company);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });

  describe('Talent users', () => {
    it('should not allow talents to create collections', () => {
      const talent = createContext('TALENT', 'ACTIVE');
      const result = canCreateCollection(talent);

      expect(result.canAccess).toBe(false);
      expect(result.reason).toContain('Talent accounts cannot create');
    });
  });

  describe('Visitor users', () => {
    it('should not allow visitors to create collections', () => {
      const visitor = createContext('VISITOR');
      const result = canCreateCollection(visitor);

      expect(result.canAccess).toBe(false);
      expect(result.reason).toContain('sign in');
    });
  });
});

describe('canViewCollection', () => {
  const ownerId = 'owner-123';

  describe('Admin users', () => {
    it('should allow admins to view any collection', () => {
      const admin = createContext('ADMIN', 'NONE', 'admin-456');
      const result = canViewCollection(admin, ownerId);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Admin access');
    });
  });

  describe('Owner access', () => {
    it('should allow owner to view their collection', () => {
      const owner = createContext('PROFESSIONAL', 'ACTIVE', ownerId);
      const result = canViewCollection(owner, ownerId);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Collection owner');
    });

    it('should allow owner without subscription to view their collection', () => {
      const owner = createContext('PROFESSIONAL', 'NONE', ownerId);
      const result = canViewCollection(owner, ownerId);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Collection owner');
    });
  });

  describe('Non-owner access', () => {
    it('should allow non-owners with active subscription to view collections', () => {
      const other = createContext('PROFESSIONAL', 'ACTIVE', 'other-user');
      const result = canViewCollection(other, ownerId);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Active subscription');
    });

    it('should not allow non-owners without subscription to view collections', () => {
      const other = createContext('PROFESSIONAL', 'NONE', 'other-user');
      const result = canViewCollection(other, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });
});

describe('canEditCollection', () => {
  const ownerId = 'owner-123';

  describe('Admin users', () => {
    it('should allow admins to edit any collection', () => {
      const admin = createContext('ADMIN', 'NONE', 'admin-456');
      const result = canEditCollection(admin, ownerId);

      expect(result.canAccess).toBe(true);
    });
  });

  describe('Owner access', () => {
    it('should allow owner with active subscription to edit', () => {
      const owner = createContext('PROFESSIONAL', 'ACTIVE', ownerId);
      const result = canEditCollection(owner, ownerId);

      expect(result.canAccess).toBe(true);
    });

    it('should not allow owner without subscription to edit', () => {
      const owner = createContext('PROFESSIONAL', 'NONE', ownerId);
      const result = canEditCollection(owner, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });

  describe('Non-owner access', () => {
    it('should not allow non-owners to edit', () => {
      const other = createContext('PROFESSIONAL', 'ACTIVE', 'other-user');
      const result = canEditCollection(other, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.reason).toContain('only edit your own');
    });
  });
});

describe('canDeleteCollection', () => {
  const ownerId = 'owner-123';

  describe('Admin users', () => {
    it('should allow admins to delete any collection', () => {
      const admin = createContext('ADMIN', 'NONE', 'admin-456');
      const result = canDeleteCollection(admin, ownerId);

      expect(result.canAccess).toBe(true);
    });
  });

  describe('Owner access', () => {
    it('should allow owner with active subscription to delete', () => {
      const owner = createContext('PROFESSIONAL', 'ACTIVE', ownerId);
      const result = canDeleteCollection(owner, ownerId);

      expect(result.canAccess).toBe(true);
    });

    it('should not allow owner without subscription to delete', () => {
      const owner = createContext('PROFESSIONAL', 'NONE', ownerId);
      const result = canDeleteCollection(owner, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });

  describe('Non-owner access', () => {
    it('should not allow non-owners to delete', () => {
      const other = createContext('PROFESSIONAL', 'ACTIVE', 'other-user');
      const result = canDeleteCollection(other, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.reason).toContain('only edit your own');
    });
  });
});

describe('canModifyCollectionTalents', () => {
  const ownerId = 'owner-123';

  describe('Admin users', () => {
    it('should allow admins to modify any collection', () => {
      const admin = createContext('ADMIN', 'NONE', 'admin-456');
      const result = canModifyCollectionTalents(admin, ownerId);

      expect(result.canAccess).toBe(true);
    });
  });

  describe('Owner access', () => {
    it('should allow owner with active subscription to modify talents', () => {
      const owner = createContext('PROFESSIONAL', 'ACTIVE', ownerId);
      const result = canModifyCollectionTalents(owner, ownerId);

      expect(result.canAccess).toBe(true);
    });

    it('should not allow owner without subscription to modify talents', () => {
      const owner = createContext('PROFESSIONAL', 'NONE', ownerId);
      const result = canModifyCollectionTalents(owner, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });
});

describe('canShareCollection', () => {
  const ownerId = 'owner-123';

  describe('Owner access', () => {
    it('should allow owner with active subscription to share', () => {
      const owner = createContext('PROFESSIONAL', 'ACTIVE', ownerId);
      const result = canShareCollection(owner, ownerId);

      expect(result.canAccess).toBe(true);
    });

    it('should not allow owner without subscription to share', () => {
      const owner = createContext('PROFESSIONAL', 'NONE', ownerId);
      const result = canShareCollection(owner, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });
});

describe('canExportCollection', () => {
  const ownerId = 'owner-123';

  describe('Owner access', () => {
    it('should allow owner with active subscription to export', () => {
      const owner = createContext('PROFESSIONAL', 'ACTIVE', ownerId);
      const result = canExportCollection(owner, ownerId);

      expect(result.canAccess).toBe(true);
    });

    it('should not allow owner without subscription to export', () => {
      const owner = createContext('PROFESSIONAL', 'NONE', ownerId);
      const result = canExportCollection(owner, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.requiresSubscription).toBe(true);
    });
  });

  describe('Admin access', () => {
    it('should allow admins to export any collection', () => {
      const admin = createContext('ADMIN', 'NONE', 'admin-456');
      const result = canExportCollection(admin, ownerId);

      expect(result.canAccess).toBe(true);
      expect(result.reason).toBe('Admin access');
    });
  });

  describe('Non-owner access', () => {
    it('should not allow non-owners to export', () => {
      const other = createContext('PROFESSIONAL', 'ACTIVE', 'other-user');
      const result = canExportCollection(other, ownerId);

      expect(result.canAccess).toBe(false);
      expect(result.reason).toContain('only edit your own');
    });
  });
});

describe('buildCollectionContext', () => {
  it('should build context with all provided fields', () => {
    const context = buildCollectionContext({
      id: 'user-123',
      role: 'PROFESSIONAL',
      subscriptionStatus: 'ACTIVE',
    });

    expect(context.userId).toBe('user-123');
    expect(context.role).toBe('PROFESSIONAL');
    expect(context.subscriptionStatus).toBe('ACTIVE');
  });

  it('should default subscriptionStatus to NONE when not provided', () => {
    const context = buildCollectionContext({
      id: 'user-456',
      role: 'COMPANY',
    });

    expect(context.userId).toBe('user-456');
    expect(context.role).toBe('COMPANY');
    expect(context.subscriptionStatus).toBe('NONE');
  });

  it('should build context for admin without subscription', () => {
    const context = buildCollectionContext({
      id: 'admin-789',
      role: 'ADMIN',
    });

    expect(context.role).toBe('ADMIN');
    expect(context.subscriptionStatus).toBe('NONE');
  });
});
