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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - always visible on desktop (md+), toggleable overlay on mobile */}
      <aside className={sidebarStyles.container(isOpen)}>
        <Sidebar />
      </aside>

      {/* Main content area - full width on mobile, with sidebar on desktop */}
      <div className="flex flex-col flex-1 min-h-screen w-full md:w-auto">
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
