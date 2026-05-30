'use client';

import { Button } from '@heroui/react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button size="sm" variant="ghost" isDisabled={page <= 1} onPress={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        size="sm"
        variant="ghost"
        isDisabled={page >= totalPages}
        onPress={() => onChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
