'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { pageStyles } from '@/styles';
import type { User } from '@/lib/api/auth';
import { sitesApi } from '@/lib/api/sites';
import { partnersApi } from '@/lib/api/partners';
import { Loader2 } from 'lucide-react';

interface DashboardContentProps {
  initialUser: User;
}

export function DashboardContent({ initialUser }: DashboardContentProps) {
  const { user } = useAuth();
  // Use user from context if available, otherwise use initialUser from server
  const currentUser = user || initialUser;

  // Fetch all sites
  const {
    data: allSites = [],
    isLoading: isLoadingSites,
    error: sitesError,
  } = useQuery({
    queryKey: ['sites', 'all'],
    queryFn: () => sitesApi.getAll(),
  });

  // Fetch active sites
  const {
    data: activeSites = [],
    isLoading: isLoadingActiveSites,
    error: activeSitesError,
  } = useQuery({
    queryKey: ['sites', 'active'],
    queryFn: () => sitesApi.getAll({ active: true }),
  });

  // Fetch all partners
  const {
    data: allPartners = [],
    isLoading: isLoadingPartners,
    error: partnersError,
  } = useQuery({
    queryKey: ['partners', 'all'],
    queryFn: () => partnersApi.getAll(),
  });

  // Fetch active partners
  const {
    data: activePartners = [],
    isLoading: isLoadingActivePartners,
    error: activePartnersError,
  } = useQuery({
    queryKey: ['partners', 'active'],
    queryFn: () => partnersApi.getAll({ active: true }),
  });

  const isLoading =
    isLoadingSites ||
    isLoadingActiveSites ||
    isLoadingPartners ||
    isLoadingActivePartners;

  const hasError =
    sitesError ||
    activeSitesError ||
    partnersError ||
    activePartnersError;

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

      {hasError && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Error loading dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      <div 
        className={pageStyles.dashboardGrid()}
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--spacing-xl)',
        }}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Sites</CardTitle>
            <CardDescription>All sites in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSites ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="text-3xl font-bold">{allSites.length}</p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Active Sites</CardTitle>
            <CardDescription>Sites currently active</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActiveSites ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="text-3xl font-bold">{activeSites.length}</p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Partners</CardTitle>
            <CardDescription>All partners in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPartners ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="text-3xl font-bold">{allPartners.length}</p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Active Partners</CardTitle>
            <CardDescription>Partners currently active</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingActivePartners ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <p className="text-3xl font-bold">{activePartners.length}</p>
            )}
          </CardContent>
        </Card>

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
            <CardDescription>Navigate to management pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/sites">View All Sites</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/partners">View All Partners</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/structure">Structure Overview</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
