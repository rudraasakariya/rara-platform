/**
 * Container variants using cva
 * Different container types for content
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const containerVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      type: {
        sidebar: 'fixed left-0 top-0 h-screen border-r border-gray-200 bg-white',
        main: 'flex-1 flex flex-col min-h-screen',
        content: 'max-w-[1920px] mx-auto px-8 py-8',
        navbar: 'bg-white border-b border-gray-200 sticky top-0 shadow-sm',
      },
      state: {
        open: '',
        closed: '',
      },
    },
    defaultVariants: {
      type: 'content',
      state: 'open',
    },
  }
);

export type ContainerVariants = VariantProps<typeof containerVariants>;
