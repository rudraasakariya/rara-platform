/**
 * Navigation item variants using cva
 * Reusable across Navbar, Sidebar, Breadcrumbs
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const navigationItemVariants = cva(
  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        active: 'bg-primary text-primary-foreground hover:bg-primary/90',
        inactive: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type NavigationItemVariants = VariantProps<typeof navigationItemVariants>;
