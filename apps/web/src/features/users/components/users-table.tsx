'use client';

import { Button, Chip } from '@heroui/react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table/data-table';
import { useUsers, useDeleteUser } from '../api';
import type { UserRow } from '../types';

export function UsersTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers({ page });
  const deleteUser = useDeleteUser();

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rol',
      render: (user: UserRow) => (
        <Chip variant="soft" size="sm">
          {user.role}
        </Chip>
      ),
    },
    {
      key: 'is_active',
      label: 'Estado',
      render: (user: UserRow) => (
        <Chip color={user.is_active ? 'success' : 'danger'} variant="soft" size="sm">
          {user.is_active ? 'Activo' : 'Inactivo'}
        </Chip>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
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
      </div>
      <DataTable<UserRow>
        columns={columns}
        data={data?.data ?? []}
        queryKey={['users', { page, perPage: 20 }]}
        page={page}
        totalPages={data?.meta.total_pages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No se encontraron usuarios"
      />
    </div>
  );
}
