import { Target, Clock, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Mission {
  id: number;
  title: string;
  description: string;
  objective: {
    type: string;
    target: number;
  };
  reward: {
    points?: number;
    experience?: number;
  };
  difficulty: number;
  endDate?: string;
  progress?: number;
}

interface MissionCardProps {
  mission: Mission;
  onSelect?: () => void;
}

export default function MissionCard({ mission, onSelect }: MissionCardProps) {
  const progress = mission.progress || 0;
  const daysLeft = mission.endDate
    ? Math.ceil(
        (new Date(mission.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-400';
    if (difficulty <= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 3) return 'Medium';
    return 'Hard';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card cursor-pointer hover:shadow-2xl transition-all"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-900/30 rounded-lg">
            <Target className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{mission.title}</h3>
            <span
              className={`text-sm font-medium ${getDifficultyColor(mission.difficulty)}`}
            >
              {getDifficultyLabel(mission.difficulty)}
            </span>
          </div>
        </div>

        {daysLeft !== null && (
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{daysLeft}d left</span>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm mb-4">{mission.description}</p>

      {/* Progress */}
      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-primary-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Rewards */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          {mission.reward.points && (
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">+{mission.reward.points}</span>
            </div>
          )}
          {mission.reward.experience && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold">+{mission.reward.experience} XP</span>
            </div>
          )}
        </div>

        {progress >= 100 && (
          <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-semibold">
            Completed!
          </span>
        )}
      </div>
    </motion.div>
  );
}
