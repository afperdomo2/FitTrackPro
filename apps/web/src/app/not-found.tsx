import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8">
      <div className="flex flex-col items-center gap-6 animate-scale-in">
        <div className="size-14 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon icon="lucide:file-question" className="size-7 text-accent" />
        </div>
        <Card className="w-full max-w-md border border-border/50 shadow-lg shadow-black/5">
          <Card.Header className="flex-col items-start gap-1 pb-2">
            <Card.Title className="text-xl font-display">Página no encontrada</Card.Title>
            <Card.Description>La página que buscas no existe.</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-muted-foreground">
              Puede que hayas escrito mal la dirección o la página haya sido movida.
            </p>
          </Card.Content>
          <Card.Footer className="flex justify-end pt-2">
            <Link href="/">
              <Button variant="primary" className="font-medium">
                <Icon icon="lucide:home" className="size-4" />
                Ir al inicio
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}
