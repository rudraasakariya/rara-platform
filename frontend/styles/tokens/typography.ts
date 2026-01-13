/**
 * Typography scale constants
 * Font sizes, line heights, weights, and letter spacing
 */

export const TYPOGRAPHY = {
  // Heading 1 (Navbar title)
  HEADING_1_SIZE: '28px', // text-[28px]
  HEADING_1_LINE_HEIGHT: '34px', // leading-[34px]
  HEADING_1_WEIGHT: '600', // font-semibold
  HEADING_1_TRACKING: 'tight', // tracking-tight
  
  // Body text
  BODY_SIZE: '14px', // text-sm = 0.875rem = 14px
  BODY_LINE_HEIGHT: '20px', // leading-5 = 1.25rem = 20px
  BODY_WEIGHT: '400', // font-normal
  
  // Small text
  SMALL_SIZE: '12px', // text-xs = 0.75rem = 12px
  SMALL_LINE_HEIGHT: '16px', // leading-4 = 1rem = 16px
  
  // Font weights
  WEIGHT_NORMAL: '400',
  WEIGHT_MEDIUM: '500',
  WEIGHT_SEMIBOLD: '600',
  WEIGHT_BOLD: '700',
  
  // Letter spacing
  TRACKING_TIGHT: 'tight',
  TRACKING_NORMAL: 'normal',
  TRACKING_WIDE: 'wide',
} as const;
