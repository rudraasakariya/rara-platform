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
  NAVBAR: 50, // z-50
  SIDEBAR: 60, // z-[60]
  HAMBURGER: 70, // z-[70]
  
  // Overlay layers
  DROPDOWN: 100,
  MODAL: 200,
  TOAST: 300,
} as const;
