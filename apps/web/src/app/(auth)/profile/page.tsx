'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Perfil</h1>
        <p className="text-sm text-muted-foreground">Detalles de tu cuenta</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="w-full">
          <Card.Header>
            <Card.Title>Información de la cuenta</Card.Title>
            <Card.Description>Gestiona los detalles de tu perfil</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Nombre</p>
              <p className="text-sm font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rol</p>
              <p className="text-sm font-medium capitalize">{user?.role}</p>
            </div>
          </Card.Content>
        </Card>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
