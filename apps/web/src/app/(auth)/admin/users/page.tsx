'use client';

import { RoleGuard } from '@/components/ui/role-guard';
import { UsersTable } from '@/features/users/components/users-table';

export default function AdminUsersPage() {
  return (
    <RoleGuard roles="admin">
      <UsersTable />
    </RoleGuard>
  );
}
