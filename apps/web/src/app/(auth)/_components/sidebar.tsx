'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Role } from '@/types/api';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface NavItem {
  label: string;
  href: string;
  roles: Role[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', roles: ['admin', 'trainer', 'client'] },
  { label: 'Clients', href: '/clients', roles: ['admin', 'trainer'] },
  { label: 'Trainers', href: '/trainers', roles: ['admin'] },
  { label: 'Workouts', href: '/workouts', roles: ['admin', 'trainer', 'client'] },
  { label: 'Admin', href: '/admin/users', roles: ['admin'] },
  { label: 'Profile', href: '/profile', roles: ['admin', 'trainer', 'client'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visible = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="w-60 flex flex-col border-r border-sidebar-border bg-sidebar h-dvh shrink-0">
      <div className="p-4 font-semibold text-lg border-b border-sidebar-border">FitTrackPro</div>
      <nav className="flex-1 p-2 space-y-1">
        {visible.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => logout()}
          className="w-full text-left text-sm text-danger hover:underline px-2 py-1"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
