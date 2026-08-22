import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import DemoBanner from './DemoBanner';
import { Rocket } from 'lucide-react';
import { isDemoMode } from '@/services/appMode';

export default function Layout() {
  const demo = isDemoMode();

  return (
    <div className="min-h-screen bg-space-gradient flex flex-col">
      {/* Плашка идёт до навигации и без условий — она должна быть видна всегда,
          на каждой странице. Скрывать её умеет только сам компонент, и только
          когда бэкенд действительно настроен. Прилипают плашка и меню вместе,
          иначе одно перекрывает другое при прокрутке. */}
      <div className="sticky top-0 z-50">
        <DemoBanner />
        <Navbar />
      </div>
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
                {demo
                  ? 'A browser front end for looking at public astronomical data. No backend, no accounts, no data collected.'
                  : 'An image-annotation platform for astronomical images. Annotations are stored in this platform\'s own database.'}
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Explore</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="/sky-map" className="hover:text-primary-400 transition-colors">Interactive Sky Map</a></li>
                <li><a href="/gallery" className="hover:text-primary-400 transition-colors">Space Gallery</a></li>
                <li><a href="/events" className="hover:text-primary-400 transition-colors">Astronomical Events</a></li>
              </ul>
            </div>

            {/* Data */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3">Where the data comes from</h4>
              <ul className="space-y-2 text-gray-500">
                <li><a href="https://api.nasa.gov/#apod" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">NASA APOD API — gallery images</a></li>
                <li><a href="https://eclipse.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">NASA GSFC eclipse tables — eclipse dates</a></li>
                <li><a href="https://in-the-sky.org/newscal.php" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">in-the-sky.org — other event dates</a></li>
                <li><a href="https://simbad.cds.unistra.fr/simbad/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">SIMBAD — star positions and magnitudes</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-900/20 mt-8 pt-6 text-center text-xs text-gray-600">
            AstroQuest {new Date().getFullYear()} | Built with React and TypeScript. Not affiliated with NASA or ESA.
          </div>
        </div>
      </footer>
    </div>
  );
}
