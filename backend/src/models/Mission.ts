import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MissionAttributes {
  id: number;
  title: string;
  description: string;
  objective: object;  // What needs to be accomplished
  reward: object;  // Points, badges, etc.
  difficulty: number;  // 1-5
  duration?: number;  // in days, null for unlimited
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  imageIds?: number[];  // Specific images for this mission
  category?: string;
  maxParticipants?: number;  // For limited missions
  currentParticipants: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MissionCreationAttributes extends Optional<MissionAttributes, 'id' | 'isActive' | 'currentParticipants'> {}

class Mission extends Model<MissionAttributes, MissionCreationAttributes> implements MissionAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public objective!: object;
  public reward!: object;
  public difficulty!: number;
  public duration?: number;
  public startDate?: Date;
  public endDate?: Date;
  public isActive!: boolean;
  public imageIds?: number[];
  public category?: string;
  public maxParticipants?: number;
  public currentParticipants!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Mission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    objective: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    reward: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    imageIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    currentParticipants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'missions',
    timestamps: true,
  }
);

export default Mission;
