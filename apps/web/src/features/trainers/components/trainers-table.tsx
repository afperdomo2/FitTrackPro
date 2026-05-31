'use client';

import { AlertDialog, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table/data-table';
import { RefreshButton } from '@/components/data-table/refresh-button';
import { useTrainers, useDeleteTrainer } from '../api';
import { TrainerForm } from './trainer-form';
import type { TrainerRow } from '../types';

export function TrainersTable() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerRow | undefined>(undefined);
  const [deletingTrainer, setDeletingTrainer] = useState<TrainerRow | null>(null);
  const { data, isLoading } = useTrainers({ page });
  const deleteTrainer = useDeleteTrainer();

  const openCreate = () => {
    setEditingTrainer(undefined);
    setModalOpen(true);
  };

  const openEdit = (trainer: TrainerRow) => {
    setEditingTrainer(trainer);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTrainer(undefined);
  };

  const columns: Column<TrainerRow>[] = [
    { key: 'name', label: 'Nombre', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'speciality', label: 'Especialidad', align: 'left' },
    {
      key: 'is_active',
      label: 'Estado',
      align: 'center',
      render: (trainer: TrainerRow) => (
        <Chip color={trainer.is_active ? 'success' : 'danger'} variant="soft" size="sm">
          {trainer.is_active ? 'Activo' : 'Inactivo'}
        </Chip>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (trainer: TrainerRow) => (
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onPress={() => openEdit(trainer)}
          >
            <Icon icon="lucide:pencil" className="size-4" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onPress={() => setDeletingTrainer(trainer)}
            isDisabled={deleteTrainer.isPending}
          >
            <Icon icon="lucide:trash-2" className="size-4" />
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Entrenadores</h1>
        <div className="flex items-center gap-2">
          <RefreshButton queryKey={['trainers', { page, perPage: 20 }]} />
          <Button variant="primary" onPress={openCreate}>
            <Icon icon="lucide:plus" className="size-4" />
            Agregar entrenador
          </Button>
        </div>
      </div>
      <DataTable<TrainerRow>
        columns={columns}
        data={data?.data ?? []}
        page={page}
        totalPages={data?.meta.total_pages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No se encontraron entrenadores"
      />
      <TrainerForm isOpen={modalOpen} onClose={closeModal} trainer={editingTrainer} />

      <AlertDialog.Backdrop
        isOpen={deletingTrainer !== null}
        onOpenChange={(open) => { if (!open) setDeletingTrainer(null); }}
      >
        <AlertDialog.Container placement="center" size="sm">
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>¿Eliminar entrenador?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Esto eliminará permanentemente a{' '}
                <strong>{deletingTrainer?.name}</strong> y todos sus datos.
                Esta acción no se puede deshacer.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">Cancelar</Button>
              <Button
                variant="danger"
                onPress={() => {
                  if (deletingTrainer) {
                    deleteTrainer.mutate(deletingTrainer.id);
                  }
                  setDeletingTrainer(null);
                }}
              >
                Eliminar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </div>
  );
}
