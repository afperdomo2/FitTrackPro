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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visible = navItems.filter((item) => user && item.roles.includes(user.role));

  const navContent = (
    <>
      {/* Brand */}
      <div className="flex items-center justify-between gap-2.5 px-5 h-14 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-lg bg-accent shadow-sm shadow-accent/20">
            <Icon icon="lucide:dumbbell" className="size-4 text-accent-foreground" />
          </div>
          <span className="text-base font-display font-bold tracking-tight">FitTrackPro</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden size-8 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors"
          aria-label="Cerrar menú"
        >
          <Icon icon="lucide:x" className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {visible.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                active
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted-foreground hover:bg-surface-secondary hover:text-foreground'
              }`}
            >
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-sidebar-border bg-sidebar h-dvh shrink-0">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 animate-fade-in lg:hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col bg-sidebar border-r border-sidebar-border shadow-xl animate-slide-in-left lg:hidden ${
          isOpen ? '' : 'hidden'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
