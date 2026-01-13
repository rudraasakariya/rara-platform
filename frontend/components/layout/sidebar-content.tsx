'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Settings,
  User,
} from 'lucide-react';

// Navigation items based on role
const adminNavItems = [
  { value: 'overview', label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { value: 'structure', label: 'Structure', href: '/dashboard/structure', icon: Building2 },
  { value: 'sites', label: 'Sites', href: '/sites', icon: Building2 },
  { value: 'partners', label: 'Partners', href: '/partners', icon: Users },
];

const tutorNavItems = [
  { value: 'overview', label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { value: 'my-students', label: 'My Students', href: '/my-students', icon: Users },
  { value: 'my-sessions', label: 'My Sessions', href: '/my-sessions', icon: Calendar },
  { value: 'availability', label: 'Availability', href: '/availability', icon: Calendar },
];

interface SidebarContentProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarContent({ isCollapsed = false, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const userRole = user?.role || 'tutor';
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
    if (pathname.startsWith('/my-students')) return 'my-students';
    if (pathname.startsWith('/my-sessions')) return 'my-sessions';
    if (pathname.startsWith('/availability')) return 'availability';
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
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.value;

          return (
            <Link
              key={item.value}
              href={item.href}
              onClick={handleClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                'hover:bg-gray-100',
                isActive
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-gray-700 hover:text-gray-900'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/profile"
          onClick={handleClick}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            pathname === '/profile' && 'bg-gray-100'
          )}
          title={isCollapsed ? 'Profile' : undefined}
        >
          <User className={cn('h-5 w-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
          {!isCollapsed && <span>Profile</span>}
        </Link>
        <Link
          href="/settings"
          onClick={handleClick}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            pathname === '/settings' && 'bg-gray-100'
          )}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className={cn('h-5 w-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </>
  );
}
