/**
 * Form-specific style utilities
 */

export const formStyles = {
  // Form field container
  fieldContainer: () => {
    return 'space-y-2';
  },
  
  // Form grid (for side-by-side fields)
  formGrid: () => {
    return 'grid grid-cols-2 gap-4';
  },
  
  // Error message
  errorMessage: () => {
    return 'text-sm text-destructive';
  },
  
  // Form footer
  formFooter: () => {
    return 'flex flex-col space-y-4';
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
