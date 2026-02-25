import { describe, it, expect } from 'vitest';
import type {
  User,
  Image,
  Annotation,
  Mission,
  Achievement,
} from '@/types';

describe('Type structures', () => {
  it('should create a valid User object', () => {
    const user: User = {
      id: 1,
      username: 'astro_explorer',
      email: 'explorer@space.com',
      role: 'user',
      score: 1500,
      level: 5,
      experience: 1200,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    };
    expect(user.id).toBe(1);
    expect(user.role).toBe('user');
    expect(user.score).toBe(1500);
    expect(user.level).toBe(5);
  });

  it('should create a valid Image object with coordinates', () => {
    const image: Image = {
      id: 42,
      title: 'Horsehead Nebula',
      imageUrl: 'https://example.com/horsehead.jpg',
      source: 'hubble',
      annotationCount: 15,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      coordinates: { ra: 85.25, dec: -2.45 },
      difficulty: 3,
      tags: ['nebula', 'barnard33'],
    };
    expect(image.source).toBe('hubble');
    expect(image.coordinates?.ra).toBe(85.25);
    expect(image.tags).toContain('nebula');
  });

  it('should support all image sources', () => {
    const sources: Image['source'][] = ['nasa', 'esa', 'hubble', 'other'];
    sources.forEach((source) => {
      const image: Image = {
        id: 1,
        title: 'Test',
        imageUrl: 'test.jpg',
        source,
        annotationCount: 0,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      };
      expect(image.source).toBe(source);
    });
  });

  it('should create a valid Annotation object', () => {
    const annotation: Annotation = {
      id: 1,
      userId: 10,
      imageId: 42,
      type: 'rectangle',
      coordinates: { x1: 100, y1: 150, x2: 300, y2: 400 },
      category: 'galaxy',
      confidence: 0.85,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    };
    expect(annotation.type).toBe('rectangle');
    expect(annotation.confidence).toBe(0.85);
  });

  it('should support all annotation types', () => {
    const types: Annotation['type'][] = ['point', 'rectangle', 'polygon', 'freeform'];
    types.forEach((type) => {
      const annotation: Annotation = {
        id: 1,
        userId: 1,
        imageId: 1,
        type,
        coordinates: {},
        category: 'galaxy',
        createdAt: '',
        updatedAt: '',
      };
      expect(annotation.type).toBe(type);
    });
  });

  it('should create a valid Mission object', () => {
    const mission: Mission = {
      id: 1,
      title: 'Galaxy Hunter',
      description: 'Find 10 spiral galaxies',
      objective: { type: 'annotate', target: 10 },
      reward: { points: 500, experience: 200 },
      difficulty: 3,
      isActive: true,
      currentParticipants: 42,
    };
    expect(mission.reward).toEqual({ points: 500, experience: 200 });
    expect(mission.currentParticipants).toBe(42);
  });

  it('should create a valid Achievement object', () => {
    const achievement: Achievement = {
      id: 1,
      name: 'First Discovery',
      description: 'Make your first annotation',
      category: 'annotations',
      requirement: { annotationCount: 1 },
      points: 100,
      rarity: 'common',
      isActive: true,
    };
    expect(achievement.rarity).toBe('common');
    expect(achievement.category).toBe('annotations');
  });

  it('should support all achievement rarities', () => {
    const rarities: Achievement['rarity'][] = ['common', 'rare', 'epic', 'legendary'];
    rarities.forEach((rarity) => {
      const achievement: Achievement = {
        id: 1,
        name: 'Test',
        description: 'Test',
        category: 'special',
        requirement: {},
        points: 0,
        rarity,
        isActive: true,
      };
      expect(achievement.rarity).toBe(rarity);
    });
  });

  it('should support all user roles', () => {
    const roles: User['role'][] = ['user', 'researcher', 'admin'];
    roles.forEach((role) => {
      const user: User = {
        id: 1,
        username: 'test',
        email: 'test@test.com',
        role,
        score: 0,
        level: 1,
        experience: 0,
        createdAt: '',
        updatedAt: '',
      };
      expect(user.role).toBe(role);
    });
  });
});
