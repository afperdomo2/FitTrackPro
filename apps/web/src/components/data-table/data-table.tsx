'use client';

import { Card, Table } from '@heroui/react';
import { Pagination } from './pagination';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  isLoading,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  const columnMap = new Map(columns.map((col) => [col.key, col]));
  const collectionColumns = columns.map((col) => ({ id: col.key, label: col.label }));

  return (
    <Card className="w-full">
      <Card.Content className="p-0">
        {data.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <Table aria-label="Data table">
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header columns={collectionColumns}>
                  {(col: { id: string }) => {
                    const colDef = columnMap.get(col.id);
                    return (
                      <Table.Column
                        id={col.id}
                        isRowHeader={col.id === 'name'}
                        className={`text-${colDef?.align ?? 'center'}`}
                      >
                        {colDef?.label}
                      </Table.Column>
                    );
                  }}
                </Table.Header>
                <Table.Body>
                  <Table.Collection items={data}>
                    {(item: T) => (
                      <Table.Row id={String(item.id)}>
                        <Table.Collection items={collectionColumns}>
                          {(col: { id: string }) => {
                            const colDef = columnMap.get(col.id);
                            return (
                              <Table.Cell
                                className={`text-${colDef?.align ?? 'center'}`}
                              >
                                {colDef?.render
                                  ? colDef.render(item)
                                  : String(
                                      (item as Record<string, unknown>)[col.id] ?? '',
                                    )}
                              </Table.Cell>
                            );
                          }}
                        </Table.Collection>
                      </Table.Row>
                    )}
                  </Table.Collection>
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
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
