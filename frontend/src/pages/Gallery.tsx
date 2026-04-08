import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, ExternalLink, Calendar, Search } from 'lucide-react';
import { DEMO_APOD_GALLERY, DEMO_IMAGES, type APODItem } from '@/services/demoData';
import { isDemoMode } from '@/services/demoData';

/**
 * Gallery page — showcases NASA APOD images and the app's own
 * astronomical image collection in a Pinterest-style masonry layout.
 */

type GalleryTab = 'apod' | 'collection';

export default function Gallery() {
  const [tab, setTab] = useState<GalleryTab>('apod');
  const [selectedImage, setSelectedImage] = useState<APODItem | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [search, setSearch] = useState('');
  const [apodImages, setApodImages] = useState<APODItem[]>(DEMO_APOD_GALLERY);
  const [loading, setLoading] = useState(false);

  // Try fetching real APOD data if API key is available
  useEffect(() => {
    const apiKey = import.meta.env.VITE_NASA_API_KEY;
    if (apiKey && apiKey !== 'DEMO_KEY' && !isDemoMode()) {
      setLoading(true);
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=12`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setApodImages(data.filter((d: APODItem) => d.media_type === 'image'));
          }
        })
        .catch(() => { /* fall back to demo data */ })
        .finally(() => setLoading(false));
    }
  }, []);

  const filteredApod = apodImages.filter(
    (img) =>
      !search || img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.explanation.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredCollection = DEMO_IMAGES.filter(
    (img) =>
      !search || img.title.toLowerCase().includes(search.toLowerCase()) ||
      (img.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (img.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const openLightbox = (img: APODItem, idx: number) => {
    setSelectedImage(img);
    setSelectedIdx(idx);
  };

  const navigate = (dir: -1 | 1) => {
    const list = tab === 'apod' ? filteredApod : [];
    const next = selectedIdx + dir;
    if (next >= 0 && next < list.length) {
      setSelectedImage(list[next]);
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          <Camera className="w-10 h-10 text-primary-400" />
          Space Gallery
        </h1>
        <p className="text-gray-400 text-lg">
          Stunning astronomical images from NASA, ESA, and the world's greatest telescopes
        </p>
      </div>

      {/* Tab bar + search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex space-x-1 bg-space-blue rounded-lg p-1">
          <button
            onClick={() => setTab('apod')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'apod' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            NASA APOD
          </button>
          <button
            onClick={() => setTab('collection')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'collection' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Observatory Collection
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images..."
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      )}

      {/* APOD tab */}
      {!loading && tab === 'apod' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredApod.map((img, idx) => (
            <motion.div
              key={img.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
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

      {/* Collection tab */}
      {!loading && tab === 'collection' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCollection.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div className="card p-0 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all">
                <div className="aspect-square bg-space-darker overflow-hidden relative">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm text-gray-200 line-clamp-3">{img.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{img.title}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-primary-400 font-medium">{img.source.toUpperCase()}</span>
                    <span className="text-gray-500">{img.telescope}</span>
                  </div>
                  {img.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {img.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-space-purple rounded-full text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredApod.length === 0 && tab === 'apod' && (
        <div className="text-center py-20 text-gray-400">No images match your search.</div>
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
                  {selectedImage.copyright && <span>Credit: {selectedImage.copyright}</span>}
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">{selectedImage.explanation}</p>
                {selectedImage.hdurl && (
                  <a
                    href={selectedImage.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                  >
                    View Full Resolution <ExternalLink className="w-4 h-4" />
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
