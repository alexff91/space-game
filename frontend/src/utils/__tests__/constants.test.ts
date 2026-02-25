import { describe, it, expect } from 'vitest';
import {
  ANNOTATION_CATEGORIES,
  ANNOTATION_TOOLS,
  DIFFICULTY_LEVELS,
  LEVEL_THRESHOLDS,
  getNextLevelXP,
  getProgressToNextLevel,
} from '@/utils/constants';

describe('ANNOTATION_CATEGORIES', () => {
  it('should have 9 categories', () => {
    expect(ANNOTATION_CATEGORIES).toHaveLength(9);
  });

  it('should have required fields for each category', () => {
    ANNOTATION_CATEGORIES.forEach((cat) => {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('description');
      expect(cat).toHaveProperty('color');
      expect(cat).toHaveProperty('examples');
      expect(cat.examples.length).toBeGreaterThan(0);
    });
  });

  it('should have unique IDs', () => {
    const ids = ANNOTATION_CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should include galaxy, nebula, and star_cluster', () => {
    const ids = ANNOTATION_CATEGORIES.map((c) => c.id);
    expect(ids).toContain('galaxy');
    expect(ids).toContain('nebula');
    expect(ids).toContain('star_cluster');
  });

  it('should have valid hex color codes', () => {
    ANNOTATION_CATEGORIES.forEach((cat) => {
      expect(cat.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe('ANNOTATION_TOOLS', () => {
  it('should have 4 tools', () => {
    expect(ANNOTATION_TOOLS).toHaveLength(4);
  });

  it('should include point, rectangle, polygon, and freeform', () => {
    const ids = ANNOTATION_TOOLS.map((t) => t.id);
    expect(ids).toEqual(['point', 'rectangle', 'polygon', 'freeform']);
  });

  it('should have name and description for each tool', () => {
    ANNOTATION_TOOLS.forEach((tool) => {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
    });
  });
});

describe('DIFFICULTY_LEVELS', () => {
  it('should have 5 difficulty levels', () => {
    expect(DIFFICULTY_LEVELS).toHaveLength(5);
  });

  it('should have ascending values from 1 to 5', () => {
    const values = DIFFICULTY_LEVELS.map((d) => d.value);
    expect(values).toEqual([1, 2, 3, 4, 5]);
  });

  it('should have label and color for each level', () => {
    DIFFICULTY_LEVELS.forEach((d) => {
      expect(d.label).toBeTruthy();
      expect(d.color).toBeTruthy();
    });
  });
});

describe('LEVEL_THRESHOLDS', () => {
  it('should have 10 levels', () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(10);
  });

  it('should start at level 1 with 0 XP', () => {
    expect(LEVEL_THRESHOLDS[0]).toEqual({ level: 1, minXP: 0 });
  });

  it('should have strictly increasing XP requirements', () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i].minXP).toBeGreaterThan(
        LEVEL_THRESHOLDS[i - 1].minXP
      );
    }
  });

  it('should end at level 10 with 16000 XP', () => {
    const last = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    expect(last.level).toBe(10);
    expect(last.minXP).toBe(16000);
  });
});

describe('getNextLevelXP', () => {
  it('should return XP for the next level', () => {
    expect(getNextLevelXP(1)).toBe(100);
    expect(getNextLevelXP(2)).toBe(250);
    expect(getNextLevelXP(5)).toBe(2000);
  });

  it('should return 0 for max level', () => {
    expect(getNextLevelXP(10)).toBe(0);
  });

  it('should return 0 for level beyond max', () => {
    expect(getNextLevelXP(99)).toBe(0);
  });
});

describe('getProgressToNextLevel', () => {
  it('should return 0% at the start of a level', () => {
    expect(getProgressToNextLevel(0, 1)).toBe(0);
  });

  it('should return 50% when halfway between levels', () => {
    // Level 1: 0 XP, Level 2: 100 XP. At 50 XP => 50%
    expect(getProgressToNextLevel(50, 1)).toBe(50);
  });

  it('should return 100% when at the next level threshold', () => {
    expect(getProgressToNextLevel(100, 1)).toBe(100);
  });

  it('should clamp progress to 0-100', () => {
    // negative should clamp to 0
    expect(getProgressToNextLevel(-10, 1)).toBe(0);
    // over should clamp to 100
    expect(getProgressToNextLevel(999, 1)).toBe(100);
  });

  it('should calculate mid-game progress correctly', () => {
    // Level 5: 1000 XP, Level 6: 2000 XP. At 1500 XP => 50%
    expect(getProgressToNextLevel(1500, 5)).toBe(50);
  });
});
