import type { Role, User } from './api';

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
