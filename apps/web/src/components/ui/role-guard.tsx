'use client';

import type { Role } from '@/types/api';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { hasRole } from '@/lib/roles';

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
