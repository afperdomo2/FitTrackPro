'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Card } from '@heroui/react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('change_password') === 'required') {
      toast.info('Debes cambiar tu contraseña antes de continuar');
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-tight">Perfil</h1>
        <p className="text-sm text-muted-foreground">Detalles de tu cuenta</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="w-full border border-border/50 shadow-sm animate-fade-in-up delay-100">
          <Card.Header className="flex-col items-start gap-1 pb-2">
            <Card.Title className="font-display">Información de la cuenta</Card.Title>
            <Card.Description>Gestiona los detalles de tu perfil</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xl font-semibold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="space-y-3 pt-1 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Icon icon="lucide:mail" className="size-3" />
                  Email
                </p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <div className="animate-fade-in-up delay-200">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
