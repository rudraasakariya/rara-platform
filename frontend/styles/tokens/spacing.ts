/**
 * Spacing scale constants
 * Comprehensive spacing scale for padding, margin, and gap
 * Note: Layout dimensions (sidebar width, navbar height) are in LAYOUT tokens
 */

export const SPACING = {
  // Base spacing scale (4px increments)
  XS: '4px',   // 0.25rem
  SM: '8px',   // 0.5rem
  MD: '12px',  // 0.75rem
  LG: '16px',  // 1rem
  XL: '24px',  // 1.5rem
  '2XL': '32px', // 2rem
  '3XL': '40px', // 2.5rem
  '4XL': '56px', // 3.5rem
  
  // Padding scale
  PADDING_XS: '4px',
  PADDING_SM: '8px',
  PADDING_MD: '12px',
  PADDING_LG: '16px',
  PADDING_XL: '24px',
  PADDING_2XL: '32px',
  PADDING_3XL: '40px',
  PADDING_4XL: '56px',
  
  // Margin scale
  MARGIN_XS: '4px',
  MARGIN_SM: '8px',
  MARGIN_MD: '12px',
  MARGIN_LG: '16px',
  MARGIN_XL: '24px',
  MARGIN_2XL: '32px',
  MARGIN_3XL: '40px',
  MARGIN_4XL: '56px',
  
  // Gap scale
  GAP_XS: '4px',
  GAP_SM: '8px',
  GAP_MD: '12px',
  GAP_LG: '16px',
  GAP_XL: '24px',
  GAP_2XL: '32px',
  GAP_3XL: '40px',
  GAP_4XL: '56px',
  
  // Semantic spacing tokens
  // Navbar spacing
  NAVBAR_PADDING_X: '40px', // px-10 = 2.5rem = 40px
  NAVBAR_PADDING_Y: '24px', // py-6 = 1.5rem = 24px
  
  // Hamburger button positioning
  HAMBURGER_LEFT: '16px', // left-4 = 1rem = 16px
  HAMBURGER_TOP: '18px', // top-[18px]
  
  // Content spacing
  CONTENT_PADDING_X: '32px', // px-8 = 2rem = 32px
  CONTENT_PADDING_Y: '32px', // py-8 = 2rem = 32px
  CONTENT_PADDING_X_LARGE: '56px', // px-14 = 3.5rem = 56px
  CONTENT_GAP: '24px', // gap-6 = 1.5rem = 24px
  
  // Content margins (reference LAYOUT for calculated values)
  CONTENT_MARGIN_WHEN_SIDEBAR_OPEN: '32px', // Space between sidebar and content
  CONTENT_MARGIN_WHEN_SIDEBAR_CLOSED: '32px', // ml-8 = 2rem = 32px
  
  // Navigation spacing
  NAV_ITEM_PADDING_X: '12px', // px-3 = 0.75rem = 12px
  NAV_ITEM_PADDING_Y: '8px', // py-2 = 0.5rem = 8px
  NAV_ITEM_GAP: '12px', // gap-3 = 0.75rem = 12px
  
  // Breadcrumb spacing
  BREADCRUMB_GAP: '8px', // space-x-2 = 0.5rem = 8px
  BREADCRUMB_MARGIN_BOTTOM: '24px', // mb-6 = 1.5rem = 24px
  
  // Section spacing
  SECTION_GAP: '24px', // gap-6 = 1.5rem = 24px
} as const;
