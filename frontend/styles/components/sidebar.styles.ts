/**
 * Sidebar-specific style utilities
 * Functions that return className strings for sidebar components
 */

export const sidebarStyles = {
  // Sidebar container - fixed on left, full height
  container: (isOpen: boolean) => {
    const base = 'fixed left-0 top-0 z-sidebar h-screen w-64 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out';
    // When closed, hide completely off-screen to the left
    const state = isOpen ? 'translate-x-0' : '-translate-x-full';
    // Add pointer-events-none when closed to prevent interaction
    const pointerEvents = isOpen ? '' : 'pointer-events-none';
    return `${base} ${state} ${pointerEvents}`;
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
