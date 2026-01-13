/**
 * Button pattern combinations
 * Extends existing Button component with common combinations
 */

export const BUTTON_PATTERNS = {
  // Hamburger button
  hamburger: 'h-9 w-9 bg-white border border-gray-200 shadow-sm hover:bg-gray-50',
  
  // User menu button
  userMenu: 'h-9 w-9 rounded-full hover:bg-gray-100 p-0',
  
  // Multi-site operations button
  multiSite: 'hidden md:flex items-center gap-2 h-9 px-4 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900',
} as const;
