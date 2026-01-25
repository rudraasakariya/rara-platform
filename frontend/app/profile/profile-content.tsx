'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pageStyles } from '@/styles';
import type { User } from '@/lib/api/auth';
import { Loader2 } from 'lucide-react';

interface ProfileContentProps {
  initialUser: User;
}

export function ProfileContent({ initialUser }: ProfileContentProps) {
  const { user, isLoading } = useAuth();
  // Use user from context if available, otherwise use initialUser from server
  const currentUser = user || initialUser;

  // Check if user update endpoint exists by attempting to fetch it
  // Since we know from the backend code that there's no update endpoint,
  // we'll display read-only information with a note
  const hasUpdateEndpoint = false; // Backend doesn't have user update endpoint

  if (isLoading && !currentUser) {
    return (
      <div className={pageStyles.loadingContainer()}>
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <div className={pageStyles.dashboardHeader()}>
          <div>
            <h1 className={pageStyles.dashboardTitle()}>Profile</h1>
            <p className={pageStyles.dashboardSubtitle()}>
              Your account information
            </p>
          </div>
        </div>

        <Card className="mt-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Error loading profile. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Profile</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Your account information
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-base mt-1">{currentUser.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <p className="text-base mt-1">{currentUser.firstName || 'Not set'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <p className="text-base mt-1">{currentUser.lastName || 'Not set'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Role cannot be changed</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      currentUser.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {currentUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {currentUser.lastLoginAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                  <p className="text-base mt-1">
                    {new Date(currentUser.lastLoginAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                {!hasUpdateEndpoint && (
                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      Profile editing is currently not available. This feature will be available soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
