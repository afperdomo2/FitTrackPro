'use client';

import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Algo salió mal</Card.Title>
          <Card.Description>{error.message}</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-muted-foreground">
            Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
          </p>
        </Card.Content>
        <Card.Footer className="flex justify-end">
          <Button onPress={reset} variant="primary">
            <Icon icon="lucide:refresh-cw" className="size-4" />
            Reintentar
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
