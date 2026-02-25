'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type Session, type CreateSessionDto, type SessionStatus } from '@/lib/api/sessions';
import { sitesApi } from '@/lib/api/sites';
import { studentsApi } from '@/lib/api/students';
import { TaxonomySelector } from '@/components/curriculum/taxonomy-selector';
import { getErrorMessage } from '@/lib/api-client';
import { cn } from '@/lib/utils';

const sessionFormSchema = z
  .object({
    siteId: z.string().min(1, 'Site is required'),
    sessionDate: z.string().min(1, 'Session date is required'),
    scheduledStartTime: z.string().optional().or(z.literal('')),
    actualStartTime: z.string().optional().or(z.literal('')),
    actualEndTime: z.string().optional().or(z.literal('')),
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show']),
    minutes: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((value) => value === '' || value === undefined || Number(value) > 0, {
        message: 'Minutes must be greater than 0',
      }),
    notes: z.string().max(5000).optional().or(z.literal('')),
    studentIds: z.array(z.string()).min(1, 'Select at least one student'),
    clusterId: z.string().optional().or(z.literal('')),
    skillId: z.string().optional().or(z.literal('')),
  })
  .refine((data) => !!data.clusterId || !!data.skillId, {
    message: 'Select a cluster or skill',
    path: ['clusterId'],
  });

type SessionFormData = z.infer<typeof sessionFormSchema>;

interface SessionFormProps {
  initialData?: Session;
  onSubmit: (data: CreateSessionDto) => void | Promise<void>;
  isLoading?: boolean;
}

export interface SessionFormRef {
  submit: () => Promise<void>;
}

const statusOptions: Array<{ label: string; value: SessionStatus }> = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'No Show', value: 'no_show' },
];

export const SessionForm = React.forwardRef<SessionFormRef, SessionFormProps>(
  ({ initialData, onSubmit, isLoading = false }, ref) => {
    const form = useForm<SessionFormData>({
      resolver: zodResolver(sessionFormSchema),
      defaultValues: {
        siteId: initialData?.siteId || '',
        sessionDate: initialData?.sessionDate?.slice(0, 10) || '',
        scheduledStartTime: initialData?.scheduledStartTime || '',
        actualStartTime: initialData?.actualStartTime || '',
        actualEndTime: initialData?.actualEndTime || '',
        status: initialData?.status || 'scheduled',
        minutes: initialData?.minutes ? String(initialData.minutes) : '',
        notes: initialData?.notes || '',
        studentIds: initialData?.studentIds || [],
        clusterId: initialData?.clusterId || '',
        skillId: initialData?.skillId || '',
      },
    });

    const {
      data: sites = [],
      isLoading: isLoadingSites,
      error: sitesError,
    } = useQuery({
      queryKey: ['sites', 'active'],
      queryFn: () => sitesApi.getAll({ active: true }),
    });

    const {
      data: students = [],
      isLoading: isLoadingStudents,
      error: studentsError,
    } = useQuery({
      queryKey: ['students', 'sessions-form'],
      queryFn: () => studentsApi.getAll({ status: 'active' }),
    });

    const handleSubmit = form.handleSubmit(async (data) => {
      const submitData: CreateSessionDto = {
        siteId: data.siteId,
        sessionDate: data.sessionDate,
        scheduledStartTime: data.scheduledStartTime || undefined,
        actualStartTime: data.actualStartTime || undefined,
        actualEndTime: data.actualEndTime || undefined,
        status: data.status,
        minutes: data.minutes ? Number(data.minutes) : undefined,
        notes: data.notes || undefined,
        studentIds: data.studentIds,
        clusterId: data.clusterId || undefined,
        skillId: data.skillId || undefined,
      };

      await onSubmit(submitData);
    });

    React.useImperativeHandle(ref, () => ({
      submit: async () => {
        await handleSubmit();
      },
    }));

    const selectedStudentIds = form.watch('studentIds');

    return (
      <Form {...form}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="siteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading || isLoadingSites}
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                        'disabled:cursor-not-allowed disabled:opacity-50'
                      )}
                    >
                      <option value="">Select site</option>
                      {sites.map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Date *</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="scheduledStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Start Time</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading}
                      className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                        'disabled:cursor-not-allowed disabled:opacity-50'
                      )}
                    >
                      {statusOptions.map((statusOption) => (
                        <option key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="actualStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Start</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual End</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value || ''}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                      type="number"
                      min={1}
                      placeholder="60"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <textarea
                    value={field.value || ''}
                    onChange={field.onChange}
                    disabled={isLoading}
                    rows={3}
                    className={cn(
                      'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                    placeholder="Session notes"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Students *</FormLabel>
                <FormControl>
                  <select
                    multiple
                    value={field.value}
                    onChange={(event) => {
                      const nextValues = Array.from(event.target.selectedOptions).map((option) => option.value);
                      field.onChange(nextValues);
                    }}
                    disabled={isLoading || isLoadingStudents}
                    className={cn(
                      'flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                      'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                  >
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} {student.gradeLevel ? `• ${student.gradeLevel}` : ''}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Hold Command/Ctrl to select multiple students. Selected: {selectedStudentIds.length}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Curriculum Taxonomy *</FormLabel>
            <TaxonomySelector
              value={{
                clusterId: form.watch('clusterId'),
                skillId: form.watch('skillId'),
              }}
              onChange={(value) => {
                form.setValue('clusterId', value.clusterId || '');
                form.setValue('skillId', value.skillId || '');
              }}
              disabled={isLoading}
            />
            <FormField
              control={form.control}
              name="clusterId"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {(sitesError || studentsError) && (
            <p className="text-sm text-destructive">
              {getErrorMessage(sitesError || studentsError)}
            </p>
          )}
        </div>
      </Form>
    );
  }
);

SessionForm.displayName = 'SessionForm';
