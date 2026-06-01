export interface ClientRow {
  id: string;
  user_id: string;
  trainer_id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  goal: string | null;
  fitness_level: string | null;
  weight: number | null;
  height: number | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}
