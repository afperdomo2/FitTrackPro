import { z } from 'zod';

export const createExerciseSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional().or(z.literal('')),
  muscle_group: z.string().min(1, 'Selecciona un grupo muscular'),
  secondary_muscles: z.string().optional().or(z.literal('')),
  equipment: z.string().optional().or(z.literal('')),
  video_url: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
});

export const updateExerciseSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  is_active: z.boolean(),
  description: z.string().optional().or(z.literal('')),
  muscle_group: z.string().min(1, 'Selecciona un grupo muscular'),
  secondary_muscles: z.string().optional().or(z.literal('')),
  equipment: z.string().optional().or(z.literal('')),
  video_url: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
});

export type CreateExerciseFormData = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseFormData = z.infer<typeof updateExerciseSchema>;
