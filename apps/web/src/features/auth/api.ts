import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { removeToken } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';
import type { LoginRequest, RegisterRequest, LoginResponse } from './types';

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

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { old_password: string; new_password: string }) =>
      apiClient<LoginResponse>('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(data),
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
