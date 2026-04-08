/**
 * Demo service — wraps real API services with demo data fallbacks.
 * When the backend is unavailable, this provides a fully functional
 * demo experience with realistic data.
 */

import {
  isDemoMode,
  DEMO_USER,
  DEMO_IMAGES,
  DEMO_ANNOTATIONS,
  DEMO_ACHIEVEMENTS,
  DEMO_LEADERBOARD,
  DEMO_MISSIONS,
  DEMO_DAILY_CHALLENGE,
  DEMO_STREAK,
  DEMO_USER_STATS,
} from './demoData';
import type { Image, User, Annotation, Achievement, Mission, ApiResponse, PaginatedResponse } from '@/types';

// Simulated network delay for realism
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Image service (demo)
// ---------------------------------------------------------------------------
export const demoImageService = {
  async getImages(params?: { page?: number; limit?: number; category?: string }): Promise<PaginatedResponse<Image[]>> {
    await delay();
    let images = [...DEMO_IMAGES];
    if (params?.category) {
      images = images.filter((img) => img.category === params.category);
    }
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const data = images.slice(start, start + limit);
    return {
      success: true,
      data,
      pagination: { page, limit, total: images.length, pages: Math.ceil(images.length / limit) },
    };
  },

  async getImage(id: number): Promise<ApiResponse<Image>> {
    await delay();
    const image = DEMO_IMAGES.find((img) => img.id === id) || DEMO_IMAGES[0];
    return { success: true, data: image };
  },

  async getRandomImage(): Promise<ApiResponse<Image>> {
    await delay(500);
    const image = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
    return { success: true, data: image };
  },
};

// ---------------------------------------------------------------------------
// Auth service (demo)
// ---------------------------------------------------------------------------
export const demoAuthService = {
  async login(_email: string, _password: string) {
    await delay(400);
    localStorage.setItem('token', 'demo-token');
    return { success: true, token: 'demo-token', user: DEMO_USER };
  },

  async register(_username: string, _email: string, _password: string) {
    await delay(400);
    localStorage.setItem('token', 'demo-token');
    return { success: true, token: 'demo-token', user: { ...DEMO_USER, username: _username, email: _email } };
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay();
    return { success: true, data: DEMO_USER };
  },

  async logout() {
    localStorage.removeItem('token');
  },
};

// ---------------------------------------------------------------------------
// User service (demo)
// ---------------------------------------------------------------------------
export const demoUserService = {
  async getLeaderboard(_limit = 50): Promise<ApiResponse<User[]>> {
    await delay();
    return { success: true, data: DEMO_LEADERBOARD };
  },

  async getUserStats(): Promise<ApiResponse<typeof DEMO_USER_STATS>> {
    await delay();
    return { success: true, data: DEMO_USER_STATS };
  },

  async getUserProfile(id: number): Promise<ApiResponse<User>> {
    await delay();
    const user = DEMO_LEADERBOARD.find((u) => u.id === id) || DEMO_USER;
    return { success: true, data: user };
  },
};

// ---------------------------------------------------------------------------
// Annotation service (demo)
// ---------------------------------------------------------------------------
let localAnnotations = [...DEMO_ANNOTATIONS];

export const demoAnnotationService = {
  async getImageAnnotations(imageId: number): Promise<ApiResponse<Annotation[]>> {
    await delay();
    const anns = localAnnotations.filter((a) => a.imageId === imageId);
    return { success: true, data: anns };
  },

  async getUserAnnotations(page = 1, limit = 20): Promise<PaginatedResponse<Annotation[]>> {
    await delay();
    const start = (page - 1) * limit;
    const data = localAnnotations.slice(start, start + limit);
    return {
      success: true, data,
      pagination: { page, limit, total: localAnnotations.length, pages: Math.ceil(localAnnotations.length / limit) },
    };
  },

  async createAnnotation(data: {
    imageId: number;
    type: string;
    coordinates: any;
    category: string;
    confidence?: number;
    description?: string;
  }): Promise<ApiResponse<Annotation> & { pointsAwarded: number }> {
    await delay(200);
    const points = data.confidence && data.confidence >= 4 ? 20 : 10;
    const newAnnotation: Annotation = {
      id: localAnnotations.length + 100,
      userId: DEMO_USER.id,
      imageId: data.imageId,
      type: data.type as any,
      coordinates: data.coordinates,
      category: data.category,
      confidence: data.confidence || 3,
      description: data.description,
      pointsAwarded: points,
      isValidated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: { id: DEMO_USER.id, username: DEMO_USER.username, level: DEMO_USER.level },
    };
    localAnnotations = [newAnnotation, ...localAnnotations];
    return { success: true, data: newAnnotation, pointsAwarded: points };
  },
};

// ---------------------------------------------------------------------------
// Mission service (demo)
// ---------------------------------------------------------------------------
export const demoMissionService = {
  async getMissions(): Promise<Mission[]> {
    await delay();
    return DEMO_MISSIONS.map((m) => ({
      ...m,
      progress: Math.floor(Math.random() * 80),
    })) as any;
  },

  async getDaily() {
    await delay();
    return DEMO_DAILY_CHALLENGE;
  },

  async getStreak() {
    await delay();
    return DEMO_STREAK;
  },
};

// ---------------------------------------------------------------------------
// Achievement service (demo)
// ---------------------------------------------------------------------------
export const demoAchievementService = {
  async getAchievements(): Promise<Achievement[]> {
    await delay();
    return DEMO_ACHIEVEMENTS;
  },
};

export { isDemoMode };
