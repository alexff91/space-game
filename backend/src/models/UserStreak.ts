import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserStreakAttributes {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  streakFrozen: boolean;
  freezeUsedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserStreakCreationAttributes extends Optional<UserStreakAttributes, 'id' | 'currentStreak' | 'longestStreak' | 'streakFrozen'> {}

class UserStreak extends Model<UserStreakAttributes, UserStreakCreationAttributes> implements UserStreakAttributes {
  public id!: number;
  public userId!: number;
  public currentStreak!: number;
  public longestStreak!: number;
  public lastActiveDate!: Date;
  public streakFrozen!: boolean;
  public freezeUsedDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserStreak.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    currentStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    longestStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    lastActiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    streakFrozen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    freezeUsedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_streaks',
    timestamps: true,
  }
);

export default UserStreak;
