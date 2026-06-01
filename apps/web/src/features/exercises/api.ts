import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryClient } from '@/lib/query-client';
import type { PaginatedData } from '@fittrackpro/shared';
import type { ExerciseRow } from './types';

const EXERCISES_KEY = ['exercises'] as const;

interface UseExercisesParams {
  page?: number;
  perPage?: number;
  search?: string;
  muscleGroup?: string;
  isActive?: string;
}

export function useExercises(params: UseExercisesParams = {}) {
  const { page = 1, perPage = 20, search = '', muscleGroup = '', isActive } = params;
  const query = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (search) query.set('search', search);
  if (muscleGroup) query.set('muscle_group', muscleGroup);
  if (isActive) query.set('is_active', isActive);

  return useQuery({
    queryKey: [...EXERCISES_KEY, { page, perPage, search, muscleGroup, isActive }],
    queryFn: () => apiClient<PaginatedData<ExerciseRow>>(`/exercises?${query}`),
    placeholderData: (prev) => prev,
  });
}

export function useExercise(id: string | null) {
  return useQuery({
    queryKey: [...EXERCISES_KEY, id],
    queryFn: () => apiClient<ExerciseRow>(`/exercises/${id}`),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useCreateExercise() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string | null;
      muscle_group: string;
      secondary_muscles?: string[];
      equipment?: string | null;
      video_url?: string | null;
      image_url?: string | null;
    }) =>
      apiClient<ExerciseRow>('/exercises', {
        method: 'POST',
        body: JSON.stringify(sanitizeExerciseData(data)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEY });
    },
  });
}

export function useUpdateExercise() {
  return useMutation({
    mutationFn: (data: {
      id: string;
      name: string;
      is_active: boolean;
      description?: string | null;
      muscle_group: string;
      secondary_muscles?: string[];
      equipment?: string | null;
      video_url?: string | null;
      image_url?: string | null;
    }) =>
      apiClient<ExerciseRow>(`/exercises/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(sanitizeExerciseData(data)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEY });
    },
  });
}

export function useDeleteExercise() {
  return useMutation({
    mutationFn: (id: string) => apiClient<void>(`/exercises/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEY });
    },
  });
}

function sanitizeExerciseData(data: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...data };
  for (const key of ['description', 'equipment', 'video_url', 'image_url']) {
    if (!result[key] || result[key] === '') {
      result[key] = null;
    }
  }
  if (result.is_active === undefined) {
    delete result.is_active;
  }
  return result;
}
