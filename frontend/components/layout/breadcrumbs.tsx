'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { breadcrumbsStyles } from '@/styles';

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Map route segments to user-friendly labels
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  structure: 'Structure',
  sites: 'Sites',
  partners: 'Partners',
  'my-students': 'My Students',
  'my-sessions': 'My Sessions',
  availability: 'Availability',
  profile: 'Profile',
  settings: 'Settings',
  'multi-site': 'Multi-Site Operations',
};

// Generate breadcrumb items from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove leading and trailing slashes, then split
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/dashboard' },
  ];

  // Build breadcrumbs from path segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Use custom label if available, otherwise capitalize and replace hyphens
    const label = routeLabels[segment] || 
      segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

interface BreadcrumbsProps {
  className?: string;
  maxItems?: number;
}

export function Breadcrumbs({ className, maxItems }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on login/register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }

  const breadcrumbs = generateBreadcrumbs(pathname);
  
  // Limit the number of breadcrumbs shown if maxItems is specified
  const displayBreadcrumbs = maxItems && breadcrumbs.length > maxItems
    ? [
        breadcrumbs[0], // Always show home
        { label: '...', href: '#' },
        ...breadcrumbs.slice(-(maxItems - 2)), // Show last N-2 items
      ]
    : breadcrumbs;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(breadcrumbsStyles.container(), className)}
    >
      <ol className={breadcrumbsStyles.list()}>
        {displayBreadcrumbs.map((breadcrumb, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isEllipsis = breadcrumb.label === '...';

          return (
            <li key={`${breadcrumb.href}-${index}`} className={breadcrumbsStyles.item()}>
              {index === 0 ? (
                <Link
                  href={breadcrumb.href}
                  className={breadcrumbsStyles.homeLink()}
                >
                  <Home className="h-4 w-4" />
                  <span className="sr-only">{breadcrumb.label}</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className={breadcrumbsStyles.separator()} />
                  {isLast ? (
                    <span className={breadcrumbsStyles.active()} aria-current="page">
                      {breadcrumb.label}
                    </span>
                  ) : isEllipsis ? (
                    <span className={breadcrumbsStyles.ellipsis()}>...</span>
                  ) : (
                    <Link
                      href={breadcrumb.href}
                      className={breadcrumbsStyles.link()}
                    >
                      {breadcrumb.label}
                    </Link>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
