'use client';

import { hasRole, type Role } from '@fittrackpro/shared';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface RoleGuardProps {
  roles: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  if (!hasRole(user?.role, roles)) return <>{fallback}</>;
  return <>{children}</>;
}
