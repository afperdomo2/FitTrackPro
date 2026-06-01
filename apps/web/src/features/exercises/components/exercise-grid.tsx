'use client';

import { AlertDialog, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { RefreshButton } from '@/components/data-table/refresh-button';
import { EmptyState } from '@/components/layout/empty-state';
import { Pagination } from '@/components/data-table/pagination';
import { useExercises, useDeleteExercise } from '../api';
import { ExerciseCard } from './exercise-card';
import { ExerciseForm } from './exercise-form';
import { MUSCLE_GROUPS, type ExerciseRow } from '../types';

export function ExerciseGrid() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [deletingExercise, setDeletingExercise] = useState<ExerciseRow | null>(null);
  const perPage = 20;

  const { data, isLoading } = useExercises({
    page,
    perPage,
    search,
    muscleGroup,
    isActive: isActiveFilter || undefined,
  });

  const deleteExercise = useDeleteExercise();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const openCreate = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  const openEdit = (exercise: ExerciseRow) => {
    setEditingId(exercise.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(undefined);
  };

  const handleDelete = () => {
    if (deletingExercise) {
      deleteExercise.mutate(deletingExercise.id);
      setDeletingExercise(null);
    }
  };

  const exercises = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.total_pages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ejercicios</h1>
        <div className="flex items-center gap-2">
          <RefreshButton
            queryKey={[
              'exercises',
              { page, perPage, search, muscleGroup, isActive: isActiveFilter || undefined },
            ]}
          />
          <Button variant="primary" onPress={openCreate}>
            <Icon icon="lucide:plus" className="size-4" />
            Nuevo ejercicio
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Icon
            icon="lucide:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-sidebar-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <select
          value={muscleGroup}
          onChange={(e) => {
            setMuscleGroup(e.target.value);
            setPage(1);
          }}
          className="text-sm rounded-lg border border-sidebar-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Grupo: Todos</option>
          {MUSCLE_GROUPS.map((mg) => (
            <option key={mg.value} value={mg.value}>
              {mg.label}
            </option>
          ))}
        </select>

        <select
          value={isActiveFilter}
          onChange={(e) => {
            setIsActiveFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm rounded-lg border border-sidebar-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Estado: Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-muted animate-pulse h-52" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <EmptyState
          title="No se encontraron ejercicios"
          description={
            search || muscleGroup ? 'Intenta con otros filtros' : 'Crea tu primer ejercicio'
          }
          action={
            !search && !muscleGroup ? (
              <Button variant="primary" onPress={openCreate}>
                <Icon icon="lucide:plus" className="size-4" />
                Crear ejercicio
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onEdit={openEdit}
              onDelete={setDeletingExercise}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}

      <ExerciseForm isOpen={modalOpen} onClose={closeModal} exerciseId={editingId} />

      <AlertDialog.Backdrop
        isOpen={deletingExercise !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingExercise(null);
        }}
      >
        <AlertDialog.Container placement="center" size="sm">
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>¿Eliminar ejercicio?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Esto eliminará permanentemente <strong>{deletingExercise?.name}</strong>. Esta
                acción no se puede deshacer.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancelar
              </Button>
              <Button variant="danger" onPress={handleDelete}>
                Eliminar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
