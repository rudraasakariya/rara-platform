/**
 * Navigation-specific patterns
 * Common patterns for navigation items, active/inactive states, etc.
 */

export const NAVIGATION_PATTERNS = {
  // Base navigation item
  navItemBase: 'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
  
  // Active navigation item
  navItemActive: 'bg-primary text-primary-foreground hover:bg-primary/90',
  
  // Inactive navigation item
  navItemInactive: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  
  // Navigation container
  navContainer: 'flex-1 p-4 space-y-1',
} as const;
