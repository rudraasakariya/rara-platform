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
    return 'w-full max-w-md';
  },
  
  // Auth card header
  authCardHeader: () => {
    return 'space-y-1';
  },
  
  // Auth card title
  authCardTitle: () => {
    return 'text-2xl font-bold';
  },
  
  // Dashboard header section
  dashboardHeader: () => {
    return 'flex justify-between items-center mb-8';
  },
  
  // Dashboard title
  dashboardTitle: () => {
    return 'text-3xl font-bold';
  },
  
  // Dashboard subtitle
  dashboardSubtitle: () => {
    return 'text-muted-foreground';
  },
  
  // Dashboard grid
  dashboardGrid: () => {
    return 'grid gap-4 md:grid-cols-2 lg:grid-cols-3';
  },
  
  // Loading container
  loadingContainer: () => {
    return 'flex min-h-screen items-center justify-center';
  },
} as const;
