'use client';

import { AlertDialog, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table/data-table';
import { RefreshButton } from '@/components/data-table/refresh-button';
import { useClients, useDeleteClient } from '../api';
import { ClientForm } from './client-form';
import type { ClientRow } from '../types';

export function ClientsTable() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRow | undefined>(undefined);
  const [deletingClient, setDeletingClient] = useState<ClientRow | null>(null);
  const { data, isLoading } = useClients({ page });
  const deleteClient = useDeleteClient();

  const openCreate = () => {
    setEditingClient(undefined);
    setModalOpen(true);
  };

  const openEdit = (client: ClientRow) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(undefined);
  };

  const columns: Column<ClientRow>[] = [
    { key: 'name', label: 'Nombre', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    { key: 'fitness_level', label: 'Nivel', align: 'left' },
    {
      key: 'is_active',
      label: 'Estado',
      align: 'center',
      render: (client: ClientRow) => (
        <Chip color={client.is_active ? 'success' : 'danger'} variant="soft" size="sm">
          {client.is_active ? 'Activo' : 'Inactivo'}
        </Chip>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (client: ClientRow) => (
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="secondary" onPress={() => openEdit(client)}>
            <Icon icon="lucide:pencil" className="size-4" />
            Editar
          </Button>
          <Button size="sm" variant="danger" onPress={() => setDeletingClient(client)}>
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
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <div className="flex items-center gap-2">
          <RefreshButton queryKey={['clients', { page, perPage: 20 }]} />
          <Button variant="primary" onPress={openCreate}>
            <Icon icon="lucide:plus" className="size-4" />
            Agregar cliente
          </Button>
        </div>
      </div>
      <DataTable<ClientRow>
        columns={columns}
        data={data?.data ?? []}
        page={page}
        totalPages={data?.meta.total_pages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No se encontraron clientes"
      />
      <ClientForm isOpen={modalOpen} onClose={closeModal} client={editingClient} />

      <AlertDialog.Backdrop
        isOpen={deletingClient !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingClient(null);
        }}
      >
        <AlertDialog.Container placement="center" size="sm">
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>¿Eliminar cliente?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Esto eliminará permanentemente a <strong>{deletingClient?.name}</strong> y todos sus
                datos. Esta acción no se puede deshacer.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={() => {
                  if (deletingClient) deleteClient.mutate(deletingClient.id);
                  setDeletingClient(null);
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
