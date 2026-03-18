import { api } from './api';
import { Image, ApiResponse, PaginatedResponse } from '@/types';
import { MOCK_IMAGES } from '@/data/mockData';

interface GetImagesParams {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: number;
  source?: string;
}

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const imageService = {
  async getImages(params?: GetImagesParams): Promise<PaginatedResponse<Image[]>> {
    try {
      return await api.get<PaginatedResponse<Image[]>>('/images', params);
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      return {
        success: true,
        data: MOCK_IMAGES,
        pagination: {
          page: 1,
          limit: 20,
          total: MOCK_IMAGES.length,
          pages: 1
        }
      };
    }
  },

  async getImage(id: number): Promise<ApiResponse<Image>> {
    try {
      return await api.get<ApiResponse<Image>>(`/images/${id}`);
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      const image = MOCK_IMAGES.find(img => img.id === id) || MOCK_IMAGES[0];
      return {
        success: true,
        data: image
      };
    }
  },

  async getRandomImage(): Promise<ApiResponse<Image>> {
    try {
      return await api.get<ApiResponse<Image>>('/images/random');
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
      return {
        success: true,
        data: randomImage
      };
    }
  },

  async fetchNASAImages(page = 1, pageSize = 20): Promise<ApiResponse<Image[]>> {
    try {
      return await api.post<ApiResponse<Image[]>>('/images/fetch/nasa', { page, pageSize });
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      return {
        success: true,
        data: MOCK_IMAGES
      };
    }
  },

  async fetchESAImages(limit = 20, offset = 0): Promise<ApiResponse<Image[]>> {
    try {
      return await api.post<ApiResponse<Image[]>>('/images/fetch/esa', { limit, offset });
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      return {
        success: true,
        data: MOCK_IMAGES
      };
    }
  },
};
