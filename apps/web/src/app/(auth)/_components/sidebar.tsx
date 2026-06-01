'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Role } from '@fittrackpro/shared';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'lucide:layout-dashboard',
    roles: ['admin', 'trainer', 'client'],
  },
  { label: 'Clientes', href: '/clients', icon: 'lucide:users', roles: ['trainer'] },
  { label: 'Entrenadores', href: '/trainers', icon: 'lucide:dumbbell', roles: ['admin'] },
  { label: 'Ejercicios', href: '/exercises', icon: 'lucide:activity', roles: ['trainer'] },
  { label: 'Entrenamientos', href: '/workouts', icon: 'lucide:calendar-clock', roles: ['trainer'] },
  {
    label: 'Perfil',
    href: '/profile',
    icon: 'lucide:user-circle',
    roles: ['admin', 'trainer', 'client'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visible = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="w-60 flex flex-col border-r border-sidebar-border bg-sidebar h-dvh shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center size-8 rounded-lg bg-accent shadow-sm shadow-accent/20">
          <Icon icon="lucide:dumbbell" className="size-4 text-accent-foreground" />
        </div>
        <span className="text-base font-display font-bold tracking-tight">FitTrackPro</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {visible.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                active
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted-foreground hover:bg-surface-secondary hover:text-foreground'
              }`}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-accent" />
              )}
              <Icon
                icon={item.icon}
                className={`size-4 shrink-0 transition-colors ${
                  active ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="size-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xs font-semibold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>

        </div>
      </div>
    </aside>
  );
}
