'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/contexts/sidebar-context';
import { Sidebar } from './sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';
import { sidebarStyles, layoutPatterns } from '@/styles';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - slides in from left and pushes content */}
      <aside className={sidebarStyles.container(isOpen)}>
        <div className={sidebarStyles.innerContainer()}>
          <Sidebar />
        </div>
      </aside>

      {/* Main content area - shifts to the right when sidebar opens */}
      <main
        className={cn(
          layoutPatterns.mainContent,
          isOpen ? 'ml-64' : 'ml-0'
        )}
      >
        <div className="flex-1">
          <div className={layoutPatterns.pageContainer}>
            {/* Breadcrumbs Navigation */}
            <div className="mb-6">
              <Breadcrumbs />
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
