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
        <Card.Title>Create account</Card.Title>
        <Card.Description>Get started with FitTrackPro</Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card.Content className="flex flex-col gap-4">
          <FormField control={control} name="name" label="Full name" placeholder="John Doe" />
          <FormField
            control={control}
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
          <FormField
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
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
            {formState.isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Card.Footer>
      </form>
    </Card>
  );
}
