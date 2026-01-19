/**
 * Form-specific style utilities
 * Note: Spacing values should use CSS variables via inline styles
 */

export const formStyles = {
  // Form field container
  fieldContainer: () => {
    return 'flex flex-col gap-2';
  },
  
  // Form grid (for side-by-side fields)
  formGrid: () => {
    return 'grid grid-cols-1 gap-4 md:grid-cols-2';
  },
  
  // Error message
  errorMessage: () => {
    return 'text-sm text-destructive';
  },
  
  // Form footer
  formFooter: () => {
    return 'flex flex-col gap-3';
  },
  
  // Link in form footer
  formFooterLink: () => {
    return 'text-sm text-center text-muted-foreground';
  },
  
  // Primary link in form footer
  formFooterPrimaryLink: () => {
    return 'text-primary hover:underline';
  },
} as const;
