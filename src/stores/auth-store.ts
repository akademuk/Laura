/**
 * ============================================================================
 * LAURA LMS — Auth Store (Zustand)
 * ============================================================================
 * Manages the currently authenticated user, role, and session state.
 * In production this syncs with Supabase Auth; now uses mock data.
 * ============================================================================
 */

import { create } from 'zustand';
import type { User, UserRole } from '@/types/lms';
import { USERS } from '@/lib/mock-data';

/** Cookie names — must match middleware.ts */
const AUTH_COOKIE_NAME = 'laura-auth-session';
const AUTH_ROLE_COOKIE = 'laura-auth-role';

/** Set a cookie (client-side) */
function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

/** Delete a cookie (client-side) */
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

interface AuthState {
  /** Currently authenticated user (null = logged out) */
  user: User | null;
  /** Quick role accessor */
  role: UserRole | null;
  /** Whether auth has been initialized */
  isLoaded: boolean;
  /** Loading state for login/logout operations */
  isLoading: boolean;

  /** Simulate login — selects user by ID from mock data */
  login: (userId: string) => void;
  /** Clear session */
  logout: () => void;
  /** Initialize auth state (call once on app mount) */
  initialize: () => void;

  /** Role guard helpers */
  isAdmin: () => boolean;
  isCurator: () => boolean;
  isStudent: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  isLoaded: false,
  isLoading: false,

  login: (userId: string) => {
    set({ isLoading: true });
    // Simulate async auth
    const foundUser = USERS.find((u) => u.id === userId) ?? null;
    // Set auth cookies so middleware can validate protected routes
    if (foundUser) {
      setCookie(AUTH_COOKIE_NAME, foundUser.id);
      setCookie(AUTH_ROLE_COOKIE, foundUser.role);
    }
    set({
      user: foundUser,
      role: foundUser?.role ?? null,
      isLoading: false,
      isLoaded: true,
    });
  },

  logout: () => {
    // Clear auth cookies
    deleteCookie(AUTH_COOKIE_NAME);
    deleteCookie(AUTH_ROLE_COOKIE);
    set({ user: null, role: null });
  },

  initialize: () => {
    // In production: check Supabase session
    // For dev: auto-login as student
    const defaultUser = USERS.find((u) => u.id === 'usr-student-001') ?? null;
    if (defaultUser) {
      setCookie(AUTH_COOKIE_NAME, defaultUser.id);
      setCookie(AUTH_ROLE_COOKIE, defaultUser.role);
    }
    set({
      user: defaultUser,
      role: defaultUser?.role ?? null,
      isLoaded: true,
    });
  },

  isAdmin: () => get().role === 'admin',
  isCurator: () => get().role === 'curator',
  isStudent: () => get().role === 'student',
}));
