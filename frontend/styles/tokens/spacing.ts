/**
 * Spacing scale constants
 * Replaces arbitrary values like `pt-[73px]`, `ml-64`, etc.
 */

export const SPACING = {
  // Sidebar dimensions
  SIDEBAR_WIDTH: '256px', // w-64 = 16rem = 256px
  SIDEBAR_COLLAPSED_WIDTH: '0px',
  
  // Navbar dimensions
  NAVBAR_HEIGHT: '88px', // Updated height
  NAVBAR_PADDING_X: '32px', // px-8 = 2rem = 32px
  NAVBAR_PADDING_Y: '24px', // py-6 = 1.5rem = 24px
  
  // Hamburger button positioning
  HAMBURGER_LEFT: '16px', // left-4 = 1rem = 16px
  HAMBURGER_TOP: '18px', // top-[18px]
  
  // Content spacing
  CONTENT_PADDING_X: '32px', // px-8
  CONTENT_PADDING_Y: '32px', // py-8
  CONTENT_GAP: '24px', // gap-6 = 1.5rem = 24px
  
  // Navigation spacing
  NAV_ITEM_PADDING_X: '12px', // px-3 = 0.75rem = 12px
  NAV_ITEM_PADDING_Y: '8px', // py-2 = 0.5rem = 8px
  NAV_ITEM_GAP: '12px', // gap-3 = 0.75rem = 12px
  
  // Breadcrumb spacing
  BREADCRUMB_GAP: '8px', // space-x-2 = 0.5rem = 8px
} as const;
