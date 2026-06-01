import { z } from 'zod';

export const createTrainerSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  speciality: z.string().optional().or(z.literal('')),
});

export const updateTrainerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  is_active: z.boolean(),
  speciality: z.string().optional().or(z.literal('')),
});

export type CreateTrainerFormData = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerFormData = z.infer<typeof updateTrainerSchema>;
