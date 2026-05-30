import { apiClient } from '@/lib/api-client';
import { removeToken } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';
import type { LoginRequest, LoginResponse, RegisterRequest } from './types';

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      }),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      apiClient<LoginResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,
      }),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      removeToken();
      queryClient.clear();
    },
  });
}
