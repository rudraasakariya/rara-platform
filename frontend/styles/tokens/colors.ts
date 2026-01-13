/**
 * Color palette constants
 * Extends Tailwind's default colors with semantic names
 * Colors are already defined in globals.css via CSS variables
 */

export const COLORS = {
  // Semantic color names (mapped to Tailwind classes)
  GRAY: {
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    300: 'gray-300',
    400: 'gray-400',
    500: 'gray-500',
    600: 'gray-600',
    700: 'gray-700',
    900: 'gray-900',
  },
  
  // Primary colors (from CSS variables)
  PRIMARY: 'primary',
  PRIMARY_FOREGROUND: 'primary-foreground',
  
  // Background colors
  BACKGROUND: 'background',
  FOREGROUND: 'foreground',
  
  // Muted colors
  MUTED: 'muted',
  MUTED_FOREGROUND: 'muted-foreground',
  
  // Destructive
  DESTRUCTIVE: 'destructive',
  DESTRUCTIVE_FOREGROUND: 'destructive-foreground',
} as const;
