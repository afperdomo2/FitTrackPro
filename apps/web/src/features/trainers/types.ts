export interface TrainerRow {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  speciality: string | null;
  created_at: string;
  updated_at: string;
}
