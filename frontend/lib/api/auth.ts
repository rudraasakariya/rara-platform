import apiClient from '../api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'tutor' | 'super_admin';
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

export const authApi = {
  // Client-side login - calls Next.js API route which sets httpOnly cookie
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    // Return in the same format as before for compatibility
    return {
      access_token: '', // Token is now in httpOnly cookie, not returned
      user: data.user,
    };
  },

  // Client-side register - calls Next.js API route which sets httpOnly cookie
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    // Return in the same format as before for compatibility
    return {
      access_token: '', // Token is now in httpOnly cookie, not returned
      user: result.user,
    };
  },

  // Client-side getMe - calls Next.js API route which reads cookie
  getMe: async (): Promise<User> => {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return await response.json();
  },
};

