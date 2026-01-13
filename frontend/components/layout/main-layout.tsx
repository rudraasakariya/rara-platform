'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/contexts/sidebar-context';
import { Sidebar } from './sidebar';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - slides in from left and pushes content */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-[60] h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64'
        )}
      >
        <div className="pt-[73px] h-full">
          <Sidebar />
        </div>
      </aside>

      {/* Main content area - shifts to the right when sidebar opens */}
      <main
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out',
          isOpen ? 'ml-64' : 'ml-0'
        )}
      >
        <div className="flex-1">
          <div className="max-w-[1920px] mx-auto px-8 py-8">
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
