'use client';

import { RoleGuard } from '@/components/ui/role-guard';

export default function WorkoutsPage() {
  return (
    <RoleGuard roles="trainer">
      <div>
        <h1 className="text-2xl font-semibold">Entrenamientos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Crea y asigna rutinas de entrenamiento.
        </p>
      </div>
    </RoleGuard>
  );
}
