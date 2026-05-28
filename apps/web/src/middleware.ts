import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that logged-in users should NOT see (redirect them to dashboard)
const AUTH_ONLY_PATHS = ['/login', '/register', '/verify-otp', '/forgot-password'];

// All paths that require authentication (protected at the client level via AuthGuard)
// The middleware only uses a lightweight session cookie to avoid unnecessary redirects.
// Real token verification happens client-side inside the dashboard layout.

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

  // Read the lightweight session hint cookie (set by the frontend on login, cleared on logout)
  // This cookie does NOT contain the JWT — it's just a boolean presence flag.
  const isLoggedIn = Boolean(request.cookies.get('dlc_session')?.value);

  // If already logged in, redirect away from auth pages to home
  if (isLoggedIn && AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Let everything else through — the dashboard layout's AuthGuard handles
  // client-side auth checks and redirects unauthenticated users to /login.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
