'use client';

import { Card, Chip } from '@heroui/react';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <Card.Header>
            <Card.Title>Role</Card.Title>
            <Card.Description>Your current access level</Card.Description>
          </Card.Header>
          <Card.Content>
            <Chip variant="soft">{user?.role}</Chip>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Email</Card.Title>
            <Card.Description>Your registered email</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm">{user?.email}</p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
