'use client';

import { hasRole, type Role } from '@fittrackpro/shared';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Unauthorized } from '@/components/layout/unauthorized';

interface RoleGuardProps {
  roles: Role | Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const { user } = useAuth();
  if (!hasRole(user?.role, roles)) return <>{fallback ?? <Unauthorized />}</>;
  return <>{children}</>;
}
