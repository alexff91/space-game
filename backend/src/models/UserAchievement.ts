import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAchievementAttributes {
  id: number;
  userId: number;
  achievementId: number;
  unlockedAt: Date;
  createdAt?: Date;
}

interface UserAchievementCreationAttributes extends Optional<UserAchievementAttributes, 'id' | 'unlockedAt'> {}

class UserAchievement extends Model<UserAchievementAttributes, UserAchievementCreationAttributes> implements UserAchievementAttributes {
  public id!: number;
  public userId!: number;
  public achievementId!: number;
  public unlockedAt!: Date;
  public readonly createdAt!: Date;
}

UserAchievement.init(
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
    achievementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'achievements',
        key: 'id',
      },
    },
    unlockedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'user_achievements',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'achievementId'],
      },
    ],
  }
);

export default UserAchievement;
