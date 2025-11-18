import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ImageAttributes {
  id: number;
  nasaId?: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  source: 'nasa' | 'esa' | 'hubble' | 'other';
  metadata?: object;
  coordinates?: {
    ra?: number;  // Right Ascension
    dec?: number; // Declination
  };
  wavelength?: string;
  telescope?: string;
  dateObserved?: Date;
  width?: number;
  height?: number;
  annotationCount: number;
  consensusAnnotations?: object[];
  difficulty?: number;  // 1-5 scale
  category?: string;
  tags?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id' | 'annotationCount' | 'isActive'> {}

class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  public id!: number;
  public nasaId?: string;
  public title!: string;
  public description?: string;
  public imageUrl!: string;
  public thumbnailUrl?: string;
  public source!: 'nasa' | 'esa' | 'hubble' | 'other';
  public metadata?: object;
  public coordinates?: {
    ra?: number;
    dec?: number;
  };
  public wavelength?: string;
  public telescope?: string;
  public dateObserved?: Date;
  public width?: number;
  public height?: number;
  public annotationCount!: number;
  public consensusAnnotations?: object[];
  public difficulty?: number;
  public category?: string;
  public tags?: string[];
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nasaId: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    source: {
      type: DataTypes.ENUM('nasa', 'esa', 'hubble', 'other'),
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    wavelength: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    telescope: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dateObserved: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    annotationCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    consensusAnnotations: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    difficulty: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'images',
    timestamps: true,
    indexes: [
      {
        fields: ['source'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default Image;
