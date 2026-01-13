'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/contexts/sidebar-context';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';
import { sidebarStyles, layoutPatterns } from '@/styles';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar - fixed on left, slides in/out */}
      <aside className={sidebarStyles.container(isOpen)}>
        <Sidebar />
      </aside>

      {/* Main content area - shifts right when sidebar opens */}
      <div
        className={cn(
          'flex flex-col flex-1 min-h-screen w-full transition-all duration-300 ease-in-out',
          isOpen ? 'ml-64' : 'ml-0'
        )}
      >
        {/* Navbar - sticky at top of content area */}
        <Navbar />

        {/* Page content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className={layoutPatterns.pageContainer}>
            {/* Breadcrumbs Navigation */}
            <div className="mb-6">
              <Breadcrumbs />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
