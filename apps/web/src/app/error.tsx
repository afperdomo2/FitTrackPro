'use client';

import { Button, Card } from '@heroui/react';

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
          <Card.Title>Something went wrong</Card.Title>
          <Card.Description>{error.message}</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
        </Card.Content>
        <Card.Footer className="flex justify-end">
          <Button onPress={reset} variant="primary">
            Try again
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
