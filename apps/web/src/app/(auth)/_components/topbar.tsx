'use client';

import { useRouter } from 'next/navigation';
import { Avatar, Button, Dropdown, Label } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-background shrink-0">
      <Breadcrumb />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Dropdown>
          <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 h-auto">
            <Avatar size="sm">
              <Avatar.Fallback>
                <span className="text-xs font-semibold text-accent">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </Avatar.Fallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Icon
              icon="lucide:chevron-down"
              className="size-3.5 text-muted-foreground hidden sm:block"
            />
          </Button>
          <Dropdown.Popover placement="bottom right">
            <Dropdown.Menu
              onAction={(key) => {
                if (key === 'profile') router.push('/profile');
                if (key === 'logout') logout();
              }}
            >
              <Dropdown.Item id="profile" textValue="Perfil">
                <Icon icon="lucide:user-circle" className="size-4 text-muted" />
                <Label>Perfil</Label>
              </Dropdown.Item>
              <Dropdown.Item id="logout" textValue="Cerrar sesión" variant="danger">
                <Icon icon="lucide:log-out" className="size-4 text-danger" />
                <Label>Cerrar sesión</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </header>
  );
}
