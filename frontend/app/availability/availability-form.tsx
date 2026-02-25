'use client';

import * as React from 'react';
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
import { type Availability, type CreateAvailabilityDto } from '@/lib/api/availability';

const DAY_OPTIONS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const availabilityFormSchema = z
  .object({
    isRecurring: z.boolean().default(true),
    dayOfWeek: z.number().min(0).max(6).optional(),
    specificDate: z.string().optional(),
    startTime: z
      .string()
      .min(1, 'Start time is required')
      .regex(timeRegex, 'Start time must be in HH:mm format'),
    endTime: z
      .string()
      .min(1, 'End time is required')
      .regex(timeRegex, 'End time must be in HH:mm format'),
    effectiveFrom: z.string().optional(),
    effectiveUntil: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      if (data.dayOfWeek === undefined || data.dayOfWeek === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Day of week is required for recurring slots',
          path: ['dayOfWeek'],
        });
      }
    } else {
      if (!data.specificDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Specific date is required for one-off slots',
          path: ['specificDate'],
        });
      }
    }
  });

type AvailabilityFormData = z.infer<typeof availabilityFormSchema>;

interface AvailabilityFormProps {
  initialData?: Availability;
  onSubmit: (data: CreateAvailabilityDto) => void | Promise<void>;
  isLoading?: boolean;
}

export interface AvailabilityFormRef {
  submit: () => Promise<void>;
}

export const AvailabilityForm = React.forwardRef<AvailabilityFormRef, AvailabilityFormProps>(
  ({ initialData, onSubmit, isLoading = false }, ref) => {
    const form = useForm<AvailabilityFormData>({
      resolver: zodResolver(availabilityFormSchema),
      defaultValues: {
        isRecurring: initialData?.isRecurring ?? true,
        dayOfWeek: initialData?.dayOfWeek ?? undefined,
        specificDate: initialData?.specificDate ?? '',
        startTime: initialData?.startTime ?? '',
        endTime: initialData?.endTime ?? '',
        effectiveFrom: initialData?.effectiveFrom ?? '',
        effectiveUntil: initialData?.effectiveUntil ?? '',
      },
    });

    const isRecurring = form.watch('isRecurring');

    const handleSubmit = form.handleSubmit(async (data) => {
      const submitData: CreateAvailabilityDto = {
        startTime: data.startTime,
        endTime: data.endTime,
        isRecurring: data.isRecurring,
        dayOfWeek: data.isRecurring ? data.dayOfWeek : undefined,
        specificDate: !data.isRecurring ? data.specificDate || undefined : undefined,
        effectiveFrom: data.effectiveFrom || undefined,
        effectiveUntil: data.effectiveUntil || undefined,
      };
      await onSubmit(submitData);
    });

    React.useImperativeHandle(ref, () => ({
      submit: async () => {
        await handleSubmit();
      },
    }));

    return (
      <Form {...form}>
        <div className="space-y-4">
          {/* Recurring toggle */}
          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Recurring weekly slot</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Enable for a repeating weekly schedule; disable for a one-off date
                  </p>
                </div>
              </FormItem>
            )}
          />

          {/* Conditional: day of week OR specific date */}
          {isRecurring ? (
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Week *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value !== '' ? Number(e.target.value) : undefined)
                      }
                      disabled={isLoading}
                    >
                      <option value="">Select a day</option>
                      {DAY_OPTIONS.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="specificDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Date *</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Start / End time */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time *</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time *</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Effective from / until (recurring only) */}
          {isRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="effectiveFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective From</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="effectiveUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Effective Until</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </Form>
    );
  },
);

AvailabilityForm.displayName = 'AvailabilityForm';
