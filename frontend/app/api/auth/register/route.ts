import { NextRequest, NextResponse } from 'next/server';
import type { RegisterRequest, RegisterResponse } from '@/lib/api/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    
    // Call backend auth API directly
    const backendResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Registration failed' },
        { status: backendResponse.status }
      );
    }

    const data: RegisterResponse = await backendResponse.json();
    
    // Create response with user data
    const response = NextResponse.json({ 
      user: data.user,
      message: 'Registration successful'
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
