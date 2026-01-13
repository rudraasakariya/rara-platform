'use client';

import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar area - placeholder for now, will be populated in issue #49 */}
      <aside className="hidden lg:block w-64 border-r border-gray-200 bg-white">
        {/* Sidebar component will go here in issue #49 */}
      </aside>

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
