import { Request, Response } from 'express';
import { Image } from '../models';
import nasaService from '../services/nasaService';
import esaService from '../services/esaService';
import { Op } from 'sequelize';

// @desc    Get all images
// @route   GET /api/images
// @access  Public
export const getImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;
    const source = req.query.source as string;

    const where: any = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = parseInt(difficulty);
    }

    if (source) {
      where.source = source;
    }

    const { rows: images, count: total } = await Image.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching images',
    });
  }
};

// @desc    Get single image
// @route   GET /api/images/:id
// @access  Public
export const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = await Image.findByPk(req.params.id, {
      include: ['annotations'],
    });

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Image not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching image',
    });
  }
};

// @desc    Get random image for annotation
// @route   GET /api/images/random
// @access  Private
export const getRandomImage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get images with fewer annotations (prioritize)
    const image = await Image.findOne({
      where: {
        isActive: true,
        annotationCount: {
          [Op.lt]: 10, // Less than 10 annotations
        },
      },
      order: [
        ['annotationCount', 'ASC'],
        [Image.sequelize!.random()],
      ],
    });

    if (!image) {
      // If no images with low annotation count, get any random image
      const anyImage = await Image.findOne({
        where: { isActive: true },
        order: [Image.sequelize!.random()],
      });

      if (!anyImage) {
        res.status(404).json({
          success: false,
          message: 'No images available',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: anyImage,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching random image',
    });
  }
};

// @desc    Fetch images from NASA API and store
// @route   POST /api/images/fetch/nasa
// @access  Private (Admin/Researcher only)
export const fetchNASAImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, pageSize = 20 } = req.body;

    const images = await nasaService.fetchCuratedImages(page, pageSize);

    const savedImages = [];

    for (const img of images) {
      // Check if image already exists
      const existing = await Image.findOne({
        where: { nasaId: img.nasaId },
      });

      if (!existing && img.imageUrl) {
        const newImage = await Image.create({
          nasaId: img.nasaId,
          title: img.title,
          description: img.description,
          imageUrl: img.imageUrl,
          source: 'nasa',
          metadata: {
            keywords: img.keywords,
            center: img.center,
          },
          tags: img.keywords || [],
          difficulty: Math.floor(Math.random() * 5) + 1, // Random difficulty for now
        });

        savedImages.push(newImage);
      }
    }

    res.status(201).json({
      success: true,
      message: `Fetched and saved ${savedImages.length} new images`,
      data: savedImages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching NASA images',
    });
  }
};

// @desc    Fetch images from ESA API and store
// @route   POST /api/images/fetch/esa
// @access  Private (Admin/Researcher only)
export const fetchESAImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 20, offset = 0 } = req.body;

    const images = await esaService.fetchCuratedImages(limit, offset);

    const savedImages = [];

    for (const img of images) {
      // Check if image already exists
      const existing = await Image.findOne({
        where: {
          title: img.title,
          source: 'esa',
        },
      });

      if (!existing && img.imageUrl) {
        const newImage = await Image.create({
          title: img.title,
          description: img.description,
          imageUrl: img.imageUrl,
          thumbnailUrl: img.thumbnailUrl,
          source: 'esa',
          metadata: {
            esaId: img.esaId,
            credit: img.credit,
            releaseDate: img.releaseDate,
          },
          difficulty: Math.floor(Math.random() * 5) + 1,
        });

        savedImages.push(newImage);
      }
    }

    res.status(201).json({
      success: true,
      message: `Fetched and saved ${savedImages.length} new images`,
      data: savedImages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching ESA images',
    });
  }
};
