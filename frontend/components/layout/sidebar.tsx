'use client';

import { SidebarContent } from './sidebar-content';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-white overflow-y-auto">
      {/* Sidebar Content */}
      <SidebarContent />
    </div>
  );
}
