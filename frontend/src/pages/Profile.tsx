import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/userService';
import { User, Award, BarChart3, Target, ArrowRight } from 'lucide-react';
import { getProgressToNextLevel, getNextLevelXP } from '@/utils/constants';
import { isDemoMode, DEMO_USER_STATS, DEMO_ANNOTATIONS, DEMO_ACHIEVEMENTS } from '@/services/demoData';

export default function Profile() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [recentAnnotations, setRecentAnnotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentAnnotations();
  }, []);

  const loadStats = async () => {
    try {
      if (isDemoMode()) {
        setStats(DEMO_USER_STATS);
      } else {
        const response = await userService.getUserStats();
        setStats(response.data);
      }
    } catch {
      setStats(DEMO_USER_STATS);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentAnnotations = async () => {
    try {
      if (isDemoMode()) {
        setRecentAnnotations(DEMO_ANNOTATIONS.slice(0, 5).map((a) => ({
          ...a,
          image: { title: `Image #${a.imageId}`, thumbnailUrl: undefined, imageUrl: undefined },
        })));
      } else {
        const { annotationService } = await import('@/services/annotationService');
        const response = await annotationService.getUserAnnotations(1, 5);
        setRecentAnnotations(response.data);
      }
    } catch {
      setRecentAnnotations(DEMO_ANNOTATIONS.slice(0, 5));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  const progress = user
    ? getProgressToNextLevel(user.experience, user.level)
    : 0;
  const nextLevelXP = user ? getNextLevelXP(user.level) : 0;

  const unlockedAchievements = DEMO_ACHIEVEMENTS.filter((a) => a.unlockedAt).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-primary-500/20">
                <User className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-space-dark p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Level {user?.level}</span>
                  <span className="text-sm text-gray-400">
                    {user?.experience} / {nextLevelXP} XP
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-space-dark p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary-400">
                    {user?.score?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Points</div>
                </div>
                <div className="bg-space-dark p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {stats?.achievementCount || 0}
                  </div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent achievements */}
          {isDemoMode() && unlockedAchievements.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Recent Badges</h3>
                <Link to="/achievements" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {unlockedAchievements.map((a) => (
                  <div key={a.id} className={`p-2 rounded-lg text-center text-xs badge-${a.rarity} bg-space-dark`}>
                    <div className="font-semibold truncate">{a.name}</div>
                    <div className="text-gray-500">+{a.points} pts</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats?.annotationCount || 0}
                  </div>
                  <div className="text-sm text-gray-400">Annotations</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats?.validatedCount || 0}
                  </div>
                  <div className="text-sm text-gray-400">Validated</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats?.validatedCount > 0
                      ? Math.round(
                          (stats.validatedCount / stats.annotationCount) * 100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>
            {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
              <div className="space-y-3">
                {stats.categoryBreakdown.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="capitalize text-sm">{item.category.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{
                            width: `${(item.count / stats.annotationCount) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-12 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No annotations yet. Start exploring to build your stats!
              </p>
            )}
          </div>

          {/* Recent Annotations */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Recent Annotations</h3>
            {recentAnnotations.length > 0 ? (
              <div className="space-y-3">
                {recentAnnotations.map((ann: any) => (
                  <div
                    key={ann.id}
                    className="flex items-center justify-between p-3 bg-space-dark rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-space-purple rounded flex items-center justify-center text-primary-400 text-xs font-bold">
                        #{ann.imageId}
                      </div>
                      <div>
                        <div className="font-medium text-sm capitalize">
                          {ann.category?.replace('_', ' ')} annotation
                        </div>
                        <div className="text-xs text-gray-400">
                          Confidence: {ann.confidence}/5
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-primary-400">
                        +{ann.pointsAwarded || 10} pts
                      </div>
                      {ann.isValidated && (
                        <div className="text-xs text-green-400">Validated</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No recent annotations
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
