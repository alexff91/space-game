import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Search, Map, Flame, Users, Rocket, Zap, Crown, Eye, Target, Star, Cloud } from 'lucide-react';
import { DEMO_ACHIEVEMENTS } from '@/services/demoData';
import { Achievement } from '@/types';

/**
 * Achievements page — displays all possible achievements with
 * unlock status, rarity tiers, and progress tracking.
 */

const ICON_MAP: Record<string, React.ReactNode> = {
  telescope: <Search className="w-7 h-7" />,
  map: <Map className="w-7 h-7" />,
  galaxy: <Star className="w-7 h-7" />,
  cloud: <Cloud className="w-7 h-7" />,
  flame: <Flame className="w-7 h-7" />,
  users: <Users className="w-7 h-7" />,
  rocket: <Rocket className="w-7 h-7" />,
  zap: <Zap className="w-7 h-7" />,
  crown: <Crown className="w-7 h-7" />,
  eye: <Eye className="w-7 h-7" />,
  target: <Target className="w-7 h-7" />,
  star: <Star className="w-7 h-7" />,
};

const RARITY_CONFIG: Record<string, { bg: string; border: string; text: string; glow: string; label: string }> = {
  common: {
    bg: 'bg-gray-800/50',
    border: 'border-gray-600/50',
    text: 'text-gray-300',
    glow: '',
    label: 'Common',
  },
  rare: {
    bg: 'bg-blue-900/30',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/10',
    label: 'Rare',
  },
  epic: {
    bg: 'bg-purple-900/30',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    label: 'Epic',
  },
  legendary: {
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/20',
    label: 'Legendary',
  },
};

type FilterCategory = 'all' | Achievement['category'];
type FilterRarity = 'all' | Achievement['rarity'];

export default function Achievements() {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');

  const achievements = DEMO_ACHIEVEMENTS;
  const unlocked = achievements.filter((a) => a.unlockedAt);
  const totalPoints = unlocked.reduce((s, a) => s + a.points, 0);

  const filtered = achievements.filter((a) => {
    if (filterCategory !== 'all' && a.category !== filterCategory) return false;
    if (filterRarity !== 'all' && a.rarity !== filterRarity) return false;
    return true;
  });

  // Sort: unlocked first, then by rarity (legendary > epic > rare > common)
  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;
    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Award className="w-16 h-16 text-primary-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Achievements</h1>
        <p className="text-gray-400 text-lg">Collect badges and prove your cosmic expertise</p>
      </div>

      {/* Stats banner */}
      <div className="card bg-gradient-to-r from-primary-900/30 to-purple-900/30 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-400">{unlocked.length}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-500">{achievements.length - unlocked.length}</div>
            <div className="text-sm text-gray-400">Locked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">{totalPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Points Earned</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">
              {Math.round((unlocked.length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Completion</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-primary-500 via-purple-500 to-yellow-500 h-2.5 rounded-full transition-all"
              style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {(['all', 'annotations', 'discoveries', 'missions', 'social', 'special'] as FilterCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-space-blue text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'common', 'rare', 'epic', 'legendary'] as FilterRarity[]).map((rarity) => {
            const cfg = rarity !== 'all' ? RARITY_CONFIG[rarity] : null;
            return (
              <button
                key={rarity}
                onClick={() => setFilterRarity(rarity)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  filterRarity === rarity
                    ? cfg ? `${cfg.bg} ${cfg.text} border ${cfg.border}` : 'bg-primary-600 text-white'
                    : 'bg-space-blue text-gray-400 hover:text-white'
                }`}
              >
                {rarity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((achievement, idx) => {
          const isUnlocked = !!achievement.unlockedAt;
          const rarity = RARITY_CONFIG[achievement.rarity];
          const icon = achievement.icon ? ICON_MAP[achievement.icon] : <Award className="w-7 h-7" />;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`relative rounded-xl border p-5 transition-all ${
                isUnlocked
                  ? `${rarity.bg} ${rarity.border} hover:shadow-lg ${rarity.glow}`
                  : 'bg-gray-900/30 border-gray-800/50 opacity-60'
              }`}
            >
              {/* Rarity badge */}
              <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${rarity.bg} ${rarity.text} border ${rarity.border}`}>
                {rarity.label}
              </div>

              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                  isUnlocked ? `${rarity.bg} ${rarity.text}` : 'bg-gray-800 text-gray-600'
                }`}>
                  {isUnlocked ? icon : <Lock className="w-7 h-7" />}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{achievement.description}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-semibold text-yellow-400">+{achievement.points} pts</span>
                    <span className="text-xs text-gray-500 capitalize">{achievement.category}</span>
                  </div>

                  {isUnlocked && achievement.unlockedAt && (
                    <div className="text-[10px] text-gray-500 mt-1">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
