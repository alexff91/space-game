import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ESA_API_URL = process.env.ESA_API_URL || 'https://esahubble.org/api/v1';

interface ESAImageParams {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
}

class ESAService {
  private baseURL: string;

  constructor() {
    this.baseURL = ESA_API_URL;
  }

  /**
   * Search ESA/Hubble images
   */
  async searchImages(params: ESAImageParams): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/images/`, {
        params: {
          limit: params.limit || 20,
          offset: params.offset || 0,
          search: params.search,
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      console.error('ESA API search error:', error);
      throw new Error('Failed to fetch images from ESA API');
    }
  }

  /**
   * Get specific image details
   */
  async getImage(imageId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/images/${imageId}/`,
        {
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error('ESA API image error:', error);
      throw new Error('Failed to fetch image from ESA API');
    }
  }

  /**
   * Fetch curated Hubble images
   */
  async fetchCuratedImages(limit = 20, offset = 0): Promise<any[]> {
    const searchResults = await this.searchImages({
      limit,
      offset,
      search: 'hubble',
    });

    return searchResults.results?.map((item: any) => ({
      esaId: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.resource_url,
      thumbnailUrl: item.thumbnail_url,
      credit: item.credit,
      releaseDate: item.release_date,
    })) || [];
  }
}

export default new ESAService();
