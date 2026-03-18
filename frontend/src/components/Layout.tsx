import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { WifiOff } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-space-gradient">
       <div className="bg-yellow-600/80 text-white text-center py-1 px-4 text-sm font-medium flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span>Demo Mode: Backend unavailable, using mock data</span>
      </div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
