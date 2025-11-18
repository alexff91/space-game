import { api } from './api';
import { Annotation, ApiResponse, PaginatedResponse, ConsensusAnnotation } from '@/types';

interface CreateAnnotationData {
  imageId: number;
  type: 'point' | 'rectangle' | 'polygon' | 'freeform';
  coordinates: any;
  category: string;
  confidence?: number;
  description?: string;
}

export const annotationService = {
  async createAnnotation(
    data: CreateAnnotationData
  ): Promise<ApiResponse<Annotation> & { pointsAwarded: number }> {
    return api.post<ApiResponse<Annotation> & { pointsAwarded: number }>(
      '/annotations',
      data
    );
  },

  async getImageAnnotations(imageId: number): Promise<ApiResponse<Annotation[]>> {
    return api.get<ApiResponse<Annotation[]>>(`/annotations/image/${imageId}`);
  },

  async getUserAnnotations(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Annotation[]>> {
    return api.get<PaginatedResponse<Annotation[]>>('/annotations/user', {
      page,
      limit,
    });
  },

  async getConsensusAnnotations(
    imageId: number
  ): Promise<ApiResponse<ConsensusAnnotation[]>> {
    return api.get<ApiResponse<ConsensusAnnotation[]>>(
      `/annotations/consensus/${imageId}`
    );
  },

  async validateAnnotation(id: number): Promise<ApiResponse<Annotation>> {
    return api.put<ApiResponse<Annotation>>(`/annotations/${id}/validate`);
  },
};
