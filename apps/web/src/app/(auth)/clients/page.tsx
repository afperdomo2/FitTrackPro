'use client';

import { RoleGuard } from '@/components/ui/role-guard';

export default function ClientsPage() {
  return (
    <RoleGuard roles="trainer">
      <div>
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona tus clientes y su progreso.</p>
      </div>
    </RoleGuard>
  );
}
