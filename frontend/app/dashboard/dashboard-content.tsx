'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pageStyles } from '@/styles';
import type { User } from '@/lib/api/auth';

interface DashboardContentProps {
  initialUser: User;
}

export function DashboardContent({ initialUser }: DashboardContentProps) {
  const { user, logout } = useAuth();
  // Use user from context if available, otherwise use initialUser from server
  const currentUser = user || initialUser;

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Dashboard</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Welcome back, {currentUser?.firstName || currentUser?.email}!
          </p>
        </div>
      </div>

      <div 
        className={pageStyles.dashboardGrid()}
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--spacing-xl)',
        }}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {currentUser?.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Role:</span> {currentUser?.role}
              </p>
              {currentUser?.firstName && (
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {currentUser.firstName} {currentUser.lastName}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dashboard features will be added in future updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
