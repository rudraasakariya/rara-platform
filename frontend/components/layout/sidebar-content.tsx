'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { navigationItemVariants } from '@/styles';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Settings,
  User,
  BookOpenText,
  BarChart2,
} from 'lucide-react';

// Navigation items based on role
const adminNavItems = [
  { value: 'overview', label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { value: 'curriculum', label: 'Curriculum', href: '/curriculum', icon: BookOpenText },
  { value: 'structure', label: 'Structure', href: '/dashboard/structure', icon: Building2 },
  { value: 'sites', label: 'Sites', href: '/sites', icon: Building2 },
  { value: 'partners', label: 'Partners', href: '/partners', icon: Users },
  { value: 'reports', label: 'Reports', href: '/reports', icon: BarChart2 },
];

const tutorNavItems = [
  { value: 'overview', label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { value: 'curriculum', label: 'Curriculum', href: '/curriculum', icon: BookOpenText },
  { value: 'my-students', label: 'My Students', href: '/my-students', icon: Users },
  { value: 'my-sessions', label: 'My Sessions', href: '/my-sessions', icon: Calendar },
  { value: 'availability', label: 'Availability', href: '/availability', icon: Calendar },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Track when component has mounted to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ensure consistent role determination between server and client
  // Default to 'tutor' during SSR, use actual role after mount
  // This prevents hydration mismatch where server renders tutor nav items
  // but client renders admin nav items based on user from localStorage
  const userRole = isMounted && user?.role ? user.role : 'tutor';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const navItems = isAdmin ? adminNavItems : tutorNavItems;

  // Determine active item based on current pathname
  const getActiveItem = () => {
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      if (pathname === '/dashboard/structure') return 'structure';
      return 'overview';
    }
    if (pathname.startsWith('/sites')) return 'sites';
    if (pathname.startsWith('/partners')) return 'partners';
    if (pathname.startsWith('/curriculum')) return 'curriculum';
    if (pathname.startsWith('/my-students')) return 'my-students';
    if (pathname.startsWith('/my-sessions')) return 'my-sessions';
    if (pathname.startsWith('/availability')) return 'availability';
    if (pathname.startsWith('/reports')) return 'reports';
    return 'overview';
  };

  const activeItem = getActiveItem();

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <>
      {/* Navigation Items */}
      <nav 
        className="flex-1"
        style={{
          paddingLeft: 'var(--spacing-lg)',
          paddingRight: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-sm)',
          paddingBottom: 'var(--spacing-sm)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.value;

            return (
              <Link
                key={item.value}
                href={item.href}
                onClick={handleClick}
                className={cn(
                  navigationItemVariants({
                    variant: isActive ? 'active' : 'inactive',
                  })
                )}
                style={{
                  gap: 'var(--nav-item-gap)',
                  paddingLeft: 'var(--nav-item-padding-x)',
                  paddingRight: 'var(--nav-item-padding-x)',
                  paddingTop: 'var(--nav-item-padding-y)',
                  paddingBottom: 'var(--nav-item-padding-y)',
                }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div 
        className="border-t border-gray-200"
        style={{
          paddingLeft: 'var(--spacing-lg)',
          paddingRight: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-md)',
          paddingBottom: 'var(--spacing-md)',
        }}
      >
        <Link
          href="/profile"
          onClick={handleClick}
          className={cn(
            navigationItemVariants({
              variant: pathname === '/profile' ? 'active' : 'inactive',
            })
          )}
          style={{
            gap: 'var(--nav-item-gap)',
            paddingLeft: 'var(--nav-item-padding-x)',
            paddingRight: 'var(--nav-item-padding-x)',
            paddingTop: 'var(--nav-item-padding-y)',
            paddingBottom: 'var(--nav-item-padding-y)',
          }}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          <span>Profile</span>
        </Link>
        <Link
          href="/settings"
          onClick={handleClick}
          className={cn(
            navigationItemVariants({
              variant: pathname === '/settings' ? 'active' : 'inactive',
            })
          )}
          style={{
            gap: 'var(--nav-item-gap)',
            paddingLeft: 'var(--nav-item-padding-x)',
            paddingRight: 'var(--nav-item-padding-x)',
            paddingTop: 'var(--nav-item-padding-y)',
            paddingBottom: 'var(--nav-item-padding-y)',
          }}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </>
  );
}
