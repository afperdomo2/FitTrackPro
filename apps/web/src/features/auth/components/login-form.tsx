'use client';

import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
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
        toast.info('Debes cambiar tu contraseña');
      }
      router.replace('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError('root', { message });
      toast.error(message);
    }
  };

  return (
    <Card className="w-full border border-border/50 shadow-lg shadow-black/5">
      <Card.Header className="flex-col items-start gap-1 pb-2">
        <Card.Title className="text-xl font-display">Iniciar sesión</Card.Title>
        <Card.Description className="text-sm">Bienvenido de nuevo a FitTrackPro</Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="flex flex-col gap-4">
          <div className="animate-fade-in-up delay-100">
            <FormField
              control={control}
              name="email"
              label="Email"
              type="email"
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="animate-fade-in-up delay-200">
            <FormField
              control={control}
              name="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          {formState.errors.root && (
            <div className="flex items-center gap-2 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger animate-fade-in">
              <Icon icon="lucide:alert-circle" className="size-4 shrink-0" />
              <span>{formState.errors.root.message}</span>
            </div>
          )}
        </Card.Content>
        <Card.Footer className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full font-medium"
            isDisabled={formState.isSubmitting}
          >
            <Icon icon="lucide:log-in" className="size-4" />
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
