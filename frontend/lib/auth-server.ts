import { cookies } from 'next/headers';
import { authApi, type User } from './api/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Get the current authenticated user from server-side
 * Returns null if not authenticated
 */
export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify token with backend
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      // Token is invalid, clear it
      cookieStore.delete('auth-token');
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    // Network error or invalid response
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 * Use this in server components that require auth
 */
export async function requireAuth(): Promise<User> {
  const user = await getServerUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

/**
 * Check if user has a specific role
 */
export async function requireRole(role: 'admin' | 'tutor' | 'super_admin'): Promise<User> {
  const user = await requireAuth();
  
  if (user.role !== role && user.role !== 'super_admin') {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}
