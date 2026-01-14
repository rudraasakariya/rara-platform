'use client';

import { SidebarContent } from './sidebar-content';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className="flex flex-col bg-white">
      {/* Sidebar Content */}
      <SidebarContent />
    </div>
  );
}
