import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface DailyChallengeAttributes {
  id: number;
  date: Date;
  title: string;
  description: string;
  type: 'annotate_count' | 'category_specific' | 'accuracy' | 'discovery';
  target: number;
  reward: object;
  imageIds?: number[];
  categoryFilter?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DailyChallengeCreationAttributes extends Optional<DailyChallengeAttributes, 'id' | 'isActive'> {}

class DailyChallenge extends Model<DailyChallengeAttributes, DailyChallengeCreationAttributes> implements DailyChallengeAttributes {
  public id!: number;
  public date!: Date;
  public title!: string;
  public description!: string;
  public type!: 'annotate_count' | 'category_specific' | 'accuracy' | 'discovery';
  public target!: number;
  public reward!: object;
  public imageIds?: number[];
  public categoryFilter?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DailyChallenge.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('annotate_count', 'category_specific', 'accuracy', 'discovery'),
      allowNull: false,
    },
    target: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reward: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { points: 100, experience: 100 },
    },
    imageIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    categoryFilter: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'daily_challenges',
    timestamps: true,
    indexes: [
      {
        fields: ['date'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default DailyChallenge;
