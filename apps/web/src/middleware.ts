import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that logged-in users should NOT see (redirect them to their dashboard)
const AUTH_ONLY_PATHS = ['/login', '/register', '/verify-otp', '/forgot-password'];

// Role → dashboard path mapping
const ROLE_DASHBOARD: Record<string, string> = {
  WORKER: '/worker',
  CONTRACTOR: '/contractor',
  SUPER_ADMIN: '/admin',
  COMPANY_ADMIN: '/admin',
};

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Always allow Next.js internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Read the lightweight session hint cookies (set by the frontend on login, cleared on logout)
  const isLoggedIn = Boolean(request.cookies.get('dlc_session')?.value);
  const role = request.cookies.get('dlc_role')?.value ?? '';

  // If already logged in, redirect away from auth pages to the correct dashboard
  if (isLoggedIn && AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const dashboard = ROLE_DASHBOARD[role] ?? '/worker';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Let everything else through — the dashboard layout's AuthGuard handles
  // client-side auth checks and redirects unauthenticated users to /login.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
