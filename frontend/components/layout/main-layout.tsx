'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1">
          <div className="max-w-[1920px] mx-auto px-8 py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
