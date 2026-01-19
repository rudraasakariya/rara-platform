/**
 * Navigation item variants using cva
 * Reusable across Navbar, Sidebar, Breadcrumbs
 * Note: Spacing values use CSS variables defined in globals.css
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const navigationItemVariants = cva(
  'flex items-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        active: 'bg-gray-100 text-gray-900 hover:bg-gray-100',
        inactive: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type NavigationItemVariants = VariantProps<typeof navigationItemVariants>;
