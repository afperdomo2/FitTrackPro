import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Página no encontrada</Card.Title>
          <Card.Description>La página que buscas no existe.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm">
            Puede que hayas escrito mal la dirección o la página haya sido movida.
          </p>
        </Card.Content>
        <Card.Footer className="flex justify-end">
          <Link href="/">
            <Button variant="primary">
              <Icon icon="lucide:home" className="size-4" />
              Ir al inicio
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}
