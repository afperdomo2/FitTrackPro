import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import type { PaginatedData } from '@fittrackpro/shared';
import type { ClientRow } from './types';

const CLIENTS_KEY = ['clients'] as const;

interface UseClientsParams {
  page?: number;
  perPage?: number;
}

export function useClients(params: UseClientsParams = {}) {
  const { page = 1, perPage = 20 } = params;
  return useQuery({
    queryKey: [...CLIENTS_KEY, { page, perPage }],
    queryFn: () => apiClient<PaginatedData<ClientRow>>(`/clients?page=${page}&per_page=${perPage}`),
    placeholderData: (prev) => prev,
  });
}

export function useCreateClient() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      name: string;
      goal?: string;
      fitness_level?: string;
      weight?: string;
      height?: string;
      birth_date?: string;
    }) =>
      apiClient<ClientRow>('/clients', {
        method: 'POST',
        body: JSON.stringify(sanitizeClientData(data)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useUpdateClient() {
  return useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      is_active: boolean;
      goal?: string;
      fitness_level?: string;
      weight?: string;
      height?: string;
      birth_date?: string;
    }) =>
      apiClient<ClientRow>(`/clients/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(sanitizeClientData(data)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useDeleteClient() {
  return useMutation({
    mutationFn: (id: string) => apiClient<void>(`/clients/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

function sanitizeClientData(data: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...data };
  for (const key of ['goal', 'fitness_level', 'weight', 'height', 'birth_date']) {
    if (!result[key] || result[key] === '') {
      result[key] = null;
    }
  }
  if ('weight' in result && result.weight !== null) {
    result.weight = Number(result.weight);
  }
  if ('height' in result && result.height !== null) {
    result.height = Number(result.height);
  }
  return result;
}
