import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_API_URL = process.env.NASA_API_URL || 'https://api.nasa.gov';

interface NASAImageSearchParams {
  q?: string;
  media_type?: 'image' | 'video' | 'audio';
  year_start?: string;
  year_end?: string;
  page?: number;
  page_size?: number;
}

interface NASAImageItem {
  data: Array<{
    nasa_id: string;
    title: string;
    description?: string;
    date_created: string;
    keywords?: string[];
    media_type: string;
    center?: string;
  }>;
  links?: Array<{
    href: string;
    rel: string;
    render?: string;
  }>;
}

interface NASASearchResponse {
  collection: {
    items: NASAImageItem[];
    metadata: {
      total_hits: number;
    };
    links?: Array<{
      href: string;
      rel: string;
      prompt?: string;
    }>;
  };
}

class NASAService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = NASA_API_URL;
    this.apiKey = NASA_API_KEY;
  }

  /**
   * Search NASA Image and Video Library
   */
  async searchImages(params: NASAImageSearchParams): Promise<NASASearchResponse> {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          ...params,
          api_key: this.apiKey,
          media_type: params.media_type || 'image',
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      console.error('NASA API search error:', error);
      throw new Error('Failed to fetch images from NASA API');
    }
  }

  /**
   * Get asset details for a specific NASA ID
   */
  async getAsset(nasaId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/asset/${nasaId}`,
        {
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error('NASA API asset error:', error);
      throw new Error('Failed to fetch asset from NASA API');
    }
  }

  /**
   * Get metadata for a specific NASA ID
   */
  async getMetadata(nasaId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/metadata/${nasaId}`,
        {
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error('NASA API metadata error:', error);
      throw new Error('Failed to fetch metadata from NASA API');
    }
  }

  /**
   * Get Astronomy Picture of the Day (APOD)
   */
  async getAPOD(date?: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/planetary/apod`,
        {
          params: {
            api_key: this.apiKey,
            date,
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      console.error('NASA APOD API error:', error);
      throw new Error('Failed to fetch APOD from NASA API');
    }
  }

  /**
   * Fetch curated astronomical images for the game
   * Focuses on galaxies, nebulae, and deep space objects
   */
  async fetchCuratedImages(page = 1, pageSize = 20): Promise<any[]> {
    const keywords = [
      'galaxy',
      'nebula',
      'hubble',
      'deep space',
      'supernova',
      'black hole',
      'star cluster',
      'planetary nebula',
      'spiral galaxy',
      'elliptical galaxy',
    ];

    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

    const searchResults = await this.searchImages({
      q: randomKeyword,
      media_type: 'image',
      page,
      page_size: pageSize,
    });

    return searchResults.collection.items.map((item) => ({
      nasaId: item.data[0].nasa_id,
      title: item.data[0].title,
      description: item.data[0].description,
      imageUrl: item.links?.[0]?.href,
      keywords: item.data[0].keywords,
      dateCreated: item.data[0].date_created,
      center: item.data[0].center,
    }));
  }
}

export default new NASAService();
