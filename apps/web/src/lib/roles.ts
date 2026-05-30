import type { Role } from '@/types/api';

export const ROLES = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  CLIENT: 'client',
} as const satisfies Record<string, Role>;

export function hasRole(userRole: Role | undefined, allowed: Role | Role[]): boolean {
  if (!userRole) return false;
  if (Array.isArray(allowed)) return allowed.includes(userRole);
  return userRole === allowed;
}
