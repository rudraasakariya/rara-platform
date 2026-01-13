'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { MainLayout } from './main-layout';

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Don't wrap login/register pages with MainLayout
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Only wrap authenticated pages with MainLayout
  if (isAuthenticated && !isAuthPage) {
    return <MainLayout>{children}</MainLayout>;
  }

  // For non-authenticated pages or auth pages, render children directly
  return <>{children}</>;
}
