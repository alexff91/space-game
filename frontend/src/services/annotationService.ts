import { api } from './api';
import { Annotation, ApiResponse, PaginatedResponse, ConsensusAnnotation } from '@/types';
import { MOCK_ANNOTATIONS } from '@/data/mockData';

interface CreateAnnotationData {
  imageId: number;
  type: 'point' | 'rectangle' | 'polygon' | 'freeform';
  coordinates: any;
  category: string;
  confidence?: number;
  description?: string;
}

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const annotationService = {
  async createAnnotation(
    data: CreateAnnotationData
  ): Promise<ApiResponse<Annotation> & { pointsAwarded: number }> {
    try {
      return await api.post<ApiResponse<Annotation> & { pointsAwarded: number }>(
        '/annotations',
        data
      );
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      const newAnnotation: Annotation = {
        id: Math.floor(Math.random() * 10000),
        userId: 1,
        imageId: data.imageId,
        type: data.type,
        coordinates: data.coordinates,
        category: data.category,
        confidence: data.confidence,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        success: true,
        data: newAnnotation,
        pointsAwarded: 10
      };
    }
  },

  async getImageAnnotations(imageId: number): Promise<ApiResponse<Annotation[]>> {
    try {
      return await api.get<ApiResponse<Annotation[]>>(`/annotations/image/${imageId}`);
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      const annotations = MOCK_ANNOTATIONS.filter(a => a.imageId === imageId);
      return {
        success: true,
        data: annotations
      };
    }
  },

  async getUserAnnotations(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Annotation[]>> {
    try {
      return await api.get<PaginatedResponse<Annotation[]>>('/annotations/user', {
        page,
        limit,
      });
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      return {
        success: true,
        data: MOCK_ANNOTATIONS,
        pagination: {
          page: 1,
          limit: 20,
          total: MOCK_ANNOTATIONS.length,
          pages: 1
        }
      };
    }
  },

  async getConsensusAnnotations(
    imageId: number
  ): Promise<ApiResponse<ConsensusAnnotation[]>> {
    try {
      return await api.get<ApiResponse<ConsensusAnnotation[]>>(
        `/annotations/consensus/${imageId}`
      );
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      return {
        success: true,
        data: []
      };
    }
  },

  async validateAnnotation(id: number): Promise<ApiResponse<Annotation>> {
    try {
      return await api.put<ApiResponse<Annotation>>(`/annotations/${id}/validate`);
    } catch (error) {
      console.warn('API failed, using mock data');
      await delay(500);
      const annotation = MOCK_ANNOTATIONS.find(a => a.id === id);
      if (annotation) {
          return {
              success: true,
              data: { ...annotation, isValidated: true }
          };
      }
      return {
          success: false,
          data: {} as Annotation,
          message: 'Annotation not found'
      };
    }
  },
};
