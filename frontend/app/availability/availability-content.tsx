'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { FormDialog } from '@/components/ui/form-dialog';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  availabilityApi,
  type Availability,
  type CreateAvailabilityDto,
} from '@/lib/api/availability';
import { getErrorMessage } from '@/lib/api-client';
import { pageStyles } from '@/styles';
import { AvailabilityForm, type AvailabilityFormRef } from './availability-form';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function AvailabilityContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Availability | null>(null);

  // Form refs
  const createFormRef = React.useRef<AvailabilityFormRef>(null);
  const editFormRef = React.useRef<AvailabilityFormRef>(null);

  const {
    data: slots = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['availability'],
    queryFn: () => availabilityApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAvailabilityDto) => availabilityApi.create(data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Availability slot created' });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAvailabilityDto }) =>
      availabilityApi.update(id, data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Availability slot updated' });
      setIsEditDialogOpen(false);
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => availabilityApi.delete(id),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Availability slot deleted' });
      setIsDeleteDialogOpen(false);
      setSelected(null);
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getErrorMessage(error), variant: 'destructive' });
    },
  });

  const handleCreate = () => {
    setSelected(null);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (slot: Availability) => {
    setSelected(slot);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (slot: Availability) => {
    setSelected(slot);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = async (data: CreateAvailabilityDto) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditSubmit = async (data: CreateAvailabilityDto) => {
    if (selected) {
      await updateMutation.mutateAsync({ id: selected.id, data });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selected) {
      await deleteMutation.mutateAsync(selected.id);
    }
  };

  const columns: ColumnDef<Availability>[] = [
    {
      id: 'type',
      header: 'Type',
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.isRecurring
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}
        >
          {row.isRecurring ? 'Recurring' : 'One-off'}
        </span>
      ),
    },
    {
      id: 'schedule',
      header: 'Schedule',
      cell: (row) => {
        if (row.isRecurring && row.dayOfWeek !== null && row.dayOfWeek !== undefined) {
          return DAY_LABELS[row.dayOfWeek] ?? `Day ${row.dayOfWeek}`;
        }
        if (!row.isRecurring && row.specificDate) {
          return new Date(row.specificDate + 'T00:00:00').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        }
        return <span className="text-muted-foreground">—</span>;
      },
    },
    {
      id: 'time',
      header: 'Time',
      cell: (row) => `${row.startTime} – ${row.endTime}`,
    },
    {
      id: 'effective',
      header: 'Effective',
      cell: (row) => {
        if (!row.effectiveFrom && !row.effectiveUntil) {
          return <span className="text-muted-foreground">Always</span>;
        }
        const from = row.effectiveFrom
          ? new Date(row.effectiveFrom + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '…';
        const until = row.effectiveUntil
          ? new Date(row.effectiveUntil + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '…';
        return `${from} – ${until}`;
      },
    },
  ];

  // Derive a display name for delete dialog
  const getSlotLabel = (slot: Availability | null): string => {
    if (!slot) return '';
    if (slot.isRecurring && slot.dayOfWeek !== null && slot.dayOfWeek !== undefined) {
      return `${DAY_LABELS[slot.dayOfWeek]} ${slot.startTime}–${slot.endTime}`;
    }
    if (slot.specificDate) {
      return `${slot.specificDate} ${slot.startTime}–${slot.endTime}`;
    }
    return `${slot.startTime}–${slot.endTime}`;
  };

  return (
    <div>
      <div className={pageStyles.dashboardHeader()}>
        <div>
          <h1 className={pageStyles.dashboardTitle()}>Availability</h1>
          <p className={pageStyles.dashboardSubtitle()}>Manage your tutoring availability slots</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Slot
        </Button>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
            <p className="font-medium">Failed to load availability slots</p>
            <p className="text-sm mt-1">{getErrorMessage(error)}</p>
          </div>
        )}

        <DataTable
          data={slots}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          emptyMessage="No availability slots found"
        />
      </div>

      {/* Create Dialog */}
      <FormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Add Availability Slot"
        description="Define a new availability window for tutoring sessions"
        onSubmit={async () => {
          await createFormRef.current?.submit();
        }}
        onCancel={() => setIsCreateDialogOpen(false)}
        isLoading={createMutation.isPending}
        submitLabel="Create"
      >
        <AvailabilityForm
          ref={createFormRef}
          onSubmit={handleCreateSubmit}
          isLoading={createMutation.isPending}
        />
      </FormDialog>

      {/* Edit Dialog */}
      <FormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Availability Slot"
        description="Update this availability window"
        onSubmit={async () => {
          await editFormRef.current?.submit();
        }}
        onCancel={() => {
          setIsEditDialogOpen(false);
          setSelected(null);
        }}
        isLoading={updateMutation.isPending}
        submitLabel="Update"
      >
        <AvailabilityForm
          ref={editFormRef}
          initialData={selected || undefined}
          onSubmit={handleEditSubmit}
          isLoading={updateMutation.isPending}
        />
      </FormDialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Availability Slot"
        description="Are you sure you want to delete {name}? This action cannot be undone."
        itemName={getSlotLabel(selected)}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelected(null);
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
