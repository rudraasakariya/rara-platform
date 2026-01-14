/**
 * Layout dimension constants
 * Sidebar width, navbar height, max content width, etc.
 */

export const LAYOUT = {
  // Sidebar
  SIDEBAR_WIDTH: '256px', // w-64 = 16rem = 256px
  SIDEBAR_COLLAPSED_WIDTH: '0px',
  
  // Navbar
  NAVBAR_HEIGHT: '120px',
  
  // Content
  MAX_CONTENT_WIDTH: '1920px', // max-w-[1920px]
  
  // Hamburger button
  HAMBURGER_SIZE: '36px', // h-9 w-9 = 2.25rem = 36px
  HAMBURGER_ICON_SIZE: '20px', // h-5 w-5 = 1.25rem = 20px
} as const;
