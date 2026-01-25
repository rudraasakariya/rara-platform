'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sitesApi } from '@/lib/api/sites';
import { partnersApi } from '@/lib/api/partners';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';
import { Skeleton } from '@/components/ui/skeleton';

export function StructureContent() {
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
          <h1 className={pageStyles.dashboardTitle()}>Structure Overview</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            View statistics and manage your organization structure
          </p>
        </div>
      </div>

      {hasError && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="font-medium text-destructive">Error loading structure data</p>
            <p className="text-sm text-destructive mt-1">
              {sitesError ? getErrorMessage(sitesError) : 
               partnersError ? getErrorMessage(partnersError) : 
               'Please try again later.'}
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
              <Skeleton className="h-9 w-16" />
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
              <Skeleton className="h-9 w-16" />
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
              <Skeleton className="h-9 w-16" />
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
              <Skeleton className="h-9 w-16" />
            ) : (
              <p className="text-3xl font-bold">{activePartners.length}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to management pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline">
                <Link href="/sites">View All Sites</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/partners">View All Partners</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
