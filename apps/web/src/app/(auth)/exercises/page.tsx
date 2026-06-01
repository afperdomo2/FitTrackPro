'use client';
import { RoleGuard } from '@/components/ui/role-guard';
import { ExerciseGrid } from '@/features/exercises/components/exercise-grid';

export default function ExercisesPage() {
  return (
    <RoleGuard roles="trainer">
      <ExerciseGrid />
    </RoleGuard>
  );
}
