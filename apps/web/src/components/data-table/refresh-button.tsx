'use client';

import { useState, useCallback } from 'react';
import { Button } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';

interface RefreshButtonProps {
  queryKey: QueryKey;
}

export function RefreshButton({ queryKey }: RefreshButtonProps) {
  const queryClient = useQueryClient();
  const [cooldown, setCooldown] = useState(false);

  const handleRefresh = useCallback(() => {
    if (cooldown) return;
    queryClient.invalidateQueries({ queryKey });
    setCooldown(true);
    setTimeout(() => setCooldown(false), 1000);
  }, [queryClient, queryKey, cooldown]);

  return (
    <Button onPress={handleRefresh} isDisabled={cooldown} variant="ghost" size="sm">
      Refresh
    </Button>
  );
}
