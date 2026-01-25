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
import { partnersApi, type Partner, type SearchPartnersQuery, type CreatePartnerDto } from '@/lib/api/partners';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';
import { PartnerForm, type PartnerFormRef } from './partner-form';

export function PartnersContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter state
  const [filters, setFilters] = React.useState<SearchPartnersQuery>({});
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPartner, setSelectedPartner] = React.useState<Partner | null>(null);
  
  // Form refs
  const createFormRef = React.useRef<PartnerFormRef>(null);
  const editFormRef = React.useRef<PartnerFormRef>(null);

  // Fetch partners with filters
  const {
    data: partners = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['partners', filters],
    queryFn: () => partnersApi.getAll(filters),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePartnerDto) => partnersApi.create(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Partner created successfully',
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['partners'] });
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
    mutationFn: ({ id, data }: { id: string; data: CreatePartnerDto }) =>
      partnersApi.update(id, data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Partner updated successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedPartner(null);
      queryClient.invalidateQueries({ queryKey: ['partners'] });
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
    mutationFn: (id: string) => partnersApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Partner deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setSelectedPartner(null);
      queryClient.invalidateQueries({ queryKey: ['partners'] });
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
    setFilters(newFilters as SearchPartnersQuery);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Action handlers
  const handleCreate = () => {
    setSelectedPartner(null);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (partner: Partner) => {
    // TODO: Navigate to detail page when implemented
    console.log('View partner:', partner);
  };

  const handleCreateSubmit = async (data: CreatePartnerDto) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditSubmit = async (data: CreatePartnerDto) => {
    if (selectedPartner) {
      await updateMutation.mutateAsync({ id: selectedPartner.id, data });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedPartner) {
      await deleteMutation.mutateAsync(selectedPartner.id);
    }
  };

  // Define columns
  const columns: ColumnDef<Partner>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      cell: (row) => row.type ? (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {row.type}
        </span>
      ) : <span className="text-muted-foreground">—</span>,
    },
    {
      id: 'contactName',
      header: 'Contact Name',
      accessorKey: 'contactName',
      cell: (row) => row.contactName || <span className="text-muted-foreground">—</span>,
    },
    {
      id: 'contactEmail',
      header: 'Contact Email',
      accessorKey: 'contactEmail',
      cell: (row) => row.contactEmail || <span className="text-muted-foreground">—</span>,
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
      key: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'School', value: 'School' },
        { label: 'Co', value: 'Co' },
        { label: 'Organization', value: 'Organization' },
        { label: 'Other', value: 'Other' },
      ],
    },
  ];

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Partners</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Manage your partners and organizations
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Partner
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
            <p className="font-medium">Failed to load partners</p>
            <p className="text-sm mt-1">{getErrorMessage(error)}</p>
          </div>
        )}

        <DataTable
          data={partners}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
          emptyMessage="No partners found"
        />
      </div>

      {/* Create Dialog */}
      <FormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create Partner"
        description="Add a new partner to the system"
        onSubmit={async () => {
          await createFormRef.current?.submit();
        }}
        onCancel={() => setIsCreateDialogOpen(false)}
        isLoading={createMutation.isPending}
        submitLabel="Create"
      >
        <PartnerForm
          ref={createFormRef}
          onSubmit={handleCreateSubmit}
          isLoading={createMutation.isPending}
        />
      </FormDialog>

      {/* Edit Dialog */}
      <FormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Partner"
        description="Update partner information"
        onSubmit={async () => {
          await editFormRef.current?.submit();
        }}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedPartner(null);
        }}
        isLoading={updateMutation.isPending}
        submitLabel="Update"
      >
        <PartnerForm
          ref={editFormRef}
          initialData={selectedPartner || undefined}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
        />
      </FormDialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Partner"
        description="Are you sure you want to delete {name}? This action cannot be undone."
        itemName={selectedPartner?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedPartner(null);
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
