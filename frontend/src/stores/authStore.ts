import { ApiError,authService } from '@/api';
import { create } from 'zustand';
import { clearSessionToken,readSessionToken,storeSessionToken } from '../lib/session';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

let authCheckInFlight: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: readSessionToken(),
  isAuthenticated: !!readSessionToken(),
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(username, password);
      const token = res.data.access_token;
      if (!token) throw new ApiError('The authentication service did not return a session token. Please try again.');
      const user = res.data.user || {
        id: '1',
        username,
        role: 'commander',
        fullName: 'Commander ' + username,
      };

      storeSessionToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      const message =
        (err instanceof ApiError ? err.message : err instanceof Error ? err.message : null) ||
        'Authentication failed. Please verify credentials.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: () => {
    clearSessionToken();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    if (authCheckInFlight) return authCheckInFlight;
    const token = readSessionToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    authCheckInFlight = (async () => {
      try {
        const res = await authService.getMe();
        if (res.data) {
          set({
            user: res.data,
            isAuthenticated: true,
            token,
          });
        }
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          clearSessionToken();
          set({ isAuthenticated: false, user: null, token: null });
        } else {
          // Keep the local session during transient network or rate-limit failures.
          set({ isAuthenticated: true, token, user: null });
        }
      }
    })();
    try {
      await authCheckInFlight;
    } finally {
      authCheckInFlight = null;
    }
  },

  clearError: () => set({ error: null }),
}));
