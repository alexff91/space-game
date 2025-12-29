import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Telescope, User, Trophy, LogOut, Star, Target } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-space-blue border-b border-primary-900/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Telescope className="w-8 h-8 text-primary-500 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              AstroQuest
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/explore"
                  className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span>Explore</span>
                </Link>
                <Link
                  to="/missions"
                  className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span>Missions</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center space-x-1 text-gray-300 hover:text-primary-400 transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Leaderboard</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.username}</span>
                  <span className="px-2 py-1 bg-primary-600 rounded-full text-xs">
                    Lv {user?.level}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
