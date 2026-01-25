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
import { type Site, type CreateSiteDto } from '@/lib/api/sites';
import { cn } from '@/lib/utils';

const siteFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  address: z.string().optional(),
  city: z.string().max(100, 'City must be less than 100 characters').optional().or(z.literal('')),
  state: z.string().max(50, 'State must be less than 50 characters').optional().or(z.literal('')),
  zipCode: z.string().max(20, 'Zip code must be less than 20 characters').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  active: z.boolean().default(true),
});

type SiteFormData = z.infer<typeof siteFormSchema>;

interface SiteFormProps {
  initialData?: Site;
  onSubmit: (data: CreateSiteDto) => void | Promise<void>;
  isLoading?: boolean;
}

export interface SiteFormRef {
  submit: () => Promise<void>;
}

export const SiteForm = React.forwardRef<SiteFormRef, SiteFormProps>(
  ({ initialData, onSubmit, isLoading = false }, ref) => {
    const form = useForm<SiteFormData>({
      resolver: zodResolver(siteFormSchema),
      defaultValues: {
        name: initialData?.name || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        zipCode: initialData?.zipCode || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        active: initialData?.active ?? true,
      },
    });

    const handleSubmit = form.handleSubmit(async (data) => {
      // Convert empty strings to undefined for optional fields
      const submitData: CreateSiteDto = {
        name: data.name,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        zipCode: data.zipCode || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
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
                <Input {...field} placeholder="Site name" />
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
                <Input {...field} placeholder="Street address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="State" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Zip code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email address" />
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
                  Whether this site is currently active
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

SiteForm.displayName = 'SiteForm';
