export interface ExerciseRow {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  muscle_group: string;
  secondary_muscles: string[];
  equipment: string | null;
  video_url: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateExerciseInput {
  name: string;
  muscle_group: string;
  description?: string | null;
  secondary_muscles?: string[];
  equipment?: string | null;
  video_url?: string | null;
  image_url?: string | null;
}

export interface UpdateExerciseInput {
  name?: string;
  description?: string | null;
  muscle_group?: string;
  secondary_muscles?: string[];
  equipment?: string | null;
  video_url?: string | null;
  image_url?: string | null;
  is_active?: boolean;
}

export const MUSCLE_GROUPS = [
  { value: 'chest', label: 'Pecho' },
  { value: 'back', label: 'Espalda' },
  { value: 'legs', label: 'Pierna' },
  { value: 'shoulders', label: 'Hombro' },
  { value: 'arms', label: 'Brazos' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'full_body', label: 'Cuerpo completo' },
] as const;

export const MUSCLE_GROUP_COLORS: Record<
  string,
  'default' | 'success' | 'danger' | 'warning' | 'accent'
> = {
  chest: 'danger',
  back: 'accent',
  legs: 'success',
  shoulders: 'warning',
  arms: 'default',
  core: 'default',
  cardio: 'accent',
  full_body: 'default',
};
