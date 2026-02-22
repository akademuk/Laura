/**
 * ============================================================================
 * LAURA LMS — Next.js Middleware (Route Protection)
 * ============================================================================
 * Protects /dashboard and /admin routes from unauthenticated access.
 *
 * Current implementation: cookie-based session check.
 * Production: replace with Supabase Auth session verification.
 *
 * Why middleware and not layout-level guards?
 *   → Middleware runs on the Edge BEFORE any React code executes,
 *     so protected pages are never even rendered for unauthorized users.
 *     Layout-level guards show a flash of protected content before redirect.
 * ============================================================================
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes that require an authenticated user session */
const PROTECTED_PREFIXES = ['/dashboard', '/admin'];

/** Routes that only admin/curator roles can access */
const ADMIN_PREFIXES = ['/admin'];

/** Cookie name for the auth session — must match what login sets */
export const AUTH_COOKIE_NAME = 'laura-auth-session';
export const AUTH_ROLE_COOKIE = 'laura-auth-role';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Check if route needs protection ──
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) return NextResponse.next();

  // ── Check for auth session cookie ──
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (!sessionCookie?.value) {
    // No session → redirect to landing page
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Check admin routes require admin/curator role ──
  const isAdminRoute = ADMIN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isAdminRoute) {
    const roleCookie = request.cookies.get(AUTH_ROLE_COOKIE);
    const role = roleCookie?.value;
    if (role !== 'admin' && role !== 'curator') {
      // Not an admin → redirect to student dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
