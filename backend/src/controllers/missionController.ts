import { Request, Response } from 'express';
import { Mission, DailyChallenge, Annotation } from '../models';
import { AuthRequest } from '../middleware/auth';
import { Op } from 'sequelize';

// @desc    Get active missions
// @route   GET /api/missions
// @access  Public
export const getMissions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const missions = await Mission.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { endDate: null as any },
          { endDate: { [Op.gte]: new Date() } },
        ],
      } as any,
      order: [['difficulty', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: missions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching missions',
    });
  }
};

// @desc    Get daily challenge
// @route   GET /api/missions/daily
// @access  Public
export const getDailyChallenge = async (_req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    let challenge = await DailyChallenge.findOne({
      where: {
        date: today,
        isActive: true,
      },
    });

    // Generate new challenge if none exists
    if (!challenge) {
      challenge = await generateDailyChallenge();
    }

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching daily challenge',
    });
  }
};

// @desc    Check mission progress
// @route   GET /api/missions/:id/progress
// @access  Private
export const getMissionProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const mission = await Mission.findByPk(req.params.id);

    if (!mission) {
      res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
      return;
    }

    // Calculate user progress
    const objective = mission.objective as any;
    let progress = 0;

    if (objective.type === 'annotate_count') {
      const count = await Annotation.count({
        where: {
          userId: req.user.id,
          ...(mission.imageIds && { imageId: { [Op.in]: mission.imageIds } }),
          createdAt: {
            [Op.gte]: mission.startDate || mission.createdAt,
          },
        },
      });
      progress = Math.min((count / objective.target) * 100, 100);
    }

    const completed = progress >= 100;

    res.status(200).json({
      success: true,
      data: {
        mission,
        progress,
        completed,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching mission progress',
    });
  }
};

// Helper function to generate daily challenge
async function generateDailyChallenge(): Promise<any> {
  const today = new Date().toISOString().split('T')[0];

  const challenges = [
    {
      title: 'Galaxy Hunter',
      description: 'Identify 10 galaxies today',
      type: 'category_specific',
      target: 10,
      categoryFilter: 'galaxy',
      reward: { points: 150, experience: 150 },
    },
    {
      title: 'Nebula Explorer',
      description: 'Mark 5 nebulae in astronomical images',
      type: 'category_specific',
      target: 5,
      categoryFilter: 'nebula',
      reward: { points: 100, experience: 100 },
    },
    {
      title: 'Annotation Master',
      description: 'Create 15 annotations of any type',
      type: 'annotate_count',
      target: 15,
      reward: { points: 200, experience: 200 },
    },
    {
      title: 'Star Cluster Seeker',
      description: 'Find 8 star clusters',
      type: 'category_specific',
      target: 8,
      categoryFilter: 'star_cluster',
      reward: { points: 120, experience: 120 },
    },
  ];

  // Rotate based on day of year
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000
  );
  const selectedChallenge = challenges[dayOfYear % challenges.length];

  return await DailyChallenge.create({
    date: today,
    ...selectedChallenge,
  } as any);
}

// @desc    Complete daily challenge
// @route   POST /api/missions/daily/complete
// @access  Private
export const completeDailyChallenge = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const challenge = await DailyChallenge.findOne({
      where: {
        date: today,
        isActive: true,
      },
    });

    if (!challenge) {
      res.status(404).json({
        success: false,
        message: 'No active challenge for today',
      });
      return;
    }

    // Check if user has met the challenge requirements
    const whereClause: any = {
      userId: req.user.id,
      createdAt: {
        [Op.gte]: new Date(today),
      },
    };

    if (challenge.categoryFilter) {
      whereClause.category = challenge.categoryFilter;
    }

    const count = await Annotation.count({ where: whereClause });

    if (count < challenge.target) {
      res.status(400).json({
        success: false,
        message: `Challenge not complete. Progress: ${count}/${challenge.target}`,
      });
      return;
    }

    // Award rewards
    const reward = challenge.reward as any;
    await req.user.increment({
      score: reward.points || 0,
      experience: reward.experience || 0,
    });

    res.status(200).json({
      success: true,
      message: 'Daily challenge completed!',
      reward,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error completing challenge',
    });
  }
};
