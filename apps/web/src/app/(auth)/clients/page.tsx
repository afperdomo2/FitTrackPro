'use client';

import { RoleGuard } from '@/components/ui/role-guard';
import { ClientsTable } from '@/features/clients/components/clients-table';

export default function ClientsPage() {
  return (
    <RoleGuard roles="trainer">
      <ClientsTable />
    </RoleGuard>
  );
}
