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
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (user: UserRow) => (
        <Chip variant="soft" size="sm">
          {user.role}
        </Chip>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (user: UserRow) => (
        <Chip color={user.is_active ? 'success' : 'danger'} variant="soft" size="sm">
          {user.is_active ? 'Active' : 'Inactive'}
        </Chip>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: UserRow) => (
        <Button
          size="sm"
          variant="danger"
          onPress={() => deleteUser.mutate(user.id)}
          isDisabled={deleteUser.isPending}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
      </div>
      <DataTable<UserRow>
        columns={columns}
        data={data?.data ?? []}
        queryKey={['users', { page, perPage: 20 }]}
        page={page}
        totalPages={data?.meta.total_pages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No users found"
      />
    </div>
  );
}
