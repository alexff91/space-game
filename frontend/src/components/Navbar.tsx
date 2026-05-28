import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  Rocket, User, Trophy, LogOut, Star, Target, MapPin, Camera,
  Calendar, Award, Menu, X, Gamepad2,
} from 'lucide-react';
import { isDemoMode } from '@/services/appMode';

interface NavLink {
  to: string;
  icon: React.ReactNode;
  label: string;
  authRequired?: boolean;
  publicOnly?: boolean;
  /** Ссылка ведёт на экран, который без сервера показывать нечем. */
  backendRequired?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { to: '/explore', icon: <Star className="w-5 h-5" />, label: 'Explore', authRequired: true, backendRequired: true },
  { to: '/missions', icon: <Target className="w-5 h-5" />, label: 'Missions', authRequired: true, backendRequired: true },
  { to: '/sky-map', icon: <MapPin className="w-5 h-5" />, label: 'Sky Map' },
  { to: '/arcade', icon: <Gamepad2 className="w-5 h-5" />, label: 'Arcade' },
  { to: '/gallery', icon: <Camera className="w-5 h-5" />, label: 'Gallery' },
  { to: '/events', icon: <Calendar className="w-5 h-5" />, label: 'Events' },
  { to: '/leaderboard', icon: <Trophy className="w-5 h-5" />, label: 'Leaderboard', backendRequired: true },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const demoMode = isDemoMode();

  const visibleLinks = NAV_LINKS.filter((link) => {
    // Без сервера этих экранов нет — не зовём туда, куда идти незачем.
    if (link.backendRequired && demoMode) return false;
    if (link.authRequired && !isAuthenticated) return false;
    if (link.publicOnly && isAuthenticated) return false;
    return true;
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    // Прилипанием к верху занимается Layout — он держит вместе плашку и навигацию,
    // чтобы плашка не перекрывала меню и не уезжала из виду.
    <nav className="bg-space-blue/95 backdrop-blur-md border-b border-primary-900/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0 py-2">
            <Rocket className="w-8 h-8 text-primary-500 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              AstroQuest
            </span>
            {demoMode && (
              <span className="hidden sm:inline px-1.5 py-0.5 bg-yellow-900/30 text-yellow-400 text-[10px] font-bold rounded uppercase">
                Demo
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary-900/30 text-primary-400'
                    : 'text-gray-300 hover:text-primary-400 hover:bg-space-purple'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth actions (desktop).
              В демо-режиме входа нет вовсе: раньше форма принимала любой пароль
              и выдавала выдуманного пользователя с 4250 очками. */}
          <div className="hidden lg:flex items-center space-x-3">
            {demoMode ? null : isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/profile')
                      ? 'bg-primary-900/30 text-primary-400'
                      : 'text-gray-300 hover:text-primary-400'
                  }`}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user?.username}</span>
                  <span className="px-1.5 py-0.5 bg-primary-600 rounded-full text-[10px] font-bold">
                    Lv{user?.level}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-primary-400 transition-colors text-sm px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-primary-900/20 mt-2 pt-4 space-y-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary-900/30 text-primary-400'
                    : 'text-gray-300 hover:bg-space-purple'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {!demoMode && <div className="border-t border-gray-700 my-2" />}

            {demoMode ? null : isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-space-purple"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.username} (Lv{user?.level})</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-space-purple w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-space-purple"
                >
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-600 text-white"
                >
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
