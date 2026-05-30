'use client';

import { Button, Card } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth';
import { registerSchema, type RegisterFormData } from '../validators';
import { FormField } from '@/components/form/form-field';

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, setError, formState } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      router.replace('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Crear cuenta</Card.Title>
        <Card.Description>Comienza con FitTrackPro</Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="flex flex-col gap-4">
          <FormField
            control={control}
            name="name"
            label="Nombre completo"
            placeholder="Juan Pérez"
          />
          <FormField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="tu@correo.com"
          />
          <FormField
            control={control}
            name="password"
            label="Contraseña"
            type="password"
            placeholder="Mín. 8 caracteres"
          />
          {formState.errors.root && (
            <p className="text-sm text-danger">{formState.errors.root.message}</p>
          )}
        </Card.Content>
        <Card.Footer className="flex flex-col gap-3">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isDisabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-accent font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </Card.Footer>
      </form>
    </Card>
  );
}
