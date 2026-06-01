'use client';

import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        <div className="size-14 rounded-full bg-danger/10 flex items-center justify-center">
          <Icon icon="lucide:shield-alert" className="size-7 text-danger" />
        </div>
        <Card className="w-full max-w-sm border border-border/50 shadow-lg shadow-black/5">
          <Card.Header className="flex-col items-start gap-1 pb-2">
            <Card.Title className="text-xl font-display">Acceso denegado</Card.Title>
            <Card.Description>No tienes permisos para acceder a esta página.</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-muted-foreground">
              Si crees que esto es un error, contacta al administrador.
            </p>
          </Card.Content>
          <Card.Footer className="flex justify-end pt-2">
            <Link href="/dashboard">
              <Button variant="primary" className="font-medium">
                <Icon icon="lucide:layout-dashboard" className="size-4" />
                Ir al dashboard
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
