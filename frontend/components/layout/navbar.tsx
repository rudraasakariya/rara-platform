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
import {
  Menu,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

// Tab navigation items based on role
const adminTabs = [
  { value: 'overview', label: 'Overview', href: '/dashboard' },
  { value: 'structure', label: 'Structure', href: '/dashboard/structure' },
  { value: 'sites', label: 'Sites', href: '/sites' },
  { value: 'partners', label: 'Partners', href: '/partners' },
];

const tutorTabs = [
  { value: 'overview', label: 'Overview', href: '/dashboard' },
  { value: 'my-students', label: 'My Students', href: '/my-students' },
  { value: 'my-sessions', label: 'My Sessions', href: '/my-sessions' },
  { value: 'availability', label: 'Availability', href: '/availability' },
];

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
  const tabs = isAdmin ? adminTabs : tutorTabs;

  // Determine active tab based on current pathname
  const getActiveTab = () => {
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

  const activeTab = getActiveTab();

  const handleTabChange = (value: string) => {
    const tab = tabs.find((t) => t.value === value);
    if (tab) {
      router.push(tab.href);
    }
  };

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

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  {isAdmin && (
                    <div className="pb-4 border-b">
                      <Link
                        href="/multi-site"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 text-center"
                      >
                        Multi-Site Operations
                      </Link>
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Navigation</h2>
                    <div className="space-y-2">
                      {tabs.map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                          <Link
                            key={tab.value}
                            href={tab.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            {tab.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-destructive hover:bg-accent w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Tab Navigation - Matching Design */}
        <div className="border-t border-gray-200">
          <div className="flex items-center -mb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`
                    px-6 py-3 text-sm font-medium transition-colors relative
                    ${
                      isActive
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
