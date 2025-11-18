import sequelize from '../config/database';
import User from './User';
import Image from './Image';
import Annotation from './Annotation';
import Achievement from './Achievement';
import UserAchievement from './UserAchievement';
import Mission from './Mission';

// Define associations
User.hasMany(Annotation, { foreignKey: 'userId', as: 'annotations' });
Annotation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Image.hasMany(Annotation, { foreignKey: 'imageId', as: 'annotations' });
Annotation.belongsTo(Image, { foreignKey: 'imageId', as: 'image' });

User.belongsToMany(Achievement, {
  through: UserAchievement,
  foreignKey: 'userId',
  as: 'achievements',
});
Achievement.belongsToMany(User, {
  through: UserAchievement,
  foreignKey: 'achievementId',
  as: 'users',
});

export {
  sequelize,
  User,
  Image,
  Annotation,
  Achievement,
  UserAchievement,
  Mission,
};

// Sync database (for development only)
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};
