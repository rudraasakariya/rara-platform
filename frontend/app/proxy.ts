import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes - require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Auth routes - should redirect to dashboard if already logged in
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes with valid token
  // BUT: Don't redirect if invalid_token query param is present (prevents redirect loop)
  const hasInvalidTokenParam = request.nextUrl.searchParams.has('invalid_token');
  const referer = request.headers.get('referer');
  const isComingFromDashboard = referer?.includes('/dashboard');
  
  if (isAuthRoute && token && !hasInvalidTokenParam && !isComingFromDashboard) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If invalid_token param is present, clear the cookie
  if (hasInvalidTokenParam && token) {
    const response = NextResponse.next();
    response.cookies.delete('auth-token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
