'use client';

import { Button, Chip } from '@heroui/react';
import { useState } from 'react';
import { DataTable, type Column } from '@/components/data-table/data-table';
import { RefreshButton } from '@/components/data-table/refresh-button';
import { useUsers, useDeleteUser } from '../api';
import type { UserRow } from '../types';

export function UsersTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers({ page });
  const deleteUser = useDeleteUser();

  const columns: Column<UserRow>[] = [
    { key: 'name', label: 'Nombre', align: 'left' },
    { key: 'email', label: 'Email', align: 'left' },
    {
      key: 'role',
      label: 'Rol',
      align: 'center',
      render: (user: UserRow) => (
        <Chip variant="soft" size="sm">
          {user.role}
        </Chip>
      ),
    },
    {
      key: 'is_active',
      label: 'Estado',
      align: 'center',
      render: (user: UserRow) => (
        <Chip color={user.is_active ? 'success' : 'danger'} variant="soft" size="sm">
          {user.is_active ? 'Activo' : 'Inactivo'}
        </Chip>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (user: UserRow) => (
        <Button
          size="sm"
          variant="danger"
          onPress={() => deleteUser.mutate(user.id)}
          isDisabled={deleteUser.isPending}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <RefreshButton queryKey={['users', { page, perPage: 20 }]} />
      </div>
      <DataTable<UserRow>
        columns={columns}
        data={data?.data ?? []}
        page={page}
        totalPages={data?.meta.total_pages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No se encontraron usuarios"
      />
    </div>
  );
}
