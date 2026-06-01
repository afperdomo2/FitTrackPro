import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = 'lucide:inbox', title, description, action }: EmptyStateProps) {
  return (
    <Card className="w-full max-w-md mx-auto border border-border/50 shadow-sm">
      <Card.Content className="flex flex-col items-center gap-4 py-16 px-8">
        <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon icon={icon} className="size-6 text-accent" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-lg text-foreground">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </Card.Content>
    </Card>
  );
}
