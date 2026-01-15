import { z } from "zod";

// Profile type for validation actions
export const ProfileTypeSchema = z.enum(["talent", "professional", "company"]);

// Approve profile schema
export const approveProfileSchema = z.object({
  profileId: z.string().min(1, "Profile ID is required"),
  profileType: ProfileTypeSchema,
});

// Reject profile schema - requires reason
export const rejectProfileSchema = z.object({
  profileId: z.string().min(1, "Profile ID is required"),
  profileType: ProfileTypeSchema,
  reason: z
    .string()
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Rejection reason must be under 500 characters"),
});

// Toggle user status schema
export const toggleUserStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  isActive: z.boolean(),
});

// User filter schema for listing
export const userFilterSchema = z.object({
  role: z.enum(["ALL", "TALENT", "PROFESSIONAL", "COMPANY", "VISITOR", "ADMIN"]).default("ALL"),
  status: z.enum(["ALL", "ACTIVE", "INACTIVE"]).default("ALL"),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

// Validation queue filter schema
export const validationFilterSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "SUSPENDED"]).default("PENDING"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

// Type exports
export type ProfileType = z.infer<typeof ProfileTypeSchema>;
export type ApproveProfileInput = z.infer<typeof approveProfileSchema>;
export type RejectProfileInput = z.infer<typeof rejectProfileSchema>;
export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
export type ValidationFilterInput = z.infer<typeof validationFilterSchema>;
