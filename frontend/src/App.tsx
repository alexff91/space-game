import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Leaderboard from '@/pages/Leaderboard';
import ImageDetail from '@/pages/ImageDetail';
import Missions from '@/pages/Missions';
import SkyMap from '@/pages/SkyMap';
import Gallery from '@/pages/Gallery';
import Events from '@/pages/Events';
import PrivateRoute from '@/components/PrivateRoute';
import BackendRequired from '@/components/BackendRequired';
import Tutorial from '@/components/Tutorial';
import { isDemoMode } from '@/services/appMode';

function App() {
  const { fetchCurrentUser, isAuthenticated } = useAuthStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const demo = isDemoMode();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
      // Show tutorial for new users
      const tutorialCompleted = localStorage.getItem('tutorialCompleted');
      if (!tutorialCompleted) {
        setShowTutorial(true);
      }
    }
  }, [isAuthenticated, fetchCurrentUser]);

  /**
   * ПОЧЕМУ маршруты подменяются, а не просто «показывают нули»: разметка,
   * очки, значки, серии и рейтинг без сервера не существуют вовсе. Экран,
   * который их рисует, врёт целиком, и починить его частично нельзя —
   * поэтому в сборке без бэкенда его нет.
   */
  const gated = (element: React.ReactNode, feature: string) =>
    demo ? <BackendRequired feature={feature} /> : element;

  return (
    <>
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={gated(<Login />, 'Signing in')} />
          <Route path="register" element={gated(<Register />, 'Registration')} />
          <Route path="sky-map" element={<SkyMap />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="events" element={<Events />} />
          <Route path="leaderboard" element={gated(<Leaderboard />, 'The leaderboard')} />
          <Route
            path="explore"
            element={gated(
              <PrivateRoute>
                <Explore />
              </PrivateRoute>,
              'Image annotation',
            )}
          />
          <Route
            path="image/:id"
            element={gated(
              <PrivateRoute>
                <ImageDetail />
              </PrivateRoute>,
              'Image annotation',
            )}
          />
          <Route
            path="missions"
            element={gated(
              <PrivateRoute>
                <Missions />
              </PrivateRoute>,
              'Missions',
            )}
          />
          <Route
            path="profile"
            element={gated(
              <PrivateRoute>
                <Profile />
              </PrivateRoute>,
              'Your profile',
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
