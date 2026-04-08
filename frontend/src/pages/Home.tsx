import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Rocket, Star, Users, Award, Sparkles, MapPin, Camera, Calendar, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DEMO_APOD_GALLERY, isDemoMode } from '@/services/demoData';

export default function Home() {
  const { isAuthenticated, enterDemoMode } = useAuthStore();

  const features = [
    {
      icon: <Rocket className="w-10 h-10" />,
      title: 'Real Space Images',
      description: 'Analyze authentic astronomical images from NASA, ESA, Hubble, and the James Webb Space Telescope.',
    },
    {
      icon: <Star className="w-10 h-10" />,
      title: 'Make Discoveries',
      description: 'Identify galaxies, nebulae, and anomalies that could lead to real scientific discoveries.',
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: 'Contribute to Science',
      description: 'Your annotations help researchers by providing crowdsourced analysis of deep space.',
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: 'Earn & Compete',
      description: 'Gain points, unlock achievement badges, climb the leaderboard and complete missions.',
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: 'Interactive Sky Map',
      description: 'Explore an interactive star chart with constellations, star colors, and coordinates.',
    },
    {
      icon: <Calendar className="w-10 h-10" />,
      title: 'Event Calendar',
      description: 'Never miss a meteor shower, eclipse, or planetary opposition with our astronomical events calendar.',
    },
  ];

  const apodPreview = DEMO_APOD_GALLERY.slice(0, 4);

  const handleDemoMode = () => {
    enterDemoMode();
    window.location.href = '/explore';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 sm:py-20"
      >
        <div className="inline-block mb-6">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-primary-400 animate-pulse-glow" />
            <div className="absolute -inset-4 bg-primary-500/10 rounded-full blur-xl" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
          Explore the Universe
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join thousands of citizen scientists analyzing real astronomical images to help
          uncover the mysteries of deep space. Every annotation you make contributes to
          actual research.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/explore" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
              Start Exploring <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
              {isDemoMode() && (
                <button
                  onClick={handleDemoMode}
                  className="px-8 py-3 text-lg border border-primary-500/30 rounded-lg text-primary-400 hover:bg-primary-900/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Try Demo
                </button>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="card hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group"
          >
            <div className="text-primary-400 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card bg-gradient-to-r from-primary-900/30 to-purple-900/30 my-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary-400 mb-1">10K+</div>
            <div className="text-gray-400 text-sm">Images Analyzed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary-400 mb-1">50K+</div>
            <div className="text-gray-400 text-sm">Annotations Made</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary-400 mb-1">1K+</div>
            <div className="text-gray-400 text-sm">Active Scientists</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary-400 mb-1">47</div>
            <div className="text-gray-400 text-sm">Discoveries</div>
          </div>
        </div>
      </motion.div>

      {/* NASA APOD Showcase */}
      <div className="my-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1 flex items-center gap-3">
              <Camera className="w-8 h-8 text-primary-400" />
              From NASA's Gallery
            </h2>
            <p className="text-gray-400">Astronomy Picture of the Day collection</p>
          </div>
          <Link to="/gallery" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-sm font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {apodPreview.map((img, idx) => (
            <motion.div
              key={img.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              <Link to="/gallery" className="group block">
                <div className="card p-0 overflow-hidden hover:shadow-2xl transition-all">
                  <div className="aspect-[4/3] bg-space-darker overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {img.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{img.date}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="my-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'View Images',
              description: 'Browse authentic astronomical images from the world\'s greatest space telescopes.',
            },
            {
              step: '2',
              title: 'Annotate Objects',
              description: 'Mark galaxies, nebulae, and other celestial objects using our interactive tools.',
            },
            {
              step: '3',
              title: 'Earn Recognition',
              description: 'Gain points, unlock badges, and help advance real scientific research.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-primary-500/20">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="card bg-gradient-to-r from-primary-900/40 via-purple-900/40 to-pink-900/40 text-center py-12 my-16"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Explore the Cosmos?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of citizen scientists and start making real contributions
            to astronomical research today. No experience needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Create Free Account
            </Link>
            <Link to="/sky-map" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" /> Explore Sky Map
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
