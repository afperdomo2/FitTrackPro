'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  clients: 'Clientes',
  trainers: 'Entrenadores',
  exercises: 'Ejercicios',
  workouts: 'Entrenamientos',
  profile: 'Perfil',
};

interface BreadcrumbProps {
  variant?: 'full' | 'compact';
}

export function Breadcrumb({ variant = 'full' }: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  if (variant === 'compact') {
    const last = segments[segments.length - 1];
    return (
      <span className="text-sm font-medium text-foreground">
        {labelMap[last] || last.charAt(0).toUpperCase() + last.slice(1)}
      </span>
    );
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/dashboard" className="hover:text-foreground transition-colors">
        Inicio
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = index === segments.length - 1;

        return (
          <span key={segment} className="flex items-center gap-1.5">
            <span className="text-muted/40">/</span>
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
