import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware is intentionally kept minimal.
// Auth is managed entirely client-side in the dashboard layout via the
// Zustand auth store (sessionStorage per tab). Middleware-level cookie
// redirects conflict with per-tab session isolation and cause redirect
// loops when multiple roles are logged in across different tabs.

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

  // Pass all routes through — the dashboard layout (layout.tsx) handles
  // client-side auth checks and redirects unauthenticated users to /login.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
