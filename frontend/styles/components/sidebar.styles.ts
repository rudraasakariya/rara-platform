/**
 * Sidebar-specific style utilities
 * Functions that return className strings for sidebar components
 * Uses CSS custom properties for dimensions and spacing
 */

export const sidebarStyles = {
  // Sidebar container - toggleable on all screen sizes
  // Fixed overlay that slides in/out below navbar, closed by default
  container: (isOpen: boolean) => {
    const base = 'fixed left-0 top-navbar z-sidebar border-r border-gray-200 bg-white transition-all duration-300 ease-in-out';
    if (!isOpen) {
      // When closed: hidden off-screen to the left
      return `${base} -translate-x-full pointer-events-none`;
    }
    // When open: visible and interactive
    return `${base} translate-x-0`;
  },
  
  // Navigation container
  navContainer: () => {
    return 'flex-1';
  },
  
  // User section
  userSection: () => {
    return 'border-t border-gray-200';
  },
} as const;
