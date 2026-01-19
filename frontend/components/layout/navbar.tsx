'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useSidebar } from '@/contexts/sidebar-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navbarStyles } from '@/styles';
import {
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isOpen, toggle } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  // Track when component has mounted to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't show navbar on login/register pages or while loading
  if (!isMounted || isLoading || !isAuthenticated || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const userRole = user?.role || 'tutor';

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  };

  return (
    <nav className={navbarStyles.container()} style={{ height: 'var(--navbar-height)' }}>
      <div 
        className={navbarStyles.innerContainer()}
        style={{ paddingLeft: 'var(--navbar-padding-x)', paddingRight: 'var(--navbar-padding-x)' }}
      >
        {/* Header Section with Title and Subtitle */}
        <div className={navbarStyles.headerSection()}>
          {/* Left side: Hamburger button and Title */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-lg)' }}>
            {/* Hamburger/Close Menu Button - inside navbar, doesn't move */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 hover:bg-gray-100"
              onClick={toggle}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">{isOpen ? 'Close sidebar menu' : 'Open sidebar menu'}</span>
            </Button>
            
            {/* Title Section */}
            <div>
              <h1 
                className={navbarStyles.heading()}
                style={{ 
                  fontSize: 'var(--heading-1-size)', 
                  lineHeight: 'var(--heading-1-line-height)' 
                }}
              >
                Tutoring Program Dashboard
              </h1>
              <p className={navbarStyles.subtitle()}>
                K-12 Math, ELA & SEL Services
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className={navbarStyles.actions()} style={{ gap: 'var(--spacing-lg)' }}>
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-9 w-9 rounded-full hover:bg-gray-100 p-0"
                >
                  <User className="h-4 w-4 text-gray-700" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">{userRole}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
