/**
 * Sidebar-specific style utilities
 * Functions that return className strings for sidebar components
 */

export const sidebarStyles = {
  // Sidebar container
  // On desktop (md+): part of flex layout, always visible
  // On mobile: fixed overlay, slides in/out
  container: (isOpen: boolean) => {
    const base = 'h-screen w-64 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out';
    // Desktop: part of flex layout (not fixed)
    // Mobile: fixed overlay that slides in/out
    const positioning = 'md:relative fixed left-0 top-0 z-sidebar md:z-auto';
    // On mobile: slide in/out based on isOpen
    // On desktop: always visible (translate-x-0)
    const state = isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0';
    // Prevent interaction when closed on mobile
    const pointerEvents = isOpen ? '' : 'pointer-events-none md:pointer-events-auto';
    return `${base} ${positioning} ${state} ${pointerEvents}`;
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
