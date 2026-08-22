import { useEffect, useState } from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import MissionCard from '@/components/MissionCard';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

/**
 * ПОЧЕМУ убраны запасные данные: раньше страница брала четыре выдуманных
 * задания и дорисовывала им прогресс через Math.random() — при каждой
 * перезагрузке «пройдено» становилось другим числом. Серия дней и дневное
 * задание тоже были константами. Считать это может только сервер.
 */
export default function Missions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [missionsRes, dailyRes, streakRes] = await Promise.all([
        api.get<any>('/missions'),
        api.get<any>('/missions/daily'),
        api.get<any>('/streak'),
      ]);
      setMissions(Array.isArray(missionsRes) ? missionsRes : []);
      setDailyChallenge(dailyRes ?? null);
      setStreak(streakRes ?? null);
    } catch {
      setMissions([]);
      setDailyChallenge(null);
      setStreak(null);
      setError('No data — missions could not be loaded from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleStreakCheck = async () => {
    try {
      const response = await api.post<any>('/streak/check', {});
      setStreak(response);
      toast.success(`Streak updated! Current streak: ${response.currentStreak} days`);
    } catch {
      console.error('Failed to check streak');
    }
  };

  const handleFreezeStreak = async () => {
    try {
      await api.post('/streak/freeze', {});
      toast.success('Streak frozen for 1 day!');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to freeze streak');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Missions & Challenges</h1>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Streak Card */}
        <div className="card bg-gradient-to-br from-orange-900/30 to-red-900/30">
          <div className="flex items-center space-x-3 mb-4">
            <Flame className="w-8 h-8 text-orange-400" />
            <div>
              <h3 className="text-xl font-bold">Daily Streak</h3>
              <p className="text-sm text-gray-400">Keep it going!</p>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-orange-400 mb-2">
              {streak ? streak.currentStreak : <span className="text-xl text-gray-500">No data</span>}
            </div>
            <div className="text-sm text-gray-400">
              days in a row
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-gray-400">Longest Streak:</span>
            <span className="font-semibold">{streak ? `${streak.longestStreak} days` : 'No data'}</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleStreakCheck}
              className="btn-primary w-full text-sm"
            >
              Check In Today
            </button>
            <button
              onClick={handleFreezeStreak}
              className="btn-secondary w-full text-sm"
              disabled={streak?.streakFrozen}
            >
              {streak?.streakFrozen ? 'Frozen' : 'Freeze Streak (Weekly)'}
            </button>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyChallenge && (
          <div className="lg:col-span-2 card bg-gradient-to-br from-primary-900/30 to-purple-900/30">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-8 h-8 text-primary-400" />
              <div>
                <h3 className="text-xl font-bold">Daily Challenge</h3>
                <p className="text-sm text-gray-400">Resets in 24 hours</p>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-2">{dailyChallenge.title}</h4>
            <p className="text-gray-400 mb-4">{dailyChallenge.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">
                    +{dailyChallenge.reward?.points || 0} pts
                  </span>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-400">Target: </span>
                <span className="font-semibold text-primary-400">
                  {dailyChallenge.target} {dailyChallenge.categoryFilter || 'annotations'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Missions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Missions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {missions.length > 0 ? (
            missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-400">{error ?? 'No active missions at the moment.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
