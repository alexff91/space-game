import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Rocket, Star, Users, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <Rocket className="w-12 h-12" />,
      title: 'Real Space Images',
      description:
        'Analyze authentic astronomical images from NASA, ESA, and Hubble Space Telescope',
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: 'Make Discoveries',
      description:
        'Identify galaxies, nebulae, and anomalies that could lead to real scientific discoveries',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Contribute to Science',
      description:
        'Your annotations help researchers by providing crowdsourced analysis of deep space',
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Earn Rewards',
      description:
        'Gain points, unlock achievements, and climb the leaderboard as you progress',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="inline-block mb-6">
          <Sparkles className="w-16 h-16 text-primary-400 animate-pulse-glow" />
        </div>
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Explore the Universe
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Join thousands of citizen scientists analyzing real astronomical images to help
          uncover the mysteries of deep space. Every annotation you make contributes to
          actual research.
        </p>
        <div className="flex gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/explore" className="btn-primary text-lg px-8 py-3">
              Start Exploring
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 my-20">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="text-primary-400 mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card bg-gradient-to-r from-primary-900/30 to-purple-900/30 my-20"
      >
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-400 mb-2">10,000+</div>
            <div className="text-gray-400">Images Analyzed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-400 mb-2">50,000+</div>
            <div className="text-gray-400">Annotations Made</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-400 mb-2">1,000+</div>
            <div className="text-gray-400">Active Scientists</div>
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <div className="my-20">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'View Images',
              description: 'Browse authentic astronomical images from space telescopes',
            },
            {
              step: '2',
              title: 'Annotate Objects',
              description: 'Mark galaxies, nebulae, and other celestial objects',
            },
            {
              step: '3',
              title: 'Earn Recognition',
              description: 'Gain points and help advance real scientific research',
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
