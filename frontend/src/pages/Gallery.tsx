import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, ExternalLink, Calendar, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchApod, getNasaApiKey, type APODItem } from '@/services/apodService';

/**
 * Галерея NASA Astronomy Picture of the Day.
 *
 * ПОЧЕМУ переписана: страница обещала снимки NASA, а показывала 8 зашитых
 * ссылок с придуманными именами файлов — все восемь отдавали 404, то есть
 * посетитель видел набор битых картинок под заголовком «From NASA's Gallery».
 * Вторая вкладка, «Observatory Collection», состояла из тех же битых ссылок
 * плюс выдуманные счётчики разметки (24, 42, 56...) и удалена целиком.
 * Теперь запрос уходит в api.nasa.gov, а при неудаче страница говорит,
 * что данных нет, и предлагает повторить.
 */
export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<APODItem | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [search, setSearch] = useState('');
  const [apodImages, setApodImages] = useState<APODItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const images = await fetchApod(12);
      setApodImages(images);
    } catch (e: any) {
      // Никакого запасного набора картинок: если NASA не ответило,
      // показывать нечего, и об этом надо сказать прямо.
      setApodImages([]);
      setError(e?.message || 'Could not reach api.nasa.gov');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredApod = apodImages.filter(
    (img) =>
      !search || img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.explanation.toLowerCase().includes(search.toLowerCase()),
  );

  const openLightbox = (img: APODItem, idx: number) => {
    setSelectedImage(img);
    setSelectedIdx(idx);
  };

  const navigate = (dir: -1 | 1) => {
    const next = selectedIdx + dir;
    if (next >= 0 && next < filteredApod.length) {
      setSelectedImage(filteredApod[next]);
      setSelectedIdx(next);
    }
  };

  // Keyboard navigation in lightbox
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const usingSharedKey = getNasaApiKey() === 'DEMO_KEY';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          <Camera className="w-10 h-10 text-primary-400" />
          NASA Picture of the Day
        </h1>
        <p className="text-gray-400 text-lg">
          Fetched live from NASA&apos;s public APOD API each time this page loads
        </p>
        <a
          href="https://api.nasa.gov/#apod"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-400 mt-2"
        >
          api.nasa.gov/planetary/apod <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the loaded images..."
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="spinner" />
          <p className="text-gray-500 text-sm">Asking api.nasa.gov...</p>
        </div>
      )}

      {/* Ошибка: честное «нет данных» вместо подставленных картинок */}
      {!loading && error && (
        <div className="card max-w-xl mx-auto text-center py-12">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No data</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-2">
            NASA&apos;s APOD API did not return anything, so there are no images to show.
          </p>
          <p className="text-gray-500 text-xs mb-6">{error}</p>
          {usingSharedKey && (
            <p className="text-gray-500 text-xs mb-6 leading-relaxed">
              This build uses NASA&apos;s shared <code>DEMO_KEY</code>, which is limited to
              roughly 30 requests an hour per address — that is the usual reason for this.
              Set <code>VITE_NASA_API_KEY</code> to your own free key to avoid it.
            </p>
          )}
          <button onClick={load} className="btn-primary inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredApod.map((img, idx) => (
            <motion.div
              key={`${img.date}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx, 8) * 0.05 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(img, idx)}
            >
              <div className="card p-0 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all">
                <div className="aspect-[4/3] bg-space-darker overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary-400 transition-colors">
                    {img.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{img.date}</span>
                    {img.copyright && <span>| {img.copyright}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty search */}
      {!loading && !error && filteredApod.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          {apodImages.length === 0
            ? 'No data — NASA returned no images for this request.'
            : 'No images match your search.'}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-space-blue rounded-xl p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedImage.hdurl || selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full max-h-[60vh] object-contain bg-black rounded-t-xl"
                />

                {/* Nav buttons */}
                {selectedIdx > 0 && (
                  <button onClick={() => navigate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                {selectedIdx < filteredApod.length - 1 && (
                  <button onClick={() => navigate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedImage.date}</span>
                  <span>Credit: {selectedImage.copyright || 'NASA (public domain)'}</span>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">{selectedImage.explanation}</p>
                <a
                  href={`https://apod.nasa.gov/apod/ap${selectedImage.date.slice(2).replace(/-/g, '')}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 mr-6"
                >
                  Original APOD page <ExternalLink className="w-4 h-4" />
                </a>
                {selectedImage.hdurl && (
                  <a
                    href={selectedImage.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                  >
                    Full resolution <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
