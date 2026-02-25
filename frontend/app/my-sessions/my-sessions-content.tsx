'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { FilterBar, type FilterConfig } from '@/components/ui/filter-bar';
import { FormDialog } from '@/components/ui/form-dialog';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  sessionsApi,
  type Session,
  type SearchSessionsQuery,
  type CreateSessionDto,
  type UpdateSessionDto,
} from '@/lib/api/sessions';
import { sitesApi } from '@/lib/api/sites';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';
import { SessionForm, type SessionFormRef } from './session-form';

export function MySessionsContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = React.useState<SearchSessionsQuery>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState<Session | null>(null);

  const createFormRef = React.useRef<SessionFormRef>(null);
  const editFormRef = React.useRef<SessionFormRef>(null);

  const {
    data: sessions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sessions', filters],
    queryFn: () => sessionsApi.getAll(filters),
  });

  const { data: sites = [] } = useQuery({
    queryKey: ['sites', 'all'],
    queryFn: () => sitesApi.getAll(),
  });

  const siteById = React.useMemo(
    () =>
      new Map(
        sites.map((site) => [site.id, site]),
      ),
    [sites],
  );

  const createMutation = useMutation({
    mutationFn: (data: CreateSessionDto) => sessionsApi.create(data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Session created successfully' });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (mutationError: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(mutationError),
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSessionDto }) => sessionsApi.update(id, data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Session updated successfully' });
      setIsEditDialogOpen(false);
      setSelectedSession(null);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (mutationError: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(mutationError),
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sessionsApi.delete(id),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Session deleted successfully' });
      setIsDeleteDialogOpen(false);
      setSelectedSession(null);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (mutationError: unknown) => {
      toast({
        title: 'Error',
        description: getErrorMessage(mutationError),
        variant: 'destructive',
      });
    },
  });

  const handleFilterChange = (nextFilters: Record<string, any>) => {
    setFilters(nextFilters as SearchSessionsQuery);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleCreateSubmit = async (data: CreateSessionDto) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditSubmit = async (data: CreateSessionDto) => {
    if (!selectedSession) {
      return;
    }

    await updateMutation.mutateAsync({
      id: selectedSession.id,
      data,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSession) {
      return;
    }

    await deleteMutation.mutateAsync(selectedSession.id);
  };

  const columns: ColumnDef<Session>[] = [
    {
      id: 'sessionDate',
      header: 'Date',
      cell: (row) =>
        new Date(row.sessionDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      id: 'siteId',
      header: 'Site',
      cell: (row) => siteById.get(row.siteId)?.name || '—',
    },
    {
      id: 'taxonomy',
      header: 'Taxonomy',
      cell: (row) => {
        const code = row.skillCode || row.clusterCode;
        const label = row.skillLabel || row.clusterLabel;
        if (!code) {
          return <span className="text-muted-foreground">—</span>;
        }
        return (
          <div>
            <p className="font-medium">{code}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{label}</p>
          </div>
        );
      },
    },
    {
      id: 'studentCount',
      header: 'Students',
      accessorKey: 'studentCount',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
  ];

  const filterConfigs: FilterConfig[] = [
    {
      key: 'siteId',
      label: 'Site',
      type: 'select',
      options: sites.map((site) => ({ value: site.id, label: site.name })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'no_show', label: 'No Show' },
      ],
    },
    {
      key: 'startDate',
      label: 'Start Date',
      type: 'text',
      placeholder: 'YYYY-MM-DD',
    },
    {
      key: 'endDate',
      label: 'End Date',
      type: 'text',
      placeholder: 'YYYY-MM-DD',
    },
  ];

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>My Sessions</h1>
          <p className={pageStyles.dashboardSubtitle()}>
            Manage tutoring sessions, student batches, and taxonomy-linked standards.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Session
        </Button>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6">
        <FilterBar
          filters={filterConfigs}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Failed to load sessions</p>
            <p className="mt-1 text-sm">{getErrorMessage(error)}</p>
          </div>
        )}

        <DataTable
          data={sessions}
          columns={columns}
          onEdit={(session) => {
            setSelectedSession(session);
            setIsEditDialogOpen(true);
          }}
          onDelete={(session) => {
            setSelectedSession(session);
            setIsDeleteDialogOpen(true);
          }}
          onView={(session) => {
            setSelectedSession(session);
            setIsEditDialogOpen(true);
          }}
          isLoading={isLoading}
          emptyMessage="No sessions found"
        />
      </div>

      <FormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create Session"
        description="Create a tutoring session with students and one curriculum selection"
        onSubmit={async () => {
          await createFormRef.current?.submit();
        }}
        onCancel={() => setIsCreateDialogOpen(false)}
        isLoading={createMutation.isPending}
        submitLabel="Create"
      >
        <SessionForm
          ref={createFormRef}
          onSubmit={handleCreateSubmit}
          isLoading={createMutation.isPending}
        />
      </FormDialog>

      <FormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Session"
        description="Update session details, students, and taxonomy selection"
        onSubmit={async () => {
          await editFormRef.current?.submit();
        }}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedSession(null);
        }}
        isLoading={updateMutation.isPending}
        submitLabel="Save"
      >
        {selectedSession && (
          <SessionForm
            ref={editFormRef}
            initialData={selectedSession}
            onSubmit={handleEditSubmit}
            isLoading={updateMutation.isPending}
          />
        )}
      </FormDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action cannot be undone."
        itemName={selectedSession?.id}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedSession(null);
        }}
        isLoading={deleteMutation.isPending}
        confirmLabel="Delete"
      />
    </div>
  );
}
