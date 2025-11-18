import { api } from './api';
import { Image, ApiResponse, PaginatedResponse } from '@/types';

interface GetImagesParams {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: number;
  source?: string;
}

export const imageService = {
  async getImages(params?: GetImagesParams): Promise<PaginatedResponse<Image[]>> {
    return api.get<PaginatedResponse<Image[]>>('/images', params);
  },

  async getImage(id: number): Promise<ApiResponse<Image>> {
    return api.get<ApiResponse<Image>>(`/images/${id}`);
  },

  async getRandomImage(): Promise<ApiResponse<Image>> {
    return api.get<ApiResponse<Image>>('/images/random');
  },

  async fetchNASAImages(page = 1, pageSize = 20): Promise<ApiResponse<Image[]>> {
    return api.post<ApiResponse<Image[]>>('/images/fetch/nasa', { page, pageSize });
  },

  async fetchESAImages(limit = 20, offset = 0): Promise<ApiResponse<Image[]>> {
    return api.post<ApiResponse<Image[]>>('/images/fetch/esa', { limit, offset });
  },
};
