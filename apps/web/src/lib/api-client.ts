import { ApiError } from '@fittrackpro/shared';
import { getToken } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function apiClient<T>(
  path: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options ?? {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers: { ...headers, ...(fetchOptions.headers as Record<string, string>) },
  });

  const json = await res.json();

  if (!json.success) {
    throw new ApiError(res.status, json.message ?? 'Request failed');
  }

  return json.data as T;
}
