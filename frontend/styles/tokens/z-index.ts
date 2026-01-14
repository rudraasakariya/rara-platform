/**
 * Z-index scale constants
 * Centralized z-index values for consistent layering
 */

export const Z_INDEX = {
  // Base layers
  BASE: 0,
  
  // Content layers
  CONTENT: 10,
  
  // Navigation layers
  SIDEBAR: 40, // z-[40] - below navbar
  NAVBAR: 70, // z-[70] - above sidebar
  HAMBURGER: 80, // z-[80] - above everything
  
  // Overlay layers
  DROPDOWN: 100,
  MODAL: 200,
  TOAST: 300,
} as const;
