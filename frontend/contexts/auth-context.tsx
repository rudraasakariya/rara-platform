'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, type User, type LoginRequest, type RegisterRequest } from '@/lib/api/auth';
import { storeToken, removeToken, clearAuth, storeUser, getStoredUser, getToken } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Track when component has mounted on client to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if token exists on mount (only on client)
  const hasToken = typeof window !== 'undefined' && getToken() !== null;

  // Fetch current user
  const {
    data: userData,
    isLoading: isLoadingUser,
    refetch: refetchUser,
    error: userError,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: hasToken,
    retry: false,
  });

  // Update user state when data changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
      storeUser(userData);
    } else if (!hasToken) {
      setUser(null);
    }
  }, [userData, hasToken]);

  // Handle auth errors
  useEffect(() => {
    if (userError) {
      // Token is invalid, clear auth
      clearAuth();
      setUser(null);
    }
  }, [userError]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      storeToken(data.access_token);
      storeUser(data.user);
      setUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/dashboard');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      storeToken(data.access_token);
      storeUser(data.user);
      setUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/dashboard');
    },
  });

  const login = useCallback(
    async (credentials: LoginRequest) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      await registerMutation.mutateAsync(data);
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    queryClient.clear();
    router.push('/login');
  }, [router, queryClient]);

  // Ensure isLoading is false during SSR to prevent hydration mismatch
  const isLoading = isMounted 
    ? (isLoadingUser || loginMutation.isPending || registerMutation.isPending)
    : false;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refetchUser: () => refetchUser(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

