import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '@/services/userService';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile by ID', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 5,
          username: 'stargazer',
          score: 2500,
          level: 7,
        },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await userService.getUserProfile(5);

      expect(api.get).toHaveBeenCalledWith('/users/5');
      expect(result.data.username).toBe('stargazer');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile data', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, username: 'updated_name' },
      };
      vi.mocked(api.put).mockResolvedValue(mockResponse);

      const result = await userService.updateProfile({
        username: 'updated_name',
      });

      expect(api.put).toHaveBeenCalledWith('/users/profile', {
        username: 'updated_name',
      });
      expect(result.data.username).toBe('updated_name');
    });
  });

  describe('getLeaderboard', () => {
    it('should fetch leaderboard with default limit', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: 1, username: 'top_player', score: 10000 },
          { id: 2, username: 'runner_up', score: 8000 },
        ],
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await userService.getLeaderboard();

      expect(api.get).toHaveBeenCalledWith('/users/leaderboard', { limit: 50 });
      expect(result.data).toHaveLength(2);
    });

    it('should fetch leaderboard with custom limit', async () => {
      vi.mocked(api.get).mockResolvedValue({ success: true, data: [] });

      await userService.getLeaderboard(10);

      expect(api.get).toHaveBeenCalledWith('/users/leaderboard', { limit: 10 });
    });
  });

  describe('getUserStats', () => {
    it('should fetch user stats', async () => {
      const mockResponse = {
        success: true,
        data: {
          annotationCount: 150,
          validatedCount: 45,
          achievementCount: 8,
          categoryBreakdown: [
            { category: 'galaxy', count: 60 },
            { category: 'nebula', count: 40 },
          ],
          user: { score: 3000, level: 6, experience: 2800 },
        },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await userService.getUserStats();

      expect(api.get).toHaveBeenCalledWith('/users/stats');
      expect(result.data.annotationCount).toBe(150);
      expect(result.data.categoryBreakdown).toHaveLength(2);
    });
  });
});
