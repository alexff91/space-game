import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Rocket } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-space-gradient flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-primary-900/20 bg-space-darker/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid sm:grid-cols-3 gap-8 text-sm">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Rocket className="w-5 h-5 text-primary-500" />
                <span className="font-bold text-lg bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  AstroQuest
                </span>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Citizen science platform for astronomical image analysis.
                Help researchers discover the secrets of the cosmos.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Explore</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="/sky-map" className="hover:text-primary-400 transition-colors">Interactive Sky Map</a></li>
                <li><a href="/gallery" className="hover:text-primary-400 transition-colors">Space Gallery</a></li>
                <li><a href="/events" className="hover:text-primary-400 transition-colors">Astronomical Events</a></li>
                <li><a href="/leaderboard" className="hover:text-primary-400 transition-colors">Leaderboard</a></li>
              </ul>
            </div>

            {/* Data */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Data Sources</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">NASA Open APIs</a></li>
                <li><a href="https://www.esa.int/Science_Exploration/Space_Science" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">ESA Science</a></li>
                <li><a href="https://hubblesite.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">Hubble Space Telescope</a></li>
                <li><a href="https://webbtelescope.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">James Webb Space Telescope</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-900/20 mt-8 pt-6 text-center text-xs text-gray-600">
            AstroQuest {new Date().getFullYear()} | Built with React, TypeScript & NASA Open Data
          </div>
        </div>
      </footer>
    </div>
  );
}
