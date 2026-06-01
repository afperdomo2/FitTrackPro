import { z } from 'zod';

export const createClientSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  goal: z.string().optional().or(z.literal('')),
  fitness_level: z.string().optional().or(z.literal('')),
  weight: z.string().optional().or(z.literal('')),
  height: z.string().optional().or(z.literal('')),
  birth_date: z.string().optional().or(z.literal('')),
});

export const updateClientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  is_active: z.boolean(),
  goal: z.string().optional().or(z.literal('')),
  fitness_level: z.string().optional().or(z.literal('')),
  weight: z.string().optional().or(z.literal('')),
  height: z.string().optional().or(z.literal('')),
  birth_date: z.string().optional().or(z.literal('')),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
