import { Role, SubscriptionStatus, Gender, Physique } from '@prisma/client';

// Collection preview for list display
export interface CollectionPreview {
  id: string;
  name: string;
  description: string | null;
  talentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Talent info within a collection (public fields only)
export interface CollectionTalentInfo {
  id: string;
  talentProfileId: string;
  firstName: string;
  photo: string | null;
  gender: Gender;
  ageRangeMin: number;
  ageRangeMax: number;
  location: string | null;
  physique: Physique | null;
  addedAt: Date;
}

// Full collection with talents
export interface CollectionWithTalents {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  talents: CollectionTalentInfo[];
  createdAt: Date;
  updatedAt: Date;
}

// Share link info
export interface CollectionShareInfo {
  id: string;
  token: string;
  expiresAt: Date | null;
  createdAt: Date;
  collectionId: string;
}

// User context for collection access checks
export interface CollectionContext {
  userId: string;
  role: Role;
  subscriptionStatus: SubscriptionStatus;
}

// Result of checking collection access
export interface CollectionAccessResult {
  canAccess: boolean;
  reason?: string;
  requiresSubscription?: boolean;
}

// Input for creating a collection
export interface CreateCollectionInput {
  name: string;
  description?: string;
}

// Result of creating a collection
export interface CreateCollectionResult {
  success: boolean;
  collection?: CollectionPreview;
  error?: string;
}

// Result of updating a collection
export interface UpdateCollectionResult {
  success: boolean;
  collection?: CollectionPreview;
  error?: string;
}

// Result of deleting a collection
export interface DeleteCollectionResult {
  success: boolean;
  error?: string;
}

// Result of adding/removing talents
export interface ModifyTalentsResult {
  success: boolean;
  addedCount?: number;
  removedCount?: number;
  error?: string;
}

// Result of generating a share link
export interface GenerateShareLinkResult {
  success: boolean;
  shareLink?: CollectionShareInfo;
  error?: string;
}

// Result of revoking a share link
export interface RevokeShareLinkResult {
  success: boolean;
  error?: string;
}

// CSV export data structure
export interface CollectionExportData {
  collectionName: string;
  exportedAt: string;
  talents: Array<{
    firstName: string;
    gender: string;
    ageRange: string;
    location: string;
    physique: string;
  }>;
}
