'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SidebarContent } from './sidebar-content';
import {
  Menu,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on login/register pages
  if (!isAuthenticated || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const userRole = user?.role || 'tutor';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'User';
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-8">
        {/* Header Section with Title and Subtitle */}
        <div className="flex items-center justify-between py-5">
          <div>
            <h1 className="text-[28px] font-semibold text-gray-900 leading-[34px] tracking-tight">
              Tutoring Program Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-normal">
              K-12 Math, ELA & SEL Services
            </p>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Multi-Site Operations Button - Only show for admin/super_admin */}
            {isAdmin && (
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 h-9 px-4 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                asChild
              >
                <Link href="/multi-site">Multi-Site Operations</Link>
              </Button>
            )}
            
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Sidebar Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full bg-white">
                  {/* Mobile Sidebar Content - matches desktop sidebar styling */}
                  <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
