import { Card } from '@heroui/react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <Card.Content className="flex flex-col items-center gap-3 py-12">
        <p className="font-semibold text-lg">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </Card.Content>
    </Card>
  );
}
