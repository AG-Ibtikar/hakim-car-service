import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('hakim_auth_token')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login';
  const isCustomerLoginRoute = request.nextUrl.pathname === '/auth/login';
  const isCustomerRegisterRoute = request.nextUrl.pathname.startsWith('/auth/register');

  // If trying to access admin routes without token
  if (isAdminRoute && !token && !isAdminLoginRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If trying to access admin login with token, redirect to admin dashboard
  if (isAdminLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If trying to access customer auth routes with token, redirect to customer dashboard
  if ((isCustomerLoginRoute || isCustomerRegisterRoute) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/admin/:path*', '/auth/:path*', '/dashboard/:path*'],
}; 