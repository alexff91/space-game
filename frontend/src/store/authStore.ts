import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { isDemoMode } from '@/services/appMode';

/**
 * ПОЧЕМУ выброшен демо-вход: раньше при отсутствии бэкенда форма входа
 * принимала любой email с любым паролем и создавала пользователя с 4250
 * очками, 6 уровнем и 87 разметками. Это не «упрощение для демо», а
 * готовая учётная запись с выдуманной историей, которую человек считал
 * своей. Без сервера войти некуда — так теперь и написано.
 */

const NO_BACKEND = 'There is no backend in this build, so there are no accounts to sign in to.';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !isDemoMode() && authService.isAuthenticated(),
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email, password) => {
    if (isDemoMode()) throw new Error(NO_BACKEND);
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });
      set({ user: response.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username, email, password) => {
    if (isDemoMode()) throw new Error(NO_BACKEND);
    set({ isLoading: true });
    try {
      const response = await authService.register({ username, email, password });
      set({ user: response.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  fetchCurrentUser: async () => {
    if (isDemoMode() || !authService.isAuthenticated()) {
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data, isAuthenticated: true });
    } catch {
      // Сервер не подтвердил сессию — значит её нет. Показывать «вошли»
      // без подтверждения нельзя.
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
