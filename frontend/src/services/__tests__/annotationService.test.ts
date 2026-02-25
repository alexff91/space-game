import { describe, it, expect, vi, beforeEach } from 'vitest';
import { annotationService } from '@/services/annotationService';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('annotationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAnnotation', () => {
    it('should post annotation data and return points awarded', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, category: 'galaxy', type: 'rectangle' },
        pointsAwarded: 25,
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const annotationData = {
        imageId: 42,
        type: 'rectangle' as const,
        coordinates: { x1: 100, y1: 100, x2: 200, y2: 200 },
        category: 'galaxy',
        confidence: 0.9,
      };

      const result = await annotationService.createAnnotation(annotationData);

      expect(api.post).toHaveBeenCalledWith('/annotations', annotationData);
      expect(result.pointsAwarded).toBe(25);
    });
  });

  describe('getImageAnnotations', () => {
    it('should fetch annotations for a specific image', async () => {
      const mockResponse = {
        success: true,
        data: [
          { id: 1, category: 'galaxy' },
          { id: 2, category: 'nebula' },
        ],
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await annotationService.getImageAnnotations(42);

      expect(api.get).toHaveBeenCalledWith('/annotations/image/42');
      expect(result.data).toHaveLength(2);
    });
  });

  describe('getUserAnnotations', () => {
    it('should fetch user annotations with default pagination', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      await annotationService.getUserAnnotations();

      expect(api.get).toHaveBeenCalledWith('/annotations/user', {
        page: 1,
        limit: 20,
      });
    });

    it('should fetch user annotations with custom pagination', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: [],
        pagination: { page: 3, limit: 10, total: 25, pages: 3 },
      });

      await annotationService.getUserAnnotations(3, 10);

      expect(api.get).toHaveBeenCalledWith('/annotations/user', {
        page: 3,
        limit: 10,
      });
    });
  });

  describe('getConsensusAnnotations', () => {
    it('should fetch consensus annotations for an image', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            category: 'galaxy',
            coordinates: { x: 150, y: 200 },
            agreementCount: 5,
            confidence: 0.95,
            userIds: [1, 2, 3, 4, 5],
          },
        ],
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await annotationService.getConsensusAnnotations(42);

      expect(api.get).toHaveBeenCalledWith('/annotations/consensus/42');
      expect(result.data[0].agreementCount).toBe(5);
    });
  });

  describe('validateAnnotation', () => {
    it('should validate an annotation by ID', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, isValidated: true, validatedBy: 99 },
      };
      vi.mocked(api.put).mockResolvedValue(mockResponse);

      const result = await annotationService.validateAnnotation(1);

      expect(api.put).toHaveBeenCalledWith('/annotations/1/validate');
      expect(result.data.isValidated).toBe(true);
    });
  });
});
