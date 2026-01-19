/**
 * Layout dimension constants
 * Sidebar width, navbar height, max content width, etc.
 * Single source of truth for structural dimensions
 */

// Content margin when sidebar is open (sidebar width + margin)
const CONTENT_MARGIN_WHEN_SIDEBAR_OPEN = 32; // px
const SIDEBAR_WIDTH_PX = 256; // px

export const LAYOUT = {
  // Sidebar
  SIDEBAR_WIDTH: '256px', // w-64 = 16rem = 256px
  SIDEBAR_COLLAPSED_WIDTH: '0px',
  
  // Navbar
  NAVBAR_HEIGHT: '60px', // Standardized height (was inconsistent: 60px vs 88px)
  CONTENT_OFFSET: '12px',
  
  // Content
  MAX_CONTENT_WIDTH: '1920px', // max-w-[1920px]
  
  // Content margins (calculated)
  CONTENT_MARGIN_WHEN_SIDEBAR_OPEN: `${SIDEBAR_WIDTH_PX + CONTENT_MARGIN_WHEN_SIDEBAR_OPEN}px`, // 288px = 256px + 32px
  CONTENT_MARGIN_WHEN_SIDEBAR_CLOSED: '32px', // ml-8 = 2rem = 32px
  
  // Hamburger button
  HAMBURGER_SIZE: '36px', // h-9 w-9 = 2.25rem = 36px
  HAMBURGER_ICON_SIZE: '20px', // h-5 w-5 = 1.25rem = 20px
} as const;

/**
 * Helper function to get content margin based on sidebar state
 */
export const getContentMargin = (isSidebarOpen: boolean): string => {
  return isSidebarOpen 
    ? LAYOUT.CONTENT_MARGIN_WHEN_SIDEBAR_OPEN 
    : LAYOUT.CONTENT_MARGIN_WHEN_SIDEBAR_CLOSED;
};
