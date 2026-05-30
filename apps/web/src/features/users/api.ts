import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import type { PaginatedData } from '@/types/api';
import type { UserRow } from './types';

const USERS_KEY = ['users'] as const;

interface UseUsersParams {
  page?: number;
  perPage?: number;
}

export function useUsers(params: UseUsersParams = {}) {
  const { page = 1, perPage = 20 } = params;
  return useQuery({
    queryKey: [...USERS_KEY, { page, perPage }],
    queryFn: () => apiClient<PaginatedData<UserRow>>(`/users?page=${page}&per_page=${perPage}`),
    placeholderData: (prev) => prev,
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: string) => apiClient<void>(`/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });
}
