'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { FilterBar, type FilterConfig } from '@/components/ui/filter-bar';
import { FormDialog } from '@/components/ui/form-dialog';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { useToast } from '@/hooks/use-toast';
import { sitesApi, type Site, type SearchSitesQuery, type CreateSiteDto } from '@/lib/api/sites';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';
import { SiteForm, type SiteFormRef } from './site-form';

export function SitesContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter state
  const [filters, setFilters] = React.useState<SearchSitesQuery>({});
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState<Site | null>(null);
  
  // Form refs
  const createFormRef = React.useRef<SiteFormRef>(null);
  const editFormRef = React.useRef<SiteFormRef>(null);

  // Fetch sites with filters
  const {
    data: sites = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sites', filters],
    queryFn: () => sitesApi.getAll(filters),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateSiteDto) => sitesApi.create(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Site created successfully',
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateSiteDto }) =>
      sitesApi.update(id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Site updated successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedSite(null);
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => sitesApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Site deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setSelectedSite(null);
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  // Filter handlers
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters as SearchSitesQuery);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Action handlers
  const handleCreate = () => {
    setSelectedSite(null);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (site: Site) => {
    setSelectedSite(site);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (site: Site) => {
    setSelectedSite(site);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (site: Site) => {
    // TODO: Navigate to detail page when implemented
    console.log('View site:', site);
  };

  const handleCreateSubmit = async (data: CreateSiteDto) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditSubmit = async (data: CreateSiteDto) => {
    if (selectedSite) {
      await updateMutation.mutateAsync({ id: selectedSite.id, data });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedSite) {
      await deleteMutation.mutateAsync(selectedSite.id);
    }
  };

  // Define columns
  const columns: ColumnDef<Site>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'city',
      header: 'City',
      accessorKey: 'city',
      cell: (row) => row.city || <span className="text-muted-foreground">—</span>,
    },
    {
      id: 'state',
      header: 'State',
      accessorKey: 'state',
      cell: (row) => row.state || <span className="text-muted-foreground">—</span>,
    },
    {
      id: 'active',
      header: 'Status',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          {row.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'created',
      header: 'Created',
      cell: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
  ];

  // Define filter config
  const filterConfigs: FilterConfig[] = [
    {
      key: 'active',
      label: 'Status',
      type: 'boolean',
    },
    {
      key: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'Filter by city',
    },
    {
      key: 'state',
      label: 'State',
      type: 'text',
      placeholder: 'Filter by state',
    },
  ];

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Sites</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Manage your sites and locations
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Site
        </Button>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6">
        <FilterBar
          filters={filterConfigs}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="font-medium">Failed to load sites</p>
            <p className="text-sm mt-1">{getErrorMessage(error)}</p>
          </div>
        )}

        <DataTable
          data={sites}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
          emptyMessage="No sites found"
        />
      </div>

      {/* Create Dialog */}
      <FormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create Site"
        description="Add a new site to the system"
        onSubmit={async () => {
          await createFormRef.current?.submit();
        }}
        onCancel={() => setIsCreateDialogOpen(false)}
        isLoading={createMutation.isPending}
        submitLabel="Create"
      >
        <SiteForm
          ref={createFormRef}
          onSubmit={handleCreateSubmit}
          isLoading={createMutation.isPending}
        />
      </FormDialog>

      {/* Edit Dialog */}
      <FormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Site"
        description="Update site information"
        onSubmit={async () => {
          await editFormRef.current?.submit();
        }}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedSite(null);
        }}
        isLoading={updateMutation.isPending}
        submitLabel="Update"
      >
        <SiteForm
          ref={editFormRef}
          initialData={selectedSite || undefined}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
        />
      </FormDialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Site"
        description="Are you sure you want to delete {name}? This action cannot be undone."
        itemName={selectedSite?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSite(null);
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
