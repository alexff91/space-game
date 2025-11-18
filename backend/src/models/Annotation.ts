import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AnnotationAttributes {
  id: number;
  userId: number;
  imageId: number;
  type: 'point' | 'rectangle' | 'polygon' | 'freeform';
  coordinates: object;  // GeoJSON format
  category: string;  // galaxy, nebula, asteroid, anomaly, etc.
  confidence?: number;  // 1-5 scale
  description?: string;
  metadata?: object;
  consensusScore?: number;  // How many users agree
  isValidated?: boolean;
  validatedBy?: number;  // Researcher/admin user ID
  validatedAt?: Date;
  pointsAwarded?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AnnotationCreationAttributes extends Optional<AnnotationAttributes, 'id' | 'consensusScore' | 'isValidated'> {}

class Annotation extends Model<AnnotationAttributes, AnnotationCreationAttributes> implements AnnotationAttributes {
  public id!: number;
  public userId!: number;
  public imageId!: number;
  public type!: 'point' | 'rectangle' | 'polygon' | 'freeform';
  public coordinates!: object;
  public category!: string;
  public confidence?: number;
  public description?: string;
  public metadata?: object;
  public consensusScore?: number;
  public isValidated?: boolean;
  public validatedBy?: number;
  public validatedAt?: Date;
  public pointsAwarded?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Annotation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'images',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('point', 'rectangle', 'polygon', 'freeform'),
      allowNull: false,
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    confidence: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    consensusScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isValidated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    validatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pointsAwarded: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'annotations',
    timestamps: true,
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['imageId'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['isValidated'],
      },
    ],
  }
);

export default Annotation;
