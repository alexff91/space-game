import { AnnotationCategory } from '@/types';

export const ANNOTATION_CATEGORIES: AnnotationCategory[] = [
  {
    id: 'galaxy',
    name: 'Galaxy',
    description: 'Spiral, elliptical, or irregular galaxies',
    color: '#3B82F6',
    examples: [
      'Spiral galaxy with defined arms',
      'Elliptical galaxy',
      'Irregular galaxy structure',
    ],
  },
  {
    id: 'nebula',
    name: 'Nebula',
    description: 'Emission, reflection, or planetary nebulae',
    color: '#8B5CF6',
    examples: [
      'Emission nebula (glowing gas)',
      'Reflection nebula (dust reflecting light)',
      'Planetary nebula',
    ],
  },
  {
    id: 'star_cluster',
    name: 'Star Cluster',
    description: 'Open or globular star clusters',
    color: '#F59E0B',
    examples: ['Open cluster', 'Globular cluster', 'Dense star grouping'],
  },
  {
    id: 'supernova',
    name: 'Supernova/Remnant',
    description: 'Supernova explosions or their remnants',
    color: '#EF4444',
    examples: ['Supernova remnant', 'Expanding shell structure', 'Bright explosion'],
  },
  {
    id: 'black_hole',
    name: 'Black Hole/Accretion',
    description: 'Black hole features or accretion disks',
    color: '#1F2937',
    examples: ['Accretion disk', 'X-ray source', 'Gravitational lensing'],
  },
  {
    id: 'asteroid',
    name: 'Asteroid/Track',
    description: 'Asteroids or their trails across images',
    color: '#6B7280',
    examples: ['Asteroid trail', 'Moving object', 'Linear streak'],
  },
  {
    id: 'quasar',
    name: 'Quasar/AGN',
    description: 'Quasars or active galactic nuclei',
    color: '#10B981',
    examples: ['Bright point source', 'Active galactic nucleus', 'High-energy emission'],
  },
  {
    id: 'anomaly',
    name: 'Anomaly/Unknown',
    description: 'Unusual or unidentified objects',
    color: '#EC4899',
    examples: [
      'Unknown structure',
      'Unusual pattern',
      'Unidentified bright spot',
      'Artifact or real object unclear',
    ],
  },
  {
    id: 'artifact',
    name: 'Artifact/Noise',
    description: 'Image artifacts, cosmic rays, or noise',
    color: '#64748B',
    examples: ['Cosmic ray hit', 'Dead pixel', 'Image artifact', 'Satellite trail'],
  },
];

export const ANNOTATION_TOOLS = [
  {
    id: 'point',
    name: 'Point',
    icon: '📍',
    description: 'Mark a specific location',
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: '⬜',
    description: 'Draw a rectangular area',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: '⬡',
    description: 'Draw a custom polygon shape',
  },
  {
    id: 'freeform',
    name: 'Freeform',
    icon: '✏️',
    description: 'Draw freeform shapes',
  },
];

export const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Beginner', color: 'green' },
  { value: 2, label: 'Easy', color: 'blue' },
  { value: 3, label: 'Medium', color: 'yellow' },
  { value: 4, label: 'Hard', color: 'orange' },
  { value: 5, label: 'Expert', color: 'red' },
];

export const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0 },
  { level: 2, minXP: 100 },
  { level: 3, minXP: 250 },
  { level: 4, minXP: 500 },
  { level: 5, minXP: 1000 },
  { level: 6, minXP: 2000 },
  { level: 7, minXP: 4000 },
  { level: 8, minXP: 7000 },
  { level: 9, minXP: 11000 },
  { level: 10, minXP: 16000 },
];

export function getNextLevelXP(currentLevel: number): number {
  const nextLevel = LEVEL_THRESHOLDS.find((l) => l.level === currentLevel + 1);
  return nextLevel?.minXP || 0;
}

export function getProgressToNextLevel(experience: number, currentLevel: number): number {
  const currentLevelXP = LEVEL_THRESHOLDS.find((l) => l.level === currentLevel)?.minXP || 0;
  const nextLevelXP = getNextLevelXP(currentLevel);
  const progress = ((experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}
