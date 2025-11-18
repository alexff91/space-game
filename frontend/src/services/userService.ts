import { api } from './api';
import { User, ApiResponse } from '@/types';

interface UpdateProfileData {
  username?: string;
  email?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
}

interface UserStats {
  annotationCount: number;
  validatedCount: number;
  achievementCount: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  user: {
    score: number;
    level: number;
    experience: number;
  };
}

export const userService = {
  async getUserProfile(id: number): Promise<ApiResponse<User>> {
    return api.get<ApiResponse<User>>(`/users/${id}`);
  },

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    return api.put<ApiResponse<User>>('/users/profile', data);
  },

  async getLeaderboard(limit = 50): Promise<ApiResponse<User[]>> {
    return api.get<ApiResponse<User[]>>('/users/leaderboard', { limit });
  },

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return api.get<ApiResponse<UserStats>>('/users/stats');
  },
};
