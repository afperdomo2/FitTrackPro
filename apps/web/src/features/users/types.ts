import type { Role } from '@fittrackpro/shared';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
