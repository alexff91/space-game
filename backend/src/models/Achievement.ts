import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AchievementAttributes {
  id: number;
  name: string;
  description: string;
  icon?: string;
  category: 'annotations' | 'discoveries' | 'missions' | 'social' | 'special';
  requirement: object;  // Conditions to unlock
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AchievementCreationAttributes extends Optional<AchievementAttributes, 'id' | 'isActive'> {}

class Achievement extends Model<AchievementAttributes, AchievementCreationAttributes> implements AchievementAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public icon?: string;
  public category!: 'annotations' | 'discoveries' | 'missions' | 'social' | 'special';
  public requirement!: object;
  public points!: number;
  public rarity!: 'common' | 'rare' | 'epic' | 'legendary';
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Achievement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('annotations', 'discoveries', 'missions', 'social', 'special'),
      allowNull: false,
    },
    requirement: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    rarity: {
      type: DataTypes.ENUM('common', 'rare', 'epic', 'legendary'),
      defaultValue: 'common',
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'achievements',
    timestamps: true,
  }
);

export default Achievement;
