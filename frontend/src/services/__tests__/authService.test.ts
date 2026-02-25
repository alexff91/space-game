import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/authService';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('isAuthenticated', () => {
    it('should return false when no token in localStorage', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when token exists in localStorage', () => {
      localStorage.setItem('token', 'test-jwt-token');
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('login', () => {
    it('should call api.post with credentials and store token', async () => {
      const mockResponse = {
        success: true,
        token: 'jwt-token-123',
        user: { id: 1, username: 'testuser', email: 'test@test.com' },
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-token-123');
      expect(result.user.username).toBe('testuser');
    });

    it('should not store token when login response has no token', async () => {
      const mockResponse = {
        success: false,
        token: '',
        user: null,
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      await authService.login({
        email: 'bad@test.com',
        password: 'wrong',
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should call api.post with registration data and store token', async () => {
      const mockResponse = {
        success: true,
        token: 'new-jwt-token',
        user: { id: 2, username: 'newuser', email: 'new@test.com' },
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.register({
        username: 'newuser',
        email: 'new@test.com',
        password: 'securepass',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        username: 'newuser',
        email: 'new@test.com',
        password: 'securepass',
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'new-jwt-token');
      expect(result.user.id).toBe(2);
    });
  });

  describe('logout', () => {
    it('should call api.post and remove token from localStorage', async () => {
      vi.mocked(api.post).mockResolvedValue(undefined);
      localStorage.setItem('token', 'existing-token');

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('getCurrentUser', () => {
    it('should call api.get for current user', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, username: 'testuser', email: 'test@test.com' },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result.data.username).toBe('testuser');
    });
  });
});
