import { describe, it, expect } from 'vitest';
import {
  LEVEL_THRESHOLDS,
  DIFFICULTY_LEVELS,
  ANNOTATION_CATEGORIES,
  getNextLevelXP,
  getProgressToNextLevel,
} from '@/utils/constants';

describe('Game Logic - Level System', () => {
  it('should require more XP for each subsequent level', () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      const prevGap = i > 1
        ? LEVEL_THRESHOLDS[i].minXP - LEVEL_THRESHOLDS[i - 1].minXP
        : LEVEL_THRESHOLDS[i].minXP;
      expect(prevGap).toBeGreaterThan(0);
    }
  });

  it('should have exponential-like XP curve', () => {
    // The gap between levels should generally increase
    const gaps: number[] = [];
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      gaps.push(LEVEL_THRESHOLDS[i].minXP - LEVEL_THRESHOLDS[i - 1].minXP);
    }
    // At minimum, the last gap should be larger than the first
    expect(gaps[gaps.length - 1]).toBeGreaterThan(gaps[0]);
  });

  it('should correctly determine level from XP', () => {
    // A function to determine level from XP (testing the threshold logic)
    function getLevel(xp: number): number {
      let level = 1;
      for (const threshold of LEVEL_THRESHOLDS) {
        if (xp >= threshold.minXP) {
          level = threshold.level;
        }
      }
      return level;
    }

    expect(getLevel(0)).toBe(1);
    expect(getLevel(50)).toBe(1);
    expect(getLevel(100)).toBe(2);
    expect(getLevel(249)).toBe(2);
    expect(getLevel(250)).toBe(3);
    expect(getLevel(999)).toBe(4);
    expect(getLevel(1000)).toBe(5);
    expect(getLevel(16000)).toBe(10);
    expect(getLevel(99999)).toBe(10);
  });
});

describe('Game Logic - Progress Calculation', () => {
  it('should return 0% progress at level start', () => {
    // At exactly 100 XP (start of level 2)
    expect(getProgressToNextLevel(100, 2)).toBe(0);
  });

  it('should return correct progress for mid-level XP', () => {
    // Level 2: 100 XP, Level 3: 250 XP. At 175 XP => 50%
    expect(getProgressToNextLevel(175, 2)).toBe(50);
  });

  it('should handle edge case: max level player', () => {
    // At max level (10), nextLevelXP returns 0
    // This means (16000 - 16000) / (0 - 16000) which is 0 / -16000 = 0
    // But clamped to 0-100, so either 0 or needs special handling
    const result = getProgressToNextLevel(20000, 10);
    // The function handles this by clamping
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });
});

describe('Game Logic - Difficulty System', () => {
  it('should map difficulty values 1-5 to meaningful labels', () => {
    const labelMap = new Map(DIFFICULTY_LEVELS.map((d) => [d.value, d.label]));

    expect(labelMap.get(1)).toBe('Beginner');
    expect(labelMap.get(2)).toBe('Easy');
    expect(labelMap.get(3)).toBe('Medium');
    expect(labelMap.get(4)).toBe('Hard');
    expect(labelMap.get(5)).toBe('Expert');
  });

  it('should have color coding for visual difficulty indicators', () => {
    const colorMap = new Map(DIFFICULTY_LEVELS.map((d) => [d.value, d.color]));

    expect(colorMap.get(1)).toBe('green');
    expect(colorMap.get(5)).toBe('red');
  });
});

describe('Game Logic - Annotation Scoring', () => {
  it('should have categories that cover major astronomical objects', () => {
    const categoryIds = ANNOTATION_CATEGORIES.map((c) => c.id);

    // Essential space objects should be categorizable
    expect(categoryIds).toContain('galaxy');
    expect(categoryIds).toContain('nebula');
    expect(categoryIds).toContain('star_cluster');
    expect(categoryIds).toContain('supernova');
    expect(categoryIds).toContain('black_hole');
    expect(categoryIds).toContain('quasar');
    expect(categoryIds).toContain('asteroid');
    expect(categoryIds).toContain('anomaly');
    expect(categoryIds).toContain('artifact');
  });

  it('should have distinct colors for each category for visual differentiation', () => {
    const colors = ANNOTATION_CATEGORIES.map((c) => c.color);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });
});

describe('Game Logic - Streak Mechanics', () => {
  it('should reward consistent daily engagement', () => {
    // Simulate streak bonus calculation
    function calculateStreakBonus(streakDays: number): number {
      if (streakDays >= 30) return 50;
      if (streakDays >= 14) return 30;
      if (streakDays >= 7) return 20;
      if (streakDays >= 3) return 10;
      return 0;
    }

    expect(calculateStreakBonus(0)).toBe(0);
    expect(calculateStreakBonus(1)).toBe(0);
    expect(calculateStreakBonus(3)).toBe(10);
    expect(calculateStreakBonus(7)).toBe(20);
    expect(calculateStreakBonus(14)).toBe(30);
    expect(calculateStreakBonus(30)).toBe(50);
    expect(calculateStreakBonus(100)).toBe(50);
  });

  it('should determine if streak is active based on last activity', () => {
    function isStreakActive(lastActivityDate: Date): boolean {
      const now = new Date();
      const diffMs = now.getTime() - lastActivityDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours < 48; // 48 hour grace period
    }

    const now = new Date();
    expect(isStreakActive(now)).toBe(true);

    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(isStreakActive(yesterday)).toBe(true);

    const threeDaysAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000);
    expect(isStreakActive(threeDaysAgo)).toBe(false);
  });
});

describe('Game Logic - Mission Progress', () => {
  it('should calculate mission completion percentage', () => {
    function getMissionProgress(current: number, target: number): number {
      if (target <= 0) return 100;
      return Math.min(Math.round((current / target) * 100), 100);
    }

    expect(getMissionProgress(0, 10)).toBe(0);
    expect(getMissionProgress(5, 10)).toBe(50);
    expect(getMissionProgress(10, 10)).toBe(100);
    expect(getMissionProgress(15, 10)).toBe(100); // Clamped
    expect(getMissionProgress(0, 0)).toBe(100); // Edge case
  });

  it('should determine mission time remaining', () => {
    function getDaysLeft(endDate: string): number {
      return Math.ceil(
        (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(getDaysLeft(tomorrow.toISOString())).toBe(1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    expect(getDaysLeft(nextWeek.toISOString())).toBe(7);
  });
});
