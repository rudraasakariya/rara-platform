/**
 * Navigation-specific patterns
 * Common patterns for navigation items, active/inactive states, etc.
 * Note: Spacing values should use CSS variables via inline styles
 */

export const NAVIGATION_PATTERNS = {
  // Base navigation item (spacing handled via inline styles)
  navItemBase: 'flex items-center rounded-md text-sm font-medium transition-colors',
  
  // Active navigation item
  navItemActive: 'bg-primary text-primary-foreground hover:bg-primary/90',
  
  // Inactive navigation item
  navItemInactive: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
  
  // Navigation container (spacing handled via inline styles)
  navContainer: 'flex-1',
} as const;
