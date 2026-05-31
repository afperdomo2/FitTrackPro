import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import type { PaginatedData } from '@fittrackpro/shared';
import type { TrainerRow } from './types';

const TRAINERS_KEY = ['trainers'] as const;

interface UseTrainersParams {
  page?: number;
  perPage?: number;
}

export function useTrainers(params: UseTrainersParams = {}) {
  const { page = 1, perPage = 20 } = params;
  return useQuery({
    queryKey: [...TRAINERS_KEY, { page, perPage }],
    queryFn: () =>
      apiClient<PaginatedData<TrainerRow>>(`/trainers?page=${page}&per_page=${perPage}`),
    placeholderData: (prev) => prev,
  });
}

export function useCreateTrainer() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string; speciality?: string }) =>
      apiClient<TrainerRow>('/trainers', {
        method: 'POST',
        body: JSON.stringify({ ...data, speciality: data.speciality || null }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINERS_KEY });
    },
  });
}

export function useUpdateTrainer() {
  return useMutation({
    mutationFn: (data: { id: string; name: string; is_active: boolean; speciality?: string }) =>
      apiClient<TrainerRow>(`/trainers/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: data.name,
          is_active: data.is_active,
          speciality: data.speciality || null,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINERS_KEY });
    },
  });
}

export function useDeleteTrainer() {
  return useMutation({
    mutationFn: (id: string) => apiClient<void>(`/trainers/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINERS_KEY });
    },
  });
}
