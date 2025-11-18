export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'researcher' | 'admin';
  score: number;
  level: number;
  experience: number;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: number;
  nasaId?: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  source: 'nasa' | 'esa' | 'hubble' | 'other';
  metadata?: Record<string, any>;
  coordinates?: {
    ra?: number;
    dec?: number;
  };
  wavelength?: string;
  telescope?: string;
  dateObserved?: string;
  width?: number;
  height?: number;
  annotationCount: number;
  consensusAnnotations?: ConsensusAnnotation[];
  difficulty?: number;
  category?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Annotation {
  id: number;
  userId: number;
  imageId: number;
  type: 'point' | 'rectangle' | 'polygon' | 'freeform';
  coordinates: AnnotationCoordinates;
  category: string;
  confidence?: number;
  description?: string;
  metadata?: Record<string, any>;
  consensusScore?: number;
  isValidated?: boolean;
  validatedBy?: number;
  validatedAt?: string;
  pointsAwarded?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    level: number;
  };
}

export interface AnnotationCoordinates {
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  points?: Array<{ x: number; y: number }>;
}

export interface ConsensusAnnotation {
  category: string;
  coordinates: {
    x: number;
    y: number;
  };
  agreementCount: number;
  confidence: number;
  userIds: number[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon?: string;
  category: 'annotations' | 'discoveries' | 'missions' | 'social' | 'special';
  requirement: Record<string, any>;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  unlockedAt?: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  objective: Record<string, any>;
  reward: Record<string, any>;
  difficulty: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  imageIds?: number[];
  category?: string;
  maxParticipants?: number;
  currentParticipants: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AnnotationCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  examples: string[];
}
