export type Role = 'admin' | 'trainer' | 'client';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  must_change_password: boolean;
  user: User;
}

export interface JwtClaims {
  user_id: string;
  email: string;
  role: Role;
  must_change_password: boolean;
  exp: number;
  iat: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
