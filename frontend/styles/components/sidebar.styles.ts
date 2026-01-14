/**
 * Sidebar-specific style utilities
 * Functions that return className strings for sidebar components
 */

export const sidebarStyles = {
  // Sidebar container - toggleable on all screen sizes
  // Fixed overlay that slides in/out below navbar, closed by default
  container: (isOpen: boolean) => {
    const base = 'fixed left-0 top-navbar z-sidebar h-[calc(100vh-73px)] w-64 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out';
    if (!isOpen) {
      // When closed: hidden off-screen to the left
      return `${base} -translate-x-full pointer-events-none`;
    }
    // When open: visible and interactive
    return `${base} translate-x-0`;
  },
  
  // Navigation container
  navContainer: () => {
    return 'flex-1 px-4 py-2 space-y-1';
  },
  
  // User section
  userSection: () => {
    return 'px-4 py-3 border-t border-gray-200';
  },
} as const;
