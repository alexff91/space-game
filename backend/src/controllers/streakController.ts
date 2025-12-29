import { Response } from 'express';
import { UserStreak, User } from '../models';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user streak
// @route   GET /api/streak
// @access  Private
export const getUserStreak = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let streak = await UserStreak.findOne({
      where: { userId: req.user.id },
    });

    if (!streak) {
      streak = await UserStreak.create({
        userId: req.user.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      data: streak,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching streak',
    });
  }
};

// @desc    Update user streak
// @route   POST /api/streak/check
// @access  Private
export const checkAndUpdateStreak = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    let streak = await UserStreak.findOne({
      where: { userId: req.user.id },
    });

    if (!streak) {
      streak = await UserStreak.create({
        userId: req.user.id,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today as any,
      });
    } else {
      const lastActive = new Date(streak.lastActiveDate).toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (lastActive === today) {
        // Already active today, no change
      } else if (lastActive === yesterday) {
        // Consecutive day - increment streak
        await streak.increment('currentStreak');

        if (streak.currentStreak + 1 > streak.longestStreak) {
          await streak.update({ longestStreak: streak.currentStreak + 1 });
        }

        await streak.update({ lastActiveDate: today as any });

        // Award streak bonus
        const bonus = Math.min(streak.currentStreak * 10, 100);
        await User.increment(
          { score: bonus, experience: bonus },
          { where: { id: req.user.id } }
        );
      } else if (!streak.streakFrozen) {
        // Streak broken - reset
        await streak.update({
          currentStreak: 1,
          lastActiveDate: today as any,
        });
      } else {
        // Streak frozen - maintain
        await streak.update({
          lastActiveDate: today as any,
          streakFrozen: false,
        });
      }
    }

    await streak.reload();

    res.status(200).json({
      success: true,
      data: streak,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating streak',
    });
  }
};

// @desc    Freeze streak (once per week)
// @route   POST /api/streak/freeze
// @access  Private
export const freezeStreak = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const streak = await UserStreak.findOne({
      where: { userId: req.user.id },
    });

    if (!streak) {
      res.status(404).json({
        success: false,
        message: 'Streak not found',
      });
      return;
    }

    // Check if already used freeze this week
    if (streak.freezeUsedDate) {
      const daysSinceFreeze = Math.floor(
        (Date.now() - new Date(streak.freezeUsedDate).getTime()) / 86400000
      );

      if (daysSinceFreeze < 7) {
        res.status(400).json({
          success: false,
          message: 'Streak freeze available in ${7 - daysSinceFreeze} days',
        });
        return;
      }
    }

    await streak.update({
      streakFrozen: true,
      freezeUsedDate: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Streak frozen for 1 day',
      data: streak,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error freezing streak',
    });
  }
};
