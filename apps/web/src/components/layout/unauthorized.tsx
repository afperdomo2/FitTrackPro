'use client';

import { Button, Card } from '@heroui/react';
import Link from 'next/link';

export function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <Card.Header>
          <Card.Title>Acceso denegado</Card.Title>
          <Card.Description>No tienes permisos para acceder a esta página.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-muted-foreground">
            Si crees que esto es un error, contacta al administrador.
          </p>
        </Card.Content>
        <Card.Footer className="flex justify-end">
          <Link href="/dashboard">
            <Button variant="primary">Ir al dashboard</Button>
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}
