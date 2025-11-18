import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import { User as UserType } from '@/types';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await userService.getLeaderboard(50);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-400" />;
    return <span className="text-gray-400 font-semibold">{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-primary-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-400">Top citizen scientists of the cosmos</p>
      </div>

      <div className="card">
        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                index < 3
                  ? 'bg-gradient-to-r from-primary-900/30 to-purple-900/30'
                  : 'bg-space-dark hover:bg-space-purple'
              }`}
            >
              <div className="w-12 flex items-center justify-center">
                {getRankIcon(index)}
              </div>

              <div className="flex-1 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                  {user.username[0].toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-lg">{user.username}</div>
                  <div className="text-sm text-gray-400">Level {user.level}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-primary-400">
                  {user.score.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
