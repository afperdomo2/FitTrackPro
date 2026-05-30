'use client';

import { Chip } from '@heroui/react';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-sidebar-border bg-background shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{user?.name}</span>
        <Chip variant="soft" size="sm">
          {user?.role}
        </Chip>
      </div>
    </header>
  );
}
