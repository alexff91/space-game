import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import { User as UserType } from '@/types';
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { isDemoMode, DEMO_LEADERBOARD } from '@/services/demoData';
import { useAuthStore } from '@/store/authStore';

export default function Leaderboard() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      if (isDemoMode()) {
        setUsers(DEMO_LEADERBOARD);
      } else {
        const response = await userService.getLeaderboard(50);
        setUsers(response.data);
      }
    } catch {
      // Fall back to demo data
      setUsers(DEMO_LEADERBOARD);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-7 h-7 text-yellow-400 drop-shadow-lg" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-500 font-semibold text-lg">{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-900/20 via-yellow-800/10 to-transparent border border-yellow-500/20';
    if (index === 1) return 'bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-transparent border border-gray-400/20';
    if (index === 2) return 'bg-gradient-to-r from-orange-900/20 via-orange-800/10 to-transparent border border-orange-500/20';
    return 'bg-space-dark hover:bg-space-purple border border-transparent';
  };

  const getAvatarGradient = (index: number) => {
    if (index === 0) return 'from-yellow-400 to-orange-500';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-orange-400 to-red-500';
    return 'from-primary-500 to-purple-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  // Top 3 podium
  const top3 = users.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-primary-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-400">Top citizen scientists of the cosmos</p>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* 2nd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center mt-8"
          >
            <Medal className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarGradient(1)} rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2`}>
              {top3[1].username[0].toUpperCase()}
            </div>
            <div className="font-semibold text-sm truncate">{top3[1].username}</div>
            <div className="text-xs text-gray-400">Level {top3[1].level}</div>
            <div className="text-lg font-bold text-gray-300 mt-1">{top3[1].score.toLocaleString()}</div>
          </motion.div>

          {/* 1st place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center bg-gradient-to-b from-yellow-900/20 to-transparent border-yellow-500/20"
          >
            <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
            <div className={`w-16 h-16 bg-gradient-to-br ${getAvatarGradient(0)} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2 ring-2 ring-yellow-400/50`}>
              {top3[0].username[0].toUpperCase()}
            </div>
            <div className="font-bold text-base truncate">{top3[0].username}</div>
            <div className="text-xs text-gray-400">Level {top3[0].level}</div>
            <div className="text-xl font-bold text-yellow-400 mt-1">{top3[0].score.toLocaleString()}</div>
          </motion.div>

          {/* 3rd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center mt-12"
          >
            <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarGradient(2)} rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2`}>
              {top3[2].username[0].toUpperCase()}
            </div>
            <div className="font-semibold text-sm truncate">{top3[2].username}</div>
            <div className="text-xs text-gray-400">Level {top3[2].level}</div>
            <div className="text-lg font-bold text-orange-400 mt-1">{top3[2].score.toLocaleString()}</div>
          </motion.div>
        </div>
      )}

      {/* Full list */}
      <div className="card">
        <div className="space-y-2">
          {users.map((user, index) => {
            const isCurrentUser = currentUser?.id === user.id || currentUser?.username === user.username;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg transition-all ${getRankBg(index)} ${
                  isCurrentUser ? 'ring-1 ring-primary-500/50' : ''
                }`}
              >
                <div className="w-10 flex items-center justify-center flex-shrink-0">
                  {getRankIcon(index)}
                </div>

                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getAvatarGradient(index)} rounded-full flex items-center justify-center text-base sm:text-xl font-bold flex-shrink-0`}>
                  {user.username[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base truncate">{user.username}</span>
                    {isCurrentUser && (
                      <span className="px-1.5 py-0.5 bg-primary-900/30 text-primary-400 text-[10px] font-bold rounded">YOU</span>
                    )}
                    {user.role === 'researcher' && (
                      <span className="px-1.5 py-0.5 bg-green-900/30 text-green-400 text-[10px] font-bold rounded">RESEARCHER</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Level {user.level}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className={`text-lg sm:text-2xl font-bold ${index < 3 ? 'text-primary-400' : 'text-gray-300'}`}>
                    {user.score.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
