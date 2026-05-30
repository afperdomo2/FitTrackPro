'use client';

import { Card, Chip } from '@heroui/react';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function DashboardPage() {
  const { user, token, isAuthenticated } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bienvenido de nuevo, {user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title>Rol</Card.Title>
            <Card.Description>Tu nivel de acceso actual</Card.Description>
          </Card.Header>
          <Card.Content>
            <Chip variant="soft">{user?.role}</Chip>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Email</Card.Title>
            <Card.Description>Tu correo registrado</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm">{user?.email}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Estado de la sesión</Card.Title>
            <Card.Description>Información de autenticación</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Autenticado</span>
              <Chip color={isAuthenticated ? 'success' : 'danger'} variant="soft" size="sm">
                {isAuthenticated ? 'Sí' : 'No'}
              </Chip>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Token</span>
              <Chip color={token ? 'success' : 'danger'} variant="soft" size="sm">
                {token ? 'Presente' : 'Ausente'}
              </Chip>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
