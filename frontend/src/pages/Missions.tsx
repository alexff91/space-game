import { useEffect, useState } from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import MissionCard from '@/components/MissionCard';
import { api } from '@/services/api';
import { isDemoMode, DEMO_MISSIONS, DEMO_DAILY_CHALLENGE, DEMO_STREAK } from '@/services/demoData';
import toast from 'react-hot-toast';

export default function Missions() {
  const [missions, setMissions] = useState<any[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);
  const [streak, setStreak] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if (isDemoMode()) {
        setMissions(DEMO_MISSIONS.map((m) => ({ ...m, progress: Math.floor(Math.random() * 80) })));
        setDailyChallenge(DEMO_DAILY_CHALLENGE);
        setStreak(DEMO_STREAK);
      } else {
        const [missionsRes, dailyRes, streakRes] = await Promise.all([
          api.get<any>('/missions'),
          api.get<any>('/missions/daily'),
          api.get<any>('/streak'),
        ]);
        setMissions(missionsRes);
        setDailyChallenge(dailyRes);
        setStreak(streakRes);
      }
    } catch {
      // Fall back to demo data
      setMissions(DEMO_MISSIONS.map((m) => ({ ...m, progress: Math.floor(Math.random() * 80) })));
      setDailyChallenge(DEMO_DAILY_CHALLENGE);
      setStreak(DEMO_STREAK);
    } finally {
      setLoading(false);
    }
  };

  const handleStreakCheck = async () => {
    try {
      if (isDemoMode()) {
        const updated = { ...DEMO_STREAK, currentStreak: (streak?.currentStreak || 0) + 1 };
        setStreak(updated);
        toast.success(`Streak updated! Current streak: ${updated.currentStreak} days`);
        return;
      }
      const response = await api.post<any>('/streak/check', {});
      setStreak(response);
      toast.success(`Streak updated! Current streak: ${response.currentStreak} days`);
    } catch {
      console.error('Failed to check streak');
    }
  };

  const handleFreezeStreak = async () => {
    try {
      if (isDemoMode()) {
        setStreak({ ...streak, streakFrozen: true });
        toast.success('Streak frozen for 1 day!');
        return;
      }
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
              {streak?.currentStreak || 0}
            </div>
            <div className="text-sm text-gray-400">
              days in a row
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-gray-400">Longest Streak:</span>
            <span className="font-semibold">{streak?.longestStreak || 0} days</span>
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
              <p className="text-gray-400">No active missions at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
