import { NextRequest, NextResponse } from 'next/server';
import type { LoginRequest, LoginResponse } from '@/lib/api/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Call backend auth API directly
    const backendResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Login failed' },
        { status: backendResponse.status }
      );
    }

    const data: LoginResponse = await backendResponse.json();
    
    // Create response with user data
    const response = NextResponse.json({ 
      user: data.user,
      message: 'Login successful'
    });
    
    // Set httpOnly cookie with token
    response.cookies.set('auth-token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
