import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { api, tokenStorage } from '@/lib/api';
import type { AuthState, AuthTokens, LoginFormData, LoginResponse, OtpFormData, RegisterFormData, User } from '@/types';

interface AuthActions {
  login: (data: LoginFormData) => Promise<LoginResponse>;
  loginWithOtp: (data: OtpFormData) => Promise<LoginResponse>;
  sendOtp: (phone: string, purpose: string) => Promise<{ devOtp?: string; message: string; expiresInMinutes: number; phone: string }>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
};

// Per-tab storage: each browser tab maintains its own auth session.
// This allows Worker, Contractor, and Admin to be logged in simultaneously
// in separate tabs without overwriting each other.
// sessionStorage persists across page refreshes within the same tab,
// but is isolated between tabs — exactly what we need.
const perTabStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    // SSR fallback: no-op storage (server never needs auth state)
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return sessionStorage;
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (data: LoginFormData) => {
        set({ isLoading: true });
        try {
          const response = await api.post<{ success: boolean; data: LoginResponse }>('/auth/login/email', data);
          const { user, tokens } = response.data;
          tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
          set({ user, tokens, isAuthenticated: true, isLoading: false });
          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      sendOtp: async (phone: string, purpose: string) => {
        const res = await api.post<{ success: boolean; data: { message: string; expiresInMinutes: number; phone: string; devOtp?: string } }>('/auth/otp/send', { phone, purpose });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (res as any).data as { devOtp?: string; message: string; expiresInMinutes: number; phone: string };
      },

      loginWithOtp: async (data: OtpFormData) => {
        set({ isLoading: true });
        try {
          const response = await api.post<{ success: boolean; data: LoginResponse }>('/auth/otp/verify', data);
          const { user, tokens } = response.data;
          tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
          set({ user, tokens, isAuthenticated: true, isLoading: false });
          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterFormData) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/register', data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          const { tokens } = get();
          if (tokens) await api.post('/auth/logout');
        } catch {
          // ignore network errors on logout
        } finally {
          tokenStorage.clearTokens();
          set(initialState);
        }
      },

      refreshSession: async () => {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) { set(initialState); return; }
        try {
          const response = await api.post<{ success: boolean; data: AuthTokens }>('/auth/refresh', { refreshToken });
          const tokens = response.data;
          tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
          set({ tokens, isAuthenticated: true });
        } catch {
          tokenStorage.clearTokens();
          set(initialState);
        }
      },

      setUser: (user: User) => set({ user }),
      setTokens: (tokens: AuthTokens) => set({ tokens, isAuthenticated: true }),
      clearAuth: () => {
        tokenStorage.clearTokens();
        set(initialState);
      },
    }),
    {
      name: 'dlc-auth',
      storage: perTabStorage,
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
