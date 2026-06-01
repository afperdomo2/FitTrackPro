'use client';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        isDisabled={page <= 1}
        onPress={() => onChange(page - 1)}
        className="transition-colors"
      >
        <Icon icon="lucide:chevron-left" className="size-4" />
        Anterior
      </Button>
      <span className="text-sm text-muted-foreground">
        Página <span className="text-accent font-semibold">{page}</span> de{' '}
        <span className="text-foreground font-medium">{totalPages}</span>
      </span>
      <Button
        size="sm"
        variant="ghost"
        isDisabled={page >= totalPages}
        onPress={() => onChange(page + 1)}
        className="transition-colors"
      >
        Siguiente
        <Icon icon="lucide:chevron-right" className="size-4" />
      </Button>
    </div>
  );
}
