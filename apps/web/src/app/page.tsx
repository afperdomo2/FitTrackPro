import { Button, Card, Chip } from '@heroui/react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-8 gap-8">
      <div className="flex gap-2">
        <Chip>HeroUI</Chip>
        <Chip color="accent">React</Chip>
        <Chip color="success" variant="soft">
          v3
        </Chip>
      </div>

      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Welcome to FitTrackPro</Card.Title>
          <Card.Description>Your fitness tracking companion</Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <p className="text-sm">
            Track your workouts, monitor progress, and achieve your fitness goals.
          </p>
        </Card.Content>
        <Card.Footer className="flex justify-end gap-2">
          <Button variant="ghost">Learn More</Button>
          <Button variant="primary">Get Started</Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
