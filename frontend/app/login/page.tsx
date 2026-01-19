'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={pageStyles.authContainer()}>
      <Card className={pageStyles.authCard()}>
        <CardHeader className={pageStyles.authCardHeader()}>
          <CardTitle className={pageStyles.authCardTitle()}>Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
                placeholder="Enter your password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className={formStyles.errorMessage()}>{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter 
            className={formStyles.formFooter()}
            style={{ gap: 'var(--spacing-lg)' }}
          >
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            <div className={formStyles.formFooterLink()}>
              Don't have an account?{' '}
              <Link href="/register" className={formStyles.formFooterPrimaryLink()}>
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

