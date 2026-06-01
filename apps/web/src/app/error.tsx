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
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        <div className="size-14 rounded-full bg-danger/10 flex items-center justify-center">
          <Icon icon="lucide:alert-triangle" className="size-7 text-danger" />
        </div>
        <Card className="w-full max-w-md border border-border/50 shadow-lg shadow-black/5">
          <Card.Header className="flex-col items-start gap-1 pb-2">
            <Card.Title className="text-xl font-display">Algo salió mal</Card.Title>
            <Card.Description>{error.message}</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-muted-foreground">
              Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
            </p>
          </Card.Content>
          <Card.Footer className="flex justify-end pt-2">
            <Button onPress={reset} variant="primary" className="font-medium">
              <Icon icon="lucide:refresh-cw" className="size-4" />
              Reintentar
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
