/**
 * Common layout patterns using Tailwind @apply directives
 * These can be used in globals.css or component styles
 * Uses CSS custom properties for dynamic values
 */

export const LAYOUT_PATTERNS = {
  // Max-width container
  containerMax: 'max-w-[var(--max-content-width)] mx-auto',
  
  // Page container with padding
  pageContainer: 'max-w-[var(--max-content-width)] mx-auto px-[var(--content-padding-x-large)] py-[var(--content-padding-y)]',
  
  // Content wrapper
  contentWrapper: 'flex-1 flex flex-col min-h-screen',
  
  // Sidebar container base
  sidebarContainer: 'fixed left-0 top-0 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
  
  // Main content area
  mainContent: 'flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out',
} as const;
