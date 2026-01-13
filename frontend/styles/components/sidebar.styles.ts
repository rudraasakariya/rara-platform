/**
 * Sidebar-specific style utilities
 * Functions that return className strings for sidebar components
 */

export const sidebarStyles = {
  // Sidebar container - fixed on left, full height
  container: (isOpen: boolean) => {
    const base = 'fixed left-0 top-0 z-sidebar h-screen w-64 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out';
    const state = isOpen ? 'translate-x-0' : '-translate-x-full';
    return `${base} ${state}`;
  },
  
  // Navigation container
  navContainer: () => {
    return 'flex-1 p-4 space-y-1';
  },
  
  // User section
  userSection: () => {
    return 'p-4 border-t border-gray-200';
  },
} as const;
