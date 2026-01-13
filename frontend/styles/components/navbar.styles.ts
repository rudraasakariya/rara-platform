/**
 * Navbar-specific style utilities
 * Functions that return className strings for navbar components
 */

export const navbarStyles = {
  // Navbar container - sticky at top of main content area
  container: () => {
    return 'bg-white border-b border-gray-200 sticky top-0 z-navbar shadow-sm';
  },
  
  // Navbar inner container
  innerContainer: () => {
    return 'max-w-content mx-auto px-8';
  },
  
  // Header section
  headerSection: () => {
    return 'flex items-center justify-between py-5';
  },
  
  // Title section
  titleSection: () => {
    return 'flex items-center pl-12';
  },
  
  // Heading (h1)
  heading: () => {
    return 'text-[28px] font-semibold text-gray-900 leading-[34px] tracking-tight';
  },
  
  // Subtitle (p)
  subtitle: () => {
    return 'text-sm text-gray-500 mt-1 font-normal';
  },
  
  // Right side actions
  actions: () => {
    return 'flex items-center gap-4';
  },
  
  // Hamburger button - fixed on left, above sidebar
  hamburgerButton: () => {
    return 'fixed left-4 top-4 z-hamburger h-9 w-9 bg-white border border-gray-200 shadow-sm hover:bg-gray-50';
  },
} as const;
