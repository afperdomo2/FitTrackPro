import { Button, Card } from '@heroui/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Page not found</Card.Title>
          <Card.Description>The page you&apos;re looking for doesn&apos;t exist.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm">You may have mistyped the address or the page has been moved.</p>
        </Card.Content>
        <Card.Footer className="flex justify-end">
          <Link href="/">
            <Button variant="primary">Go home</Button>
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}
