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
import { type Partner, type CreatePartnerDto, type PartnerType } from '@/lib/api/partners';
import { cn } from '@/lib/utils';

const partnerFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  type: z.enum(['School', 'Co', 'Organization', 'Other']).optional().or(z.literal('')),
  contactName: z.string().max(255, 'Contact name must be less than 255 characters').optional().or(z.literal('')),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactPhone: z.string().max(20, 'Phone must be less than 20 characters').optional().or(z.literal('')),
  address: z.string().optional(),
  active: z.boolean().default(true),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

interface PartnerFormProps {
  initialData?: Partner;
  onSubmit: (data: CreatePartnerDto) => void | Promise<void>;
  isLoading?: boolean;
}

export interface PartnerFormRef {
  submit: () => Promise<void>;
}

export const PartnerForm = React.forwardRef<PartnerFormRef, PartnerFormProps>(
  ({ initialData, onSubmit, isLoading = false }, ref) => {
    const form = useForm<PartnerFormData>({
      resolver: zodResolver(partnerFormSchema),
      defaultValues: {
        name: initialData?.name || '',
        type: initialData?.type || '',
        contactName: initialData?.contactName || '',
        contactEmail: initialData?.contactEmail || '',
        contactPhone: initialData?.contactPhone || '',
        address: initialData?.address || '',
        active: initialData?.active ?? true,
      },
    });

    const handleSubmit = form.handleSubmit(async (data) => {
      // Convert empty strings to undefined for optional fields
      const submitData: CreatePartnerDto = {
        name: data.name,
        type: data.type || undefined,
        contactName: data.contactName || undefined,
        contactEmail: data.contactEmail || undefined,
        contactPhone: data.contactPhone || undefined,
        address: data.address || undefined,
        active: data.active,
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Partner name" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <select
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                  disabled={isLoading}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <option value="">Select type</option>
                  <option value="School">School</option>
                  <option value="Co">Co</option>
                  <option value="Organization">Organization</option>
                  <option value="Other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Contact name" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="contact@example.com" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="Phone number" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Street address" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className={cn(
                    'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Whether this partner is currently active
                </p>
              </div>
            </FormItem>
          )}
        />
        </div>
      </Form>
    );
  }
);

PartnerForm.displayName = 'PartnerForm';
