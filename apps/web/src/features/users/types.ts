import type { Role } from '@/types/api';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
