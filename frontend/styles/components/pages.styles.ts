/**
 * Page-specific style utilities
 * For dashboard, login, register, and other pages
 */

export const pageStyles = {
  // Auth page container (login/register)
  authContainer: () => {
    return 'flex min-h-screen items-center justify-center bg-background p-4';
  },
  
  // Auth card
  authCard: () => {
    return 'w-full max-w-md mx-auto';
  },
  
  // Auth card header (spacing handled via inline styles)
  authCardHeader: () => {
    return '';
  },
  
  // Auth card title
  authCardTitle: () => {
    return 'text-2xl font-bold';
  },
  
  // Dashboard header section
  dashboardHeader: () => {
    return 'w-full max-w-5xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between';
  },
  
  // Dashboard title
  dashboardTitle: () => {
    return 'text-3xl font-bold';
  },
  
  // Dashboard subtitle
  dashboardSubtitle: () => {
    return 'text-muted-foreground';
  },
  
  // Dashboard grid - responsive columnar grid layout
  dashboardGrid: () => {
    return 'w-full max-w-5xl mx-auto grid';
  },
  
  // Loading container
  loadingContainer: () => {
    return 'flex min-h-screen items-center justify-center';
  },
} as const;
