import { Request, Response } from 'express';
import { User, Annotation, Achievement, UserAchievement } from '../models';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'email'] },
      include: [
        {
          model: Achievement,
          as: 'achievements',
          through: { attributes: ['unlockedAt'] },
        },
      ],
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get user stats
    const annotationCount = await Annotation.count({
      where: { userId: user.id },
    });

    const validatedCount = await Annotation.count({
      where: { userId: user.id, isValidated: true },
    });

    res.status(200).json({
      success: true,
      data: {
        ...user.toJSON(),
        stats: {
          annotationCount,
          validatedCount,
          achievementCount: user.achievements?.length || 0,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email, avatarUrl, preferences } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Update user
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatarUrl) user.avatarUrl = avatarUrl;
    if (preferences) user.preferences = preferences;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const timeframe = req.query.timeframe as string; // 'week', 'month', 'all'

    const users = await User.findAll({
      attributes: ['id', 'username', 'score', 'level', 'avatarUrl'],
      order: [['score', 'DESC']],
      limit,
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching leaderboard',
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const annotationCount = await Annotation.count({
      where: { userId: req.user.id },
    });

    const validatedCount = await Annotation.count({
      where: { userId: req.user.id, isValidated: true },
    });

    const achievementCount = await UserAchievement.count({
      where: { userId: req.user.id },
    });

    // Get category breakdown
    const categoryBreakdown = await Annotation.findAll({
      where: { userId: req.user.id },
      attributes: [
        'category',
        [Annotation.sequelize!.fn('COUNT', '*'), 'count'],
      ],
      group: ['category'],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: {
        annotationCount,
        validatedCount,
        achievementCount,
        categoryBreakdown,
        user: {
          score: req.user.score,
          level: req.user.level,
          experience: req.user.experience,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user stats',
    });
  }
};
