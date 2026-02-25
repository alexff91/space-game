import { describe, it, expect, vi, beforeEach } from 'vitest';
import { imageService } from '@/services/imageService';
import { api } from '@/services/api';

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('imageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getImages', () => {
    it('should call api.get with default params', async () => {
      const mockResponse = {
        success: true,
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await imageService.getImages();

      expect(api.get).toHaveBeenCalledWith('/images', undefined);
      expect(result.success).toBe(true);
    });

    it('should pass filter params to api.get', async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, title: 'Andromeda Galaxy' }],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      await imageService.getImages({
        page: 1,
        limit: 10,
        category: 'galaxy',
        source: 'nasa',
      });

      expect(api.get).toHaveBeenCalledWith('/images', {
        page: 1,
        limit: 10,
        category: 'galaxy',
        source: 'nasa',
      });
    });
  });

  describe('getImage', () => {
    it('should fetch a single image by ID', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 42,
          title: 'Crab Nebula',
          source: 'hubble',
          annotationCount: 5,
        },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await imageService.getImage(42);

      expect(api.get).toHaveBeenCalledWith('/images/42');
      expect(result.data.title).toBe('Crab Nebula');
    });
  });

  describe('getRandomImage', () => {
    it('should fetch a random image', async () => {
      const mockResponse = {
        success: true,
        data: { id: 7, title: 'Random Star Field' },
      };
      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await imageService.getRandomImage();

      expect(api.get).toHaveBeenCalledWith('/images/random');
      expect(result.data.id).toBe(7);
    });
  });

  describe('fetchNASAImages', () => {
    it('should call NASA fetch endpoint with defaults', async () => {
      vi.mocked(api.post).mockResolvedValue({ success: true, data: [] });

      await imageService.fetchNASAImages();

      expect(api.post).toHaveBeenCalledWith('/images/fetch/nasa', {
        page: 1,
        pageSize: 20,
      });
    });

    it('should call NASA fetch endpoint with custom params', async () => {
      vi.mocked(api.post).mockResolvedValue({ success: true, data: [] });

      await imageService.fetchNASAImages(3, 50);

      expect(api.post).toHaveBeenCalledWith('/images/fetch/nasa', {
        page: 3,
        pageSize: 50,
      });
    });
  });

  describe('fetchESAImages', () => {
    it('should call ESA fetch endpoint with defaults', async () => {
      vi.mocked(api.post).mockResolvedValue({ success: true, data: [] });

      await imageService.fetchESAImages();

      expect(api.post).toHaveBeenCalledWith('/images/fetch/esa', {
        limit: 20,
        offset: 0,
      });
    });

    it('should call ESA fetch endpoint with custom params', async () => {
      vi.mocked(api.post).mockResolvedValue({ success: true, data: [] });

      await imageService.fetchESAImages(10, 30);

      expect(api.post).toHaveBeenCalledWith('/images/fetch/esa', {
        limit: 10,
        offset: 30,
      });
    });
  });
});
