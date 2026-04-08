import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { isDemoMode, DEMO_USER } from '@/services/demoData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  /** Enter demo mode — sets up a demo user without backend */
  enterDemoMode: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      if (isDemoMode()) {
        // Demo mode: accept any credentials
        localStorage.setItem('token', 'demo-token');
        set({ user: DEMO_USER, isAuthenticated: true });
        return;
      }
      const response = await authService.login({ email, password });
      set({ user: response.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      if (isDemoMode()) {
        localStorage.setItem('token', 'demo-token');
        const user = { ...DEMO_USER, username, email };
        set({ user, isAuthenticated: true });
        return;
      }
      const response = await authService.register({ username, email, password });
      set({ user: response.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    if (!isDemoMode()) {
      try { await authService.logout(); } catch { /* ignore */ }
    }
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  fetchCurrentUser: async () => {
    if (!authService.isAuthenticated()) {
      return;
    }

    set({ isLoading: true });
    try {
      if (isDemoMode()) {
        set({ user: DEMO_USER, isAuthenticated: true });
        return;
      }
      const response = await authService.getCurrentUser();
      set({ user: response.data, isAuthenticated: true });
    } catch {
      // If backend is down, fall back to demo mode
      if (isDemoMode()) {
        set({ user: DEMO_USER, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  enterDemoMode: () => {
    localStorage.setItem('token', 'demo-token');
    set({ user: DEMO_USER, isAuthenticated: true });
  },
}));
