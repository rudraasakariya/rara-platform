/**
 * Common layout patterns using Tailwind @apply directives
 * These can be used in globals.css or component styles
 */

export const LAYOUT_PATTERNS = {
  // Max-width container
  containerMax: 'max-w-[1920px] mx-auto',
  
  // Page container with padding
  pageContainer: 'max-w-[1920px] mx-auto px-14 py-8',
  
  // Content wrapper
  contentWrapper: 'flex-1 flex flex-col min-h-screen',
  
  // Sidebar container base
  sidebarContainer: 'fixed left-0 top-0 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
  
  // Main content area
  mainContent: 'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out',
} as const;
