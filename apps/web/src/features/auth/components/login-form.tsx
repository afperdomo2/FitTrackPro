'use client';

import { Button, Card } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth';
import { loginSchema, type LoginFormData } from '../validators';
import { FormField } from '@/components/form/form-field';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, setError, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data);
      if (result.must_change_password) {
        toast.info('You must change your password');
      }
      router.replace('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Iniciar sesión</Card.Title>
        <Card.Description>Bienvenido de nuevo a FitTrackPro</Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="flex flex-col gap-4">
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
            placeholder="••••••••"
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
            {formState.isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-accent font-medium hover:underline">
              Registrarse
            </Link>
          </p>
        </Card.Footer>
      </form>
    </Card>
  );
}
