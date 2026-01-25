'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { pageStyles, formStyles } from '@/styles';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(100, 'Last name is too long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password must be at most 32 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      toast({
        title: 'Registration successful',
        description: 'Your account has been created!',
      });
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={pageStyles.authContainer()}>
      <Card className={pageStyles.authCard()}>
        <CardHeader className={pageStyles.authCardHeader()}>
          <CardTitle className={pageStyles.authCardTitle()}>Create an account</CardTitle>
          <CardDescription>Enter your information to create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className={formStyles.formGrid()}>
              <div 
                className={formStyles.fieldContainer()}
                style={{ gap: 'var(--spacing-sm)' }}
              >
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register('firstName')}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className={formStyles.errorMessage()}>{errors.firstName.message}</p>
                )}
              </div>
              <div 
                className={formStyles.fieldContainer()}
                style={{ gap: 'var(--spacing-sm)' }}
              >
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register('lastName')}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className={formStyles.errorMessage()}>{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div 
              className={formStyles.fieldContainer()}
              style={{ gap: 'var(--spacing-sm)' }}
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className={formStyles.errorMessage()}>{errors.email.message}</p>
              )}
            </div>
            <div 
              className={formStyles.fieldContainer()}
              style={{ gap: 'var(--spacing-sm)' }}
            >
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className={formStyles.errorMessage()}>{errors.password.message}</p>
              )}
            </div>
            <div 
              className={formStyles.fieldContainer()}
              style={{ gap: 'var(--spacing-sm)' }}
            >
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className={formStyles.errorMessage()}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter 
            className={formStyles.formFooter()}
            style={{ gap: 'var(--spacing-lg)' }}
          >
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <div className={formStyles.formFooterLink()}>
              Already have an account?{' '}
              <Link href="/login" className={formStyles.formFooterPrimaryLink()}>
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

