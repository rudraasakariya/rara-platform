'use client';

import { CSSProperties, ReactNode } from 'react';
import { useSidebar } from '@/contexts/sidebar-context';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { Breadcrumbs } from './breadcrumbs';
import { cn } from '@/lib/utils';
import { layoutPatterns, LAYOUT } from '@/styles';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isOpen } = useSidebar();
  const layoutVars: CSSProperties = {
    '--navbar-height': LAYOUT.NAVBAR_HEIGHT,
    '--content-offset': LAYOUT.CONTENT_OFFSET,
  };

  return (
    <div className="flex min-h-screen bg-gray-50" style={layoutVars}>
      {/* Sidebar - slides in from left to right, positioned below navbar */}
      <aside 
        className={cn(
          'fixed left-0 z-sidebar w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          !isOpen && 'pointer-events-none'
        )}
        style={
          !isOpen
            ? { transform: 'translateX(-100%)', top: 'var(--navbar-height)', height: 'calc(100vh - var(--navbar-height))' }
            : { top: 'var(--navbar-height)', height: 'calc(100vh - var(--navbar-height))' }
        }
      >
        {/* Sidebar content - no extra padding needed since sidebar starts below navbar */}
        <div className="h-full overflow-y-auto">
          <Sidebar />
        </div>
      </aside>

      {/* Navbar - fixed at top, doesn't shift */}
      <Navbar />

      {/* Main content wrapper - only page content shifts */}
      <div className="flex flex-col flex-1 min-h-screen w-full">
        {/* Page content area - shifts right when sidebar opens */}
        <main 
          className={cn(
            'flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out',
            isOpen ? 'ml-[288px]' : 'ml-8'
          )}
          style={{ paddingTop: 'calc(var(--navbar-height) + var(--content-offset))' }}
        >
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
