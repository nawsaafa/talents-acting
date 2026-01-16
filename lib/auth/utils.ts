import { auth } from './auth';
import type { Role } from '@prisma/client';

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<Role, number> = {
  VISITOR: 0,
  TALENT: 1,
  PROFESSIONAL: 2,
  COMPANY: 2,
  ADMIN: 99,
};

/**
 * Check if a user has the required role
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user is an admin
 */
export function isAdmin(role: Role): boolean {
  return role === 'ADMIN';
}

/**
 * Check if user can access premium content (professionals, companies, admins)
 */
export function canAccessPremium(role: Role): boolean {
  return ['PROFESSIONAL', 'COMPANY', 'ADMIN'].includes(role);
}

/**
 * Check if user is authenticated (not a visitor)
 */
export function isAuthenticated(role: Role): boolean {
  return role !== 'VISITOR';
}

/**
 * Get current session (server-side)
 * Use this in server components and API routes
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require authentication - throws if not authenticated
 * Use in server actions and API routes
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

/**
 * Require specific role - throws if not authorized
 * Use in server actions and API routes
 */
export async function requireRole(requiredRole: Role) {
  const user = await requireAuth();
  if (!hasRole(user.role, requiredRole)) {
    throw new Error('Insufficient permissions');
  }
  return user;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (!isAdmin(user.role)) {
    throw new Error('Admin access required');
  }
  return user;
}

/**
 * Protected route helper for server components
 * Returns user if authenticated, null otherwise
 */
export async function protectedRoute() {
  try {
    return await requireAuth();
  } catch {
    return null;
  }
}
