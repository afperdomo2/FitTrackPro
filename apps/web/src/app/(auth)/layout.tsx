'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Sidebar } from './_components/sidebar';
import { Topbar } from './_components/topbar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, mustChangePassword } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && mustChangePassword && !pathname.startsWith('/profile')) {
      router.replace('/profile?change_password=required');
    }
  }, [isAuthenticated, isLoading, mustChangePassword, pathname, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-muted-foreground animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-dvh">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
