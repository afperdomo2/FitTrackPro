'use client';

import { RoleGuard } from '@/components/ui/role-guard';

export default function TrainersPage() {
  return (
    <RoleGuard roles="admin">
      <div>
        <h1 className="text-2xl font-semibold">Entrenadores</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administra los entrenadores del sistema.
        </p>
      </div>
    </RoleGuard>
  );
}
