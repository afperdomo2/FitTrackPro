'use client';

import { Card, Table } from '@heroui/react';
import { RefreshButton } from './refresh-button';
import { Pagination } from './pagination';
import type { QueryKey } from '@tanstack/react-query';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  queryKey: QueryKey;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  queryKey,
  page,
  totalPages,
  onPageChange,
  isLoading,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  return (
    <Card className="w-full">
      <Card.Content className="p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <RefreshButton queryKey={queryKey} />
        </div>
        {data.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <Table aria-label="Data table">
            <Table.Header>
              {columns.map((col) => (
                <Table.Column key={col.key}>{col.label}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {data.map((item) => (
                <Table.Row key={item.id}>
                  {columns.map((col) => (
                    <Table.Cell key={col.key}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-sidebar-border">
            <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
