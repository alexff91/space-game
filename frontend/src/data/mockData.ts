import { Image, User, Annotation } from '@/types';

export const MOCK_USER: User = {
  id: 1,
  username: 'SpaceExplorer',
  email: 'explorer@example.com',
  role: 'user',
  score: 150,
  level: 2,
  experience: 500,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_IMAGES: Image[] = [
  {
    id: 1,
    title: 'Pillars of Creation',
    description: 'The Pillars of Creation are bathed in the blistering ultraviolet light from a grouping of young, massive stars located off the top of the image. Streamers of gas can be seen bleeding off the pillars as the intense radiation heats and evaporates it into space. Denser regions of the pillars are shadowing material beneath them from the powerful radiation. Stars are being born deep inside the pillars, which are made of cold hydrogen gas and dust.',
    imageUrl: 'https://stsci-opo.org/STScI-01G7ETPF7DVBJ9F9D5B6H3M3K5.png',
    source: 'nasa',
    telescope: 'James Webb Space Telescope',
    wavelength: 'Near-Infrared',
    difficulty: 3,
    annotationCount: 124,
    width: 2000,
    height: 2000,
    tags: ['nebula', 'star-formation', 'iconic'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Carina Nebula',
    description: 'This landscape of "mountains" and "valleys" speckled with glittering stars is actually the edge of a nearby, young, star-forming region called NGC 3324 in the Carina Nebula. Captured in infrared light by the James Webb Space Telescope, this image reveals for the first time previously invisible areas of star birth.',
    imageUrl: 'https://stsci-opo.org/STScI-01G7ETSEW3K9Z9S5K6H3M3K5.png',
    source: 'nasa',
    telescope: 'James Webb Space Telescope',
    wavelength: 'Infrared',
    difficulty: 2,
    annotationCount: 89,
    width: 2000,
    height: 2000,
    tags: ['nebula', 'mountains', 'stars'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Stephans Quintet',
    description: 'Stephans Quintet, a visual grouping of five galaxies, is best known for being prominently featured in the holiday classic film "Its a Wonderful Life." Today, NASA’s James Webb Space Telescope reveals Stephan’s Quintet in a new light. This enormous mosaic is Webb’s largest image to date, covering about one-fifth of the Moon’s diameter.',
    imageUrl: 'https://stsci-opo.org/STScI-01G7ETV29F9D5B6H3M3K5.png',
    source: 'nasa',
    telescope: 'James Webb Space Telescope',
    wavelength: 'Mid-Infrared',
    difficulty: 4,
    annotationCount: 256,
    width: 2000,
    height: 2000,
    tags: ['galaxies', 'interaction', 'group'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const MOCK_ANNOTATIONS: Annotation[] = [
  {
    id: 1,
    imageId: 1,
    userId: 2,
    type: 'point',
    coordinates: { x: 500, y: 500 },
    category: 'star',
    confidence: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
