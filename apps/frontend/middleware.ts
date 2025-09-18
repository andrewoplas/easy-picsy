import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Handle redirects for clean URLs
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  if (request.nextUrl.pathname === '/register') {
    return NextResponse.redirect(new URL('/admin/register', request.url));
  }

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login' || 
        request.nextUrl.pathname === '/admin/register') {
      // If user is already logged in, redirect to performance dashboard
      if (session) {
        return NextResponse.redirect(new URL('/admin/dashboard/performance', request.url));
      }
      return response;
    }

    // For all other admin routes, require authentication
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/login', '/register', '/admin/:path*'],
};