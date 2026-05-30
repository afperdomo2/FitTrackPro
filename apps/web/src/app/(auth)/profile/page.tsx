'use client';

import { Card, Button } from '@heroui/react';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account details</p>
      </div>

      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Account information</Card.Title>
          <Card.Description>Manage your profile details</Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-sm font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-sm font-medium capitalize">{user?.role}</p>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button variant="ghost" isDisabled>
            Edit profile
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
