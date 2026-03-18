import { api } from './api';
import { User, ApiResponse } from '@/types';
import { MOCK_USER } from '@/data/mockData';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      const token = 'mock-token';
      localStorage.setItem('token', token);
      return {
        success: true,
        token,
        user: { ...MOCK_USER, ...data, id: Math.floor(Math.random() * 1000) }
      };
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      const token = 'mock-token';
      localStorage.setItem('token', token);
      return {
        success: true,
        token,
        user: MOCK_USER
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('API failed, using mock data');
    }
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await api.get<ApiResponse<User>>('/auth/me');
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      return {
        success: true,
        data: MOCK_USER
      };
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
