'use client';

import { RoleGuard } from '@/components/ui/role-guard';
import { TrainersTable } from '@/features/trainers/components/trainers-table';

export default function TrainersPage() {
  return (
    <RoleGuard roles="admin">
      <TrainersTable />
    </RoleGuard>
  );
}
