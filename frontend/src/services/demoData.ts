/**
 * Demo data service — provides realistic sample data so the app works
 * without a backend or API keys. Uses real NASA APOD public data.
 */

import { User, Image, Annotation, Achievement, Mission } from '@/types';

// ---------------------------------------------------------------------------
// Demo user
// ---------------------------------------------------------------------------
export const DEMO_USER: User = {
  id: 1,
  username: 'CosmicExplorer',
  email: 'demo@astroquest.dev',
  role: 'user',
  score: 4250,
  level: 6,
  experience: 3800,
  avatarUrl: undefined,
  createdAt: '2025-06-15T10:00:00Z',
  updatedAt: new Date().toISOString(),
};

// ---------------------------------------------------------------------------
// Sample images (real NASA public domain images)
// ---------------------------------------------------------------------------
export const DEMO_IMAGES: Image[] = [
  {
    id: 1,
    nasaId: 'apod-2024-01-15',
    title: 'The Horsehead Nebula in Infrared',
    description:
      'One of the most identifiable nebulae in the sky, the Horsehead Nebula in Orion, is part of a large, dark, molecular cloud. The darkness of the Horsehead is caused mostly by thick dust blocking the light of stars behind it.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2401/Horsehead_Hubble_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2401/Horsehead_Hubble_960.jpg',
    source: 'hubble',
    telescope: 'Hubble Space Telescope',
    wavelength: 'Infrared',
    dateObserved: '2024-01-15',
    difficulty: 2,
    category: 'nebula',
    tags: ['nebula', 'horsehead', 'orion', 'infrared', 'hubble'],
    annotationCount: 24,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    nasaId: 'apod-2024-02-10',
    title: 'The Andromeda Galaxy in Ultraviolet',
    description:
      'The Andromeda Galaxy (M31) is the nearest large galaxy to our Milky Way. At 2.5 million light-years distant, it is the most distant object visible to the unaided eye. This ultraviolet image reveals hot young stars tracing the spiral arms.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2402/M31_Galex_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2402/M31_Galex_960.jpg',
    source: 'nasa',
    telescope: 'GALEX',
    wavelength: 'Ultraviolet',
    dateObserved: '2024-02-10',
    difficulty: 3,
    category: 'galaxy',
    tags: ['galaxy', 'andromeda', 'M31', 'ultraviolet', 'spiral'],
    annotationCount: 42,
    isActive: true,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 3,
    nasaId: 'apod-2024-03-22',
    title: 'The Crab Nebula from Hubble',
    description:
      'The Crab Nebula (M1) is the remnant of a supernova explosion recorded by Chinese astronomers in 1054 AD. At its center lies a pulsar — a rapidly spinning neutron star emitting beams of radiation.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2403/CrabNebula_Hubble_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2403/CrabNebula_Hubble_960.jpg',
    source: 'hubble',
    telescope: 'Hubble Space Telescope',
    wavelength: 'Visible',
    dateObserved: '2024-03-22',
    difficulty: 4,
    category: 'supernova',
    tags: ['supernova', 'crab', 'M1', 'pulsar', 'remnant'],
    annotationCount: 31,
    isActive: true,
    createdAt: '2024-03-22T00:00:00Z',
    updatedAt: '2024-03-22T00:00:00Z',
  },
  {
    id: 4,
    nasaId: 'apod-2024-04-05',
    title: 'Pillars of Creation',
    description:
      'These towering columns of cool interstellar gas and dust are part of the Eagle Nebula (M16). Inside the pillars, new stars are being born from gravitationally collapsing pockets of dense gas.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2404/PillarsOfCreation_JWST_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2404/PillarsOfCreation_JWST_960.jpg',
    source: 'nasa',
    telescope: 'James Webb Space Telescope',
    wavelength: 'Near-Infrared',
    dateObserved: '2024-04-05',
    difficulty: 3,
    category: 'nebula',
    tags: ['nebula', 'eagle', 'M16', 'pillars', 'JWST', 'star-formation'],
    annotationCount: 56,
    isActive: true,
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
  },
  {
    id: 5,
    nasaId: 'apod-2024-05-18',
    title: 'Ring Galaxy AM 0644-741',
    description:
      'An unusual galaxy shaped like a ring, likely formed when a smaller galaxy punched through the center of a larger one. The blue ring consists of newly formed, massive, hot stars.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2405/RingGalaxy_Hubble_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2405/RingGalaxy_Hubble_960.jpg',
    source: 'hubble',
    telescope: 'Hubble Space Telescope',
    wavelength: 'Visible',
    dateObserved: '2024-05-18',
    difficulty: 5,
    category: 'galaxy',
    tags: ['galaxy', 'ring', 'collision', 'hubble', 'rare'],
    annotationCount: 18,
    isActive: true,
    createdAt: '2024-05-18T00:00:00Z',
    updatedAt: '2024-05-18T00:00:00Z',
  },
  {
    id: 6,
    nasaId: 'apod-2024-06-12',
    title: 'Omega Centauri: The Brightest Globular Star Cluster',
    description:
      'Omega Centauri (NGC 5139) is the largest and brightest globular cluster orbiting the Milky Way, containing roughly 10 million stars packed into a sphere about 150 light-years in diameter.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2406/OmegaCen_Hubble_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2406/OmegaCen_Hubble_960.jpg',
    source: 'hubble',
    telescope: 'Hubble Space Telescope',
    wavelength: 'Visible',
    dateObserved: '2024-06-12',
    difficulty: 2,
    category: 'star_cluster',
    tags: ['cluster', 'globular', 'omega-centauri', 'NGC5139'],
    annotationCount: 37,
    isActive: true,
    createdAt: '2024-06-12T00:00:00Z',
    updatedAt: '2024-06-12T00:00:00Z',
  },
  {
    id: 7,
    nasaId: 'apod-2024-07-08',
    title: 'Centaurus A: A Peculiar Galaxy',
    description:
      'Centaurus A (NGC 5128) is the closest active galaxy to Earth. A massive black hole at its center ejects jets of high-energy particles extending thousands of light-years into space.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2407/CenA_Hubble_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2407/CenA_Hubble_960.jpg',
    source: 'hubble',
    telescope: 'Hubble Space Telescope',
    wavelength: 'Visible + X-ray composite',
    dateObserved: '2024-07-08',
    difficulty: 4,
    category: 'galaxy',
    tags: ['galaxy', 'active', 'AGN', 'jets', 'black-hole'],
    annotationCount: 22,
    isActive: true,
    createdAt: '2024-07-08T00:00:00Z',
    updatedAt: '2024-07-08T00:00:00Z',
  },
  {
    id: 8,
    nasaId: 'apod-2024-08-20',
    title: 'The Veil Nebula Supernova Remnant',
    description:
      'The Veil Nebula is a large supernova remnant in Cygnus. The original star exploded between 10,000 and 20,000 years ago, and the expanding shock wave now spans about 3 degrees of the sky.',
    imageUrl: 'https://apod.nasa.gov/apod/image/2408/VeilNebula_Hubble_960.jpg',
    thumbnailUrl: 'https://apod.nasa.gov/apod/image/2408/VeilNebula_Hubble_960.jpg',
    source: 'hubble',
    telescope: 'Hubble Space Telescope',
    wavelength: 'Visible',
    dateObserved: '2024-08-20',
    difficulty: 3,
    category: 'supernova',
    tags: ['supernova', 'remnant', 'veil', 'cygnus', 'shock-wave'],
    annotationCount: 29,
    isActive: true,
    createdAt: '2024-08-20T00:00:00Z',
    updatedAt: '2024-08-20T00:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Demo annotations
// ---------------------------------------------------------------------------
export const DEMO_ANNOTATIONS: Annotation[] = [
  {
    id: 1, userId: 1, imageId: 1,
    type: 'point', coordinates: { x: 420, y: 300 },
    category: 'nebula', confidence: 4,
    description: 'Dark cloud forming horsehead shape',
    pointsAwarded: 15, isValidated: true,
    createdAt: '2024-12-10T14:30:00Z', updatedAt: '2024-12-10T14:30:00Z',
    user: { id: 1, username: 'CosmicExplorer', level: 6 },
  },
  {
    id: 2, userId: 1, imageId: 2,
    type: 'rectangle', coordinates: { x1: 200, y1: 150, x2: 600, y2: 500 },
    category: 'galaxy', confidence: 5,
    description: 'Spiral arms clearly visible in UV',
    pointsAwarded: 20, isValidated: true,
    createdAt: '2024-12-11T09:15:00Z', updatedAt: '2024-12-11T09:15:00Z',
    user: { id: 1, username: 'CosmicExplorer', level: 6 },
  },
  {
    id: 3, userId: 1, imageId: 3,
    type: 'point', coordinates: { x: 480, y: 350 },
    category: 'supernova', confidence: 5,
    description: 'Central pulsar location',
    pointsAwarded: 25, isValidated: true,
    createdAt: '2024-12-12T16:45:00Z', updatedAt: '2024-12-12T16:45:00Z',
    user: { id: 1, username: 'CosmicExplorer', level: 6 },
  },
  {
    id: 4, userId: 1, imageId: 4,
    type: 'rectangle', coordinates: { x1: 300, y1: 100, x2: 650, y2: 600 },
    category: 'nebula', confidence: 4,
    description: 'Main pillar structure with embedded protostars',
    pointsAwarded: 20, isValidated: false,
    createdAt: '2024-12-13T11:20:00Z', updatedAt: '2024-12-13T11:20:00Z',
    user: { id: 1, username: 'CosmicExplorer', level: 6 },
  },
  {
    id: 5, userId: 1, imageId: 6,
    type: 'point', coordinates: { x: 480, y: 340 },
    category: 'star_cluster', confidence: 5,
    description: 'Core of globular cluster',
    pointsAwarded: 15, isValidated: true,
    createdAt: '2024-12-14T08:00:00Z', updatedAt: '2024-12-14T08:00:00Z',
    user: { id: 1, username: 'CosmicExplorer', level: 6 },
  },
];

// ---------------------------------------------------------------------------
// Demo achievements
// ---------------------------------------------------------------------------
export const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1, name: 'First Light',
    description: 'Make your first annotation',
    icon: 'telescope',
    category: 'annotations', requirement: { annotations: 1 },
    points: 50, rarity: 'common', isActive: true,
    unlockedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 2, name: 'Star Mapper',
    description: 'Annotate 10 different images',
    icon: 'map',
    category: 'annotations', requirement: { annotations: 10 },
    points: 100, rarity: 'common', isActive: true,
    unlockedAt: '2024-11-15T14:00:00Z',
  },
  {
    id: 3, name: 'Galaxy Hunter',
    description: 'Identify 5 galaxies correctly',
    icon: 'galaxy',
    category: 'discoveries', requirement: { galaxies: 5 },
    points: 200, rarity: 'rare', isActive: true,
    unlockedAt: '2024-12-01T09:00:00Z',
  },
  {
    id: 4, name: 'Nebula Whisperer',
    description: 'Annotate 10 nebulae with confidence 4+',
    icon: 'cloud',
    category: 'discoveries', requirement: { nebulae: 10 },
    points: 300, rarity: 'rare', isActive: true,
    unlockedAt: '2024-12-10T16:00:00Z',
  },
  {
    id: 5, name: 'Streak Master',
    description: 'Maintain a 7-day login streak',
    icon: 'flame',
    category: 'missions', requirement: { streak: 7 },
    points: 150, rarity: 'common', isActive: true,
    unlockedAt: '2024-12-20T08:00:00Z',
  },
  {
    id: 6, name: 'Social Butterfly',
    description: 'Have 3 annotations validated by peers',
    icon: 'users',
    category: 'social', requirement: { validated: 3 },
    points: 250, rarity: 'rare', isActive: true,
    unlockedAt: '2025-01-05T12:00:00Z',
  },
  {
    id: 7, name: 'Deep Space Pioneer',
    description: 'Reach Level 5',
    icon: 'rocket',
    category: 'special', requirement: { level: 5 },
    points: 500, rarity: 'epic', isActive: true,
    unlockedAt: '2025-01-20T18:00:00Z',
  },
  {
    id: 8, name: 'Supernova Spotter',
    description: 'Identify a supernova remnant with 5-star confidence',
    icon: 'zap',
    category: 'discoveries', requirement: { supernova_5star: 1 },
    points: 750, rarity: 'epic', isActive: true,
    unlockedAt: '2025-02-14T20:00:00Z',
  },
  // Locked achievements
  {
    id: 9, name: 'Cosmic Sage',
    description: 'Reach Level 10 — the highest rank',
    icon: 'crown',
    category: 'special', requirement: { level: 10 },
    points: 2000, rarity: 'legendary', isActive: true,
  },
  {
    id: 10, name: 'Black Hole Discoverer',
    description: 'Be the first to annotate a black hole candidate',
    icon: 'eye',
    category: 'discoveries', requirement: { first_blackhole: 1 },
    points: 1500, rarity: 'legendary', isActive: true,
  },
  {
    id: 11, name: 'Mission Commander',
    description: 'Complete 20 missions',
    icon: 'target',
    category: 'missions', requirement: { missions: 20 },
    points: 400, rarity: 'epic', isActive: true,
  },
  {
    id: 12, name: 'Century Club',
    description: 'Make 100 annotations',
    icon: 'star',
    category: 'annotations', requirement: { annotations: 100 },
    points: 500, rarity: 'epic', isActive: true,
  },
];

// ---------------------------------------------------------------------------
// Demo leaderboard
// ---------------------------------------------------------------------------
export const DEMO_LEADERBOARD: User[] = [
  { id: 10, username: 'NebulaNova', email: '', role: 'user', score: 12400, level: 9, experience: 11500, createdAt: '', updatedAt: '' },
  { id: 11, username: 'StardustSam', email: '', role: 'user', score: 9800, level: 8, experience: 8200, createdAt: '', updatedAt: '' },
  { id: 12, username: 'GalaxyGrace', email: '', role: 'researcher', score: 8100, level: 7, experience: 6500, createdAt: '', updatedAt: '' },
  { id: 13, username: 'PulsarPete', email: '', role: 'user', score: 6200, level: 7, experience: 5100, createdAt: '', updatedAt: '' },
  { id: 1, username: 'CosmicExplorer', email: 'demo@astroquest.dev', role: 'user', score: 4250, level: 6, experience: 3800, createdAt: '', updatedAt: '' },
  { id: 14, username: 'OrionOlivia', email: '', role: 'user', score: 3900, level: 5, experience: 3200, createdAt: '', updatedAt: '' },
  { id: 15, username: 'QuasarQuinn', email: '', role: 'user', score: 3400, level: 5, experience: 2800, createdAt: '', updatedAt: '' },
  { id: 16, username: 'VortexVera', email: '', role: 'user', score: 2800, level: 4, experience: 2200, createdAt: '', updatedAt: '' },
  { id: 17, username: 'CosmicCaden', email: '', role: 'user', score: 2100, level: 4, experience: 1700, createdAt: '', updatedAt: '' },
  { id: 18, username: 'AstroAria', email: '', role: 'user', score: 1600, level: 3, experience: 1100, createdAt: '', updatedAt: '' },
  { id: 19, username: 'LunarLiam', email: '', role: 'user', score: 1200, level: 3, experience: 800, createdAt: '', updatedAt: '' },
  { id: 20, username: 'StellarSophie', email: '', role: 'user', score: 900, level: 2, experience: 500, createdAt: '', updatedAt: '' },
];

// ---------------------------------------------------------------------------
// Demo missions
// ---------------------------------------------------------------------------
export const DEMO_MISSIONS: Mission[] = [
  {
    id: 1, title: 'Galaxy Classification Sprint',
    description: 'Classify 5 different galaxies by their type (spiral, elliptical, or irregular). Focus on the shape and structure of each galaxy.',
    objective: { type: 'annotate', target: 5, category: 'galaxy' },
    reward: { points: 200, experience: 150 },
    difficulty: 2, duration: 7,
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    isActive: true, category: 'discovery',
    currentParticipants: 234,
    maxParticipants: 500,
  },
  {
    id: 2, title: 'Nebula Deep Dive',
    description: 'Explore and annotate nebulae across multiple images. Mark emission regions, reflection areas, and dark dust lanes.',
    objective: { type: 'annotate', target: 8, category: 'nebula' },
    reward: { points: 350, experience: 250 },
    difficulty: 3, duration: 14,
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 9 * 86400000).toISOString(),
    isActive: true, category: 'exploration',
    currentParticipants: 156,
    maxParticipants: 300,
  },
  {
    id: 3, title: 'Supernova Remnant Hunter',
    description: 'Search for supernova remnants in deep field images. Look for expanding shell structures and filamentary patterns.',
    objective: { type: 'annotate', target: 3, category: 'supernova' },
    reward: { points: 500, experience: 400 },
    difficulty: 4, duration: 21,
    startDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    isActive: true, category: 'discovery',
    currentParticipants: 89,
    maxParticipants: 200,
  },
  {
    id: 4, title: 'Star Cluster Census',
    description: 'Help catalog star clusters! Identify open clusters and globular clusters, noting their size and density.',
    objective: { type: 'annotate', target: 6, category: 'star_cluster' },
    reward: { points: 250, experience: 200 },
    difficulty: 2, duration: 10,
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isActive: true, category: 'science',
    currentParticipants: 312,
    maxParticipants: 500,
  },
];

// ---------------------------------------------------------------------------
// Demo daily challenge
// ---------------------------------------------------------------------------
export const DEMO_DAILY_CHALLENGE = {
  id: 1,
  title: 'Spot the Hidden Structures',
  description: 'Find and annotate 3 celestial objects in today\'s featured images. Look carefully for faint structures hiding in the backgrounds!',
  target: 3,
  categoryFilter: 'any category',
  reward: { points: 100, experience: 75 },
  expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
};

// ---------------------------------------------------------------------------
// Demo streak
// ---------------------------------------------------------------------------
export const DEMO_STREAK = {
  currentStreak: 12,
  longestStreak: 28,
  streakFrozen: false,
  lastCheckIn: new Date().toISOString(),
  freezesAvailable: 2,
};

// ---------------------------------------------------------------------------
// Demo user stats
// ---------------------------------------------------------------------------
export const DEMO_USER_STATS = {
  annotationCount: 87,
  validatedCount: 64,
  achievementCount: 8,
  categoryBreakdown: [
    { category: 'galaxy', count: 28 },
    { category: 'nebula', count: 22 },
    { category: 'star_cluster', count: 15 },
    { category: 'supernova', count: 10 },
    { category: 'black_hole', count: 5 },
    { category: 'quasar', count: 4 },
    { category: 'anomaly', count: 3 },
  ],
  user: { score: 4250, level: 6, experience: 3800 },
};

// ---------------------------------------------------------------------------
// Astronomical events calendar
// ---------------------------------------------------------------------------
export interface AstronomicalEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  type: 'meteor-shower' | 'eclipse' | 'conjunction' | 'opposition' | 'transit' | 'equinox' | 'solstice' | 'supermoon' | 'comet';
  visibility: 'naked-eye' | 'binoculars' | 'telescope';
  bestRegion: string;
}

export const ASTRONOMICAL_EVENTS: AstronomicalEvent[] = [
  { id: 1, title: 'Quadrantids Meteor Shower', date: '2026-01-03', description: 'One of the best annual meteor showers, producing up to 120 meteors per hour at its peak. Best viewed after midnight.', type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Northern Hemisphere' },
  { id: 2, title: 'Total Lunar Eclipse', date: '2026-03-03', description: 'The Moon passes through Earth\'s shadow, turning a deep red color. Visible across the Americas, Europe and Africa.', type: 'eclipse', visibility: 'naked-eye', bestRegion: 'Americas, Europe, Africa' },
  { id: 3, title: 'Lyrid Meteor Shower', date: '2026-04-22', description: 'An average shower producing about 20 meteors per hour at its peak. Produced by dust from comet C/1861 G1 Thatcher.', type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Northern Hemisphere' },
  { id: 4, title: 'Total Solar Eclipse', date: '2026-08-12', description: 'A total solar eclipse visible from parts of Arctic Russia, Greenland, Iceland, and Spain. Path of totality crosses northern Spain.', type: 'eclipse', visibility: 'naked-eye', bestRegion: 'Iceland, Greenland, Spain' },
  { id: 5, title: 'Perseid Meteor Shower', date: '2026-08-12', description: 'The most popular annual meteor shower, producing up to 100 bright meteors per hour. Produced by comet Swift-Tuttle.', type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Northern Hemisphere' },
  { id: 6, title: 'Saturn Opposition', date: '2026-09-21', description: 'Saturn will be at its closest approach to Earth and fully illuminated by the Sun. This is the best time to photograph and observe Saturn and its rings.', type: 'opposition', visibility: 'binoculars', bestRegion: 'Global' },
  { id: 7, title: 'Partial Lunar Eclipse', date: '2026-09-17', description: 'A partial lunar eclipse visible from the Pacific, Australia, and East Asia. About 90% of the Moon enters Earth\'s shadow.', type: 'eclipse', visibility: 'naked-eye', bestRegion: 'Pacific, Australia, East Asia' },
  { id: 8, title: 'Orionid Meteor Shower', date: '2026-10-21', description: 'Produced by dust from Halley\'s Comet, this shower produces about 20 fast meteors per hour at its peak.', type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Global' },
  { id: 9, title: 'Geminid Meteor Shower', date: '2026-12-13', description: 'The king of meteor showers, producing up to 150 multi-colored meteors per hour. Produced by asteroid 3200 Phaethon.', type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Global' },
  { id: 10, title: 'Jupiter Opposition', date: '2026-11-10', description: 'Jupiter at its closest approach to Earth. Its moons and cloud bands are clearly visible through a small telescope.', type: 'opposition', visibility: 'binoculars', bestRegion: 'Global' },
  { id: 11, title: 'March Equinox', date: '2026-03-20', description: 'The Sun crosses the celestial equator. Day and night are nearly equal in length everywhere on Earth.', type: 'equinox', visibility: 'naked-eye', bestRegion: 'Global' },
  { id: 12, title: 'June Solstice', date: '2026-06-21', description: 'The longest day of the year in the Northern Hemisphere. The Sun reaches its highest point in the sky.', type: 'solstice', visibility: 'naked-eye', bestRegion: 'Global' },
];

// ---------------------------------------------------------------------------
// NASA APOD gallery data
// ---------------------------------------------------------------------------
export interface APODItem {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
}

export const DEMO_APOD_GALLERY: APODItem[] = [
  {
    date: '2024-12-01',
    title: 'A Full Moon of Pleiades',
    explanation: 'Have you ever seen the Pleiades star cluster? Perhaps the most famous star cluster on the sky, the Pleiades can be seen without binoculars from even the depths of a light-polluted city.',
    url: 'https://apod.nasa.gov/apod/image/2412/Pleiades_Stocks_960.jpg',
    hdurl: 'https://apod.nasa.gov/apod/image/2412/Pleiades_Stocks_4096.jpg',
    media_type: 'image',
  },
  {
    date: '2024-11-28',
    title: 'M1: The Crab Nebula from Hubble',
    explanation: 'This is the mess that is left when a star explodes. The Crab Nebula is a supernova remnant, the result of a star that was observed to explode in 1054 AD.',
    url: 'https://apod.nasa.gov/apod/image/2411/CrabNebula_Hubble_960.jpg',
    media_type: 'image',
  },
  {
    date: '2024-11-25',
    title: 'NGC 6357: The Lobster Nebula',
    explanation: 'Why is the Lobster Nebula forming some of the most massive stars known? No one is yet sure. Near the center of the Lobster Nebula, officially known as NGC 6357, lie massive stars.',
    url: 'https://apod.nasa.gov/apod/image/2411/LobsterNebula_Hubble_960.jpg',
    media_type: 'image',
  },
  {
    date: '2024-11-20',
    title: 'Stars and Dust across Corona Australis',
    explanation: 'Cosmic dust clouds and young stars inhabit this dusty field of view in the constellation Corona Australis.',
    url: 'https://apod.nasa.gov/apod/image/2411/CoronaAustralis_ESO_960.jpg',
    media_type: 'image',
  },
  {
    date: '2024-11-15',
    title: 'The Great Nebula in Orion',
    explanation: 'The Great Nebula in Orion, also known as M42, is one of the most famous nebulae in the sky. The nebula\'s glowing gas surrounds hot young stars at the edge of an immense interstellar molecular cloud.',
    url: 'https://apod.nasa.gov/apod/image/2411/OrionNebula_Hubble_960.jpg',
    media_type: 'image',
  },
  {
    date: '2024-11-10',
    title: 'The Sombrero Galaxy in Infrared',
    explanation: 'The Sombrero Galaxy (M104) is one of the largest galaxies in the nearby Virgo Cluster. The dark band of dust that obscures the mid-section is the galaxy\'s spiral structure seen nearly edge-on.',
    url: 'https://apod.nasa.gov/apod/image/2411/Sombrero_Spitzer_960.jpg',
    media_type: 'image',
  },
  {
    date: '2024-11-05',
    title: 'Saturn at Night',
    explanation: 'Saturn\'s magnificent rings are one of the most beautiful sights in the solar system. This nightside view was captured by the Cassini spacecraft.',
    url: 'https://apod.nasa.gov/apod/image/2411/SaturnNight_Cassini_960.jpg',
    media_type: 'image',
  },
  {
    date: '2024-10-30',
    title: 'NGC 1333: Stellar Nursery in Perseus',
    explanation: 'NGC 1333 is one of the nearest star-forming regions in our galaxy, located about 1,000 light-years away in the constellation Perseus.',
    url: 'https://apod.nasa.gov/apod/image/2410/NGC1333_Webb_960.jpg',
    media_type: 'image',
  },
];

// ---------------------------------------------------------------------------
// Interactive Sky Map constellation data
// ---------------------------------------------------------------------------
export interface ConstellationStar {
  name: string;
  ra: number;   // right ascension in degrees (0-360)
  dec: number;  // declination in degrees (-90 to 90)
  magnitude: number;
  color?: string;
}

export interface Constellation {
  name: string;
  abbreviation: string;
  stars: ConstellationStar[];
  lines: [number, number][]; // pairs of star indices to connect
  description: string;
}

export const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Orion',
    abbreviation: 'Ori',
    description: 'The Hunter — one of the most recognizable constellations, visible from most of the world. Contains the famous Orion Nebula (M42).',
    stars: [
      { name: 'Betelgeuse', ra: 88.79, dec: 7.41, magnitude: 0.5, color: '#ff6b35' },
      { name: 'Rigel', ra: 78.63, dec: -8.20, magnitude: 0.13, color: '#a8d8ff' },
      { name: 'Bellatrix', ra: 81.28, dec: 6.35, magnitude: 1.64, color: '#c8e0ff' },
      { name: 'Mintaka', ra: 83.00, dec: -0.30, magnitude: 2.23, color: '#d0e8ff' },
      { name: 'Alnilam', ra: 84.05, dec: -1.20, magnitude: 1.69, color: '#c8e0ff' },
      { name: 'Alnitak', ra: 85.19, dec: -1.94, magnitude: 1.77, color: '#c8e0ff' },
      { name: 'Saiph', ra: 86.94, dec: -9.67, magnitude: 2.09, color: '#c8e0ff' },
    ],
    lines: [[0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [1, 3], [0, 4]],
  },
  {
    name: 'Ursa Major',
    abbreviation: 'UMa',
    description: 'The Great Bear — contains the Big Dipper asterism, one of the most famous star patterns in the northern sky.',
    stars: [
      { name: 'Dubhe', ra: 165.93, dec: 61.75, magnitude: 1.79, color: '#ffd699' },
      { name: 'Merak', ra: 165.46, dec: 56.38, magnitude: 2.37, color: '#d0e8ff' },
      { name: 'Phecda', ra: 178.46, dec: 53.69, magnitude: 2.44, color: '#d0e8ff' },
      { name: 'Megrez', ra: 183.86, dec: 57.03, magnitude: 3.31, color: '#d0e8ff' },
      { name: 'Alioth', ra: 193.51, dec: 55.96, magnitude: 1.77, color: '#d0e8ff' },
      { name: 'Mizar', ra: 200.98, dec: 54.93, magnitude: 2.27, color: '#d0e8ff' },
      { name: 'Alkaid', ra: 206.89, dec: 49.31, magnitude: 1.86, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [3, 0]],
  },
  {
    name: 'Cassiopeia',
    abbreviation: 'Cas',
    description: 'The Queen — a distinctive W-shaped constellation circling the North Celestial Pole. Named after a vain queen in Greek mythology.',
    stars: [
      { name: 'Schedar', ra: 10.13, dec: 56.54, magnitude: 2.23, color: '#ffd699' },
      { name: 'Caph', ra: 2.29, dec: 59.15, magnitude: 2.27, color: '#ffffd0' },
      { name: 'Gamma Cas', ra: 14.18, dec: 60.72, magnitude: 2.47, color: '#c8e0ff' },
      { name: 'Ruchbah', ra: 21.45, dec: 60.24, magnitude: 2.68, color: '#d0e8ff' },
      { name: 'Segin', ra: 28.60, dec: 63.67, magnitude: 3.37, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4]],
  },
  {
    name: 'Scorpius',
    abbreviation: 'Sco',
    description: 'The Scorpion — a zodiac constellation with the bright red supergiant Antares at its heart. Best seen in summer from the Northern Hemisphere.',
    stars: [
      { name: 'Antares', ra: 247.35, dec: -26.43, magnitude: 0.96, color: '#ff4500' },
      { name: 'Shaula', ra: 263.40, dec: -37.10, magnitude: 1.63, color: '#c8e0ff' },
      { name: 'Sargas', ra: 264.33, dec: -42.99, magnitude: 1.87, color: '#ffffd0' },
      { name: 'Dschubba', ra: 240.08, dec: -22.62, magnitude: 2.32, color: '#c8e0ff' },
      { name: 'Graffias', ra: 241.36, dec: -19.81, magnitude: 2.62, color: '#c8e0ff' },
      { name: 'Epsilon Sco', ra: 252.54, dec: -34.29, magnitude: 2.29, color: '#ffd699' },
    ],
    lines: [[4, 3], [3, 0], [0, 5], [5, 1], [1, 2]],
  },
  {
    name: 'Leo',
    abbreviation: 'Leo',
    description: 'The Lion — a zodiac constellation anchored by the bright star Regulus. One of the earliest recognized constellations.',
    stars: [
      { name: 'Regulus', ra: 152.09, dec: 11.97, magnitude: 1.35, color: '#c8e0ff' },
      { name: 'Denebola', ra: 177.26, dec: 14.57, magnitude: 2.14, color: '#d0e8ff' },
      { name: 'Algieba', ra: 146.46, dec: 19.84, magnitude: 2.28, color: '#ffd699' },
      { name: 'Zosma', ra: 168.53, dec: 20.52, magnitude: 2.56, color: '#d0e8ff' },
      { name: 'Chertan', ra: 168.56, dec: 15.43, magnitude: 3.33, color: '#d0e8ff' },
    ],
    lines: [[0, 2], [2, 3], [3, 1], [0, 4], [4, 1]],
  },
  {
    name: 'Cygnus',
    abbreviation: 'Cyg',
    description: 'The Swan — also known as the Northern Cross. Contains Deneb, one of the brightest stars in the sky, and lies along the Milky Way.',
    stars: [
      { name: 'Deneb', ra: 310.36, dec: 45.28, magnitude: 1.25, color: '#d0e8ff' },
      { name: 'Sadr', ra: 305.56, dec: 40.26, magnitude: 2.20, color: '#ffffd0' },
      { name: 'Gienah', ra: 311.55, dec: 33.97, magnitude: 2.46, color: '#ffd699' },
      { name: 'Albireo', ra: 292.68, dec: 27.96, magnitude: 3.08, color: '#ffd699' },
      { name: 'Delta Cyg', ra: 296.24, dec: 45.13, magnitude: 2.87, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [1, 2], [1, 3], [1, 4]],
  },
  {
    name: 'Lyra',
    abbreviation: 'Lyr',
    description: 'The Lyre — a small but prominent constellation. Contains Vega, the fifth-brightest star in the sky and part of the Summer Triangle.',
    stars: [
      { name: 'Vega', ra: 279.23, dec: 38.78, magnitude: 0.03, color: '#d0e8ff' },
      { name: 'Sheliak', ra: 282.52, dec: 33.36, magnitude: 3.52, color: '#d0e8ff' },
      { name: 'Sulafat', ra: 284.74, dec: 32.69, magnitude: 3.24, color: '#c8e0ff' },
      { name: 'Delta1 Lyr', ra: 281.08, dec: 36.98, magnitude: 5.58, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [0, 2], [1, 2], [0, 3]],
  },
];

// ---------------------------------------------------------------------------
// Helper: check if running in demo mode
// ---------------------------------------------------------------------------
export function isDemoMode(): boolean {
  const apiUrl = import.meta.env.VITE_API_URL;
  // Demo mode when there is no API URL configured, or explicitly set
  return !apiUrl || apiUrl === '/api' || import.meta.env.VITE_DEMO_MODE === 'true';
}
