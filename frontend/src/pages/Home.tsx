import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Star, Sparkles, MapPin, Camera, Calendar, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { isDemoMode } from '@/services/appMode';

/**
 * ПОЧЕМУ страница переписана: она обещала «тысячи учёных-любителей»,
 * «каждая ваша разметка идёт в настоящие исследования» и показывала
 * четыре придуманных счётчика (10K+, 50K+, 1K+, 47 открытий). Ни одно
 * из этих чисел никто не считал, а разметка без бэкенда исчезает при
 * перезагрузке вкладки. Теперь страница обещает ровно то, что делает.
 */
export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const demo = isDemoMode();

  // Разделы, которые действительно работают без сервера: у них есть
  // проверяемый источник данных и они ничего не хранят.
  const workingFeatures = [
    {
      icon: <Camera className="w-10 h-10" />,
      title: 'NASA Picture of the Day',
      description:
        'Images pulled live from NASA\'s public APOD API when you open the gallery. If NASA is unreachable, the page says so instead of showing something else.',
      to: '/gallery',
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: 'Interactive Sky Map',
      description:
        'Seven constellations drawn from J2000 catalogue positions and visual magnitudes. Pan, zoom and click a star for its data.',
      to: '/sky-map',
    },
    {
      icon: <Calendar className="w-10 h-10" />,
      title: 'Event Calendar',
      description:
        'Eclipses, meteor showers, oppositions and solstices for 2026. Every date carries a link to the source it was checked against.',
      to: '/events',
    },
  ];

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
          {demo
            ? 'Look at public astronomical data in your browser: NASA\'s picture of the day, a star chart built from catalogue positions, and a calendar of what happens in the sky this year. Nothing here is stored and nothing is sent anywhere.'
            : 'Analyse astronomical images and record what you find. Your annotations are stored in this platform\'s own database, where they can be reviewed and compared with other people\'s.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {demo ? (
            <>
              <Link to="/gallery" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
                Open the Gallery <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/sky-map" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" /> Explore the Sky Map
              </Link>
            </>
          ) : isAuthenticated ? (
            <Link to="/explore" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
              Start Exploring <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
                Create an Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Sign In
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Что здесь на самом деле работает */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 my-16">
        {workingFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link
              to={feature.to}
              className="card block h-full hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group"
            >
              <div className="text-primary-400 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Статистика сообщества.
          ПОЧЕМУ пустой блок вместо цифр: считать некому и нечего.
          Написать «нет данных» честно, написать «10K+» — нет. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card my-16"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary-400" />
          Community statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {['Images analysed', 'Annotations made', 'Active contributors', 'Discoveries'].map((label) => (
            <div key={label}>
              <div className="text-xl sm:text-2xl font-bold text-gray-500 mb-1">No data</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
          {demo
            ? 'This build has no backend, so there is nothing counting images, annotations or people. This section used to show four large round numbers here. None of them were ever measured.'
            : 'Community counters are not implemented yet. Until they are measured, this section stays empty.'}
        </p>
      </motion.div>

      {/* Что дальше */}
      <div className="my-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          {demo ? 'What you can do here' : 'How It Works'}
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-sm">
          {demo
            ? 'Three things, all of them read-only. Nothing asks for an account, because there is nowhere to keep one.'
            : 'Three steps, from opening an image to recording what you saw.'}
        </p>
        <div className="grid sm:grid-cols-3 gap-8">
          {(demo
            ? [
                { step: '1', title: 'Browse NASA images', description: 'The gallery calls NASA\'s APOD API when it loads and shows whatever NASA returns, with the original explanation text.' },
                { step: '2', title: 'Find your way around the sky', description: 'The sky map plots real star positions, so what you see on screen matches what is above you.' },
                { step: '3', title: 'Plan a night out', description: 'The calendar tells you when the next eclipse or meteor shower peaks, and where to check that date yourself.' },
              ]
            : [
                { step: '1', title: 'View Images', description: 'Browse the astronomical images loaded into this instance.' },
                { step: '2', title: 'Annotate Objects', description: 'Mark galaxies, nebulae and other objects using the drawing tools.' },
                { step: '3', title: 'Compare and review', description: 'Your annotations are saved to this platform\'s database and can be compared with other people\'s.' },
              ]
          ).map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
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

      {/* Честная сноска вместо призыва «внести вклад в науку» */}
      {demo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="card text-center py-10 my-16"
        >
          <Search className="w-10 h-10 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Want to do real citizen science?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto text-sm leading-relaxed">
            This site does not send anything to any researcher, so it cannot offer you that.
            Projects that genuinely do route volunteer classifications into published research
            exist, and they are not this one.
          </p>
          <a
            href="https://www.zooniverse.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Zooniverse <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </div>
  );
}
