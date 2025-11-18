import { Request, Response } from 'express';
import { Annotation, Image, User } from '../models';
import { AuthRequest } from '../middleware/auth';
import { calculateConsensus } from '../utils/consensus';

// @desc    Create annotation
// @route   POST /api/annotations
// @access  Private
export const createAnnotation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { imageId, type, coordinates, category, confidence, description } = req.body;

    // Verify image exists
    const image = await Image.findByPk(imageId);

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Image not found',
      });
      return;
    }

    // Create annotation
    const annotation = await Annotation.create({
      userId: req.user.id,
      imageId,
      type,
      coordinates,
      category,
      confidence,
      description,
      metadata: {
        userAgent: req.headers['user-agent'],
        timestamp: new Date(),
      },
    });

    // Update image annotation count
    await image.increment('annotationCount');

    // Award points to user
    const pointsAwarded = 10; // Base points
    await User.increment(
      { score: pointsAwarded, experience: pointsAwarded },
      { where: { id: req.user.id } }
    );

    // Update annotation with points
    await annotation.update({ pointsAwarded });

    // Calculate consensus (async, don't wait)
    calculateConsensus(imageId).catch((err) =>
      console.error('Consensus calculation error:', err)
    );

    res.status(201).json({
      success: true,
      data: annotation,
      pointsAwarded,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating annotation',
    });
  }
};

// @desc    Get annotations for an image
// @route   GET /api/annotations/image/:imageId
// @access  Public
export const getImageAnnotations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const annotations = await Annotation.findAll({
      where: { imageId: req.params.imageId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'level'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: annotations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching annotations',
    });
  }
};

// @desc    Get user's annotations
// @route   GET /api/annotations/user
// @access  Private
export const getUserAnnotations = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { rows: annotations, count: total } = await Annotation.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Image,
          as: 'image',
          attributes: ['id', 'title', 'thumbnailUrl'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: annotations,
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
      message: error.message || 'Error fetching user annotations',
    });
  }
};

// @desc    Validate annotation (Researcher/Admin only)
// @route   PUT /api/annotations/:id/validate
// @access  Private (Researcher/Admin)
export const validateAnnotation = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const annotation = await Annotation.findByPk(req.params.id);

    if (!annotation) {
      res.status(404).json({
        success: false,
        message: 'Annotation not found',
      });
      return;
    }

    // Update annotation as validated
    await annotation.update({
      isValidated: true,
      validatedBy: req.user.id,
      validatedAt: new Date(),
    });

    // Award bonus points to the user
    const bonusPoints = 50;
    await User.increment(
      { score: bonusPoints, experience: bonusPoints },
      { where: { id: annotation.userId } }
    );

    res.status(200).json({
      success: true,
      data: annotation,
      message: 'Annotation validated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error validating annotation',
    });
  }
};

// @desc    Get consensus annotations for an image
// @route   GET /api/annotations/consensus/:imageId
// @access  Public
export const getConsensusAnnotations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const image = await Image.findByPk(req.params.imageId);

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Image not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: image.consensusAnnotations || [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching consensus annotations',
    });
  }
};
