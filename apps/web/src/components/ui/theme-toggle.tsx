'use client';

import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="size-9 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors"
      aria-label="Cambiar tema"
    >
      {theme ? (
        <Icon
          icon={isDark ? 'lucide:sun' : 'lucide:moon'}
          className="size-4 text-muted-foreground"
        />
      ) : (
        <div className="size-4" />
      )}
    </button>
  );
}
