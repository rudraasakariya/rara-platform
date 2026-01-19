/**
 * Breadcrumbs-specific style utilities
 * Functions that return className strings for breadcrumb components
 * Uses CSS custom properties for spacing
 */

export const breadcrumbsStyles = {
  // Breadcrumb container
  container: () => {
    return 'flex items-center text-sm text-gray-600';
  },
  
  // Breadcrumb list
  list: () => {
    return 'flex items-center';
  },
  
  // Breadcrumb item
  item: () => {
    return 'flex items-center';
  },
  
  // Home icon link
  homeLink: () => {
    return 'flex items-center hover:text-gray-900 transition-colors';
  },
  
  // Breadcrumb link (non-active)
  link: () => {
    return 'hover:text-gray-900 transition-colors';
  },
  
  // Active breadcrumb (last item)
  active: () => {
    return 'font-medium text-gray-900';
  },
  
  // Separator (chevron)
  separator: () => {
    return 'h-4 w-4 text-gray-400';
  },
  
  // Ellipsis
  ellipsis: () => {
    return 'text-gray-400';
  },
} as const;
