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
import PrivateRoute from '@/components/PrivateRoute';
import Tutorial from '@/components/Tutorial';

function App() {
  const { fetchCurrentUser, isAuthenticated } = useAuthStore();
  const [showTutorial, setShowTutorial] = useState(false);

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

  return (
    <>
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="explore"
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            }
          />
          <Route
            path="image/:id"
            element={
              <PrivateRoute>
                <ImageDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="missions"
            element={
              <PrivateRoute>
                <Missions />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
