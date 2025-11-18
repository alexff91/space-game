import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageService } from '@/services/imageService';
import { Image } from '@/types';
import toast from 'react-hot-toast';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function Explore() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);

  const loadRandomImage = async () => {
    setLoading(true);
    try {
      const response = await imageService.getRandomImage();
      setCurrentImage(response.data);
    } catch (error) {
      toast.error('Failed to load image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomImage();
  }, []);

  const handleStartAnnotating = () => {
    if (currentImage) {
      navigate(`/image/${currentImage.id}`);
    }
  };

  if (loading && !currentImage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-10 h-10 text-primary-400" />
          Explore the Cosmos
        </h1>
        <p className="text-gray-400 text-lg">
          Analyze astronomical images and contribute to real space research
        </p>
      </div>

      {currentImage && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="card">
            <div className="aspect-square bg-space-darker rounded-lg overflow-hidden mb-4">
              <img
                src={currentImage.imageUrl}
                alt={currentImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Source: {currentImage.source.toUpperCase()}</span>
              {currentImage.annotationCount > 0 && (
                <span>{currentImage.annotationCount} annotations</span>
              )}
            </div>
          </div>

          {/* Image Info */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">{currentImage.title}</h2>
              <p className="text-gray-300 mb-4">
                {currentImage.description || 'No description available'}
              </p>

              {currentImage.metadata && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {currentImage.telescope && (
                    <div>
                      <div className="text-sm text-gray-400">Telescope</div>
                      <div className="font-semibold">{currentImage.telescope}</div>
                    </div>
                  )}
                  {currentImage.wavelength && (
                    <div>
                      <div className="text-sm text-gray-400">Wavelength</div>
                      <div className="font-semibold">{currentImage.wavelength}</div>
                    </div>
                  )}
                  {currentImage.difficulty && (
                    <div>
                      <div className="text-sm text-gray-400">Difficulty</div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < currentImage.difficulty!
                                ? 'text-primary-400'
                                : 'text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentImage.tags && currentImage.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentImage.tags.slice(0, 5).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-space-purple rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="card bg-gradient-to-r from-primary-900/30 to-purple-900/30">
              <h3 className="text-xl font-semibold mb-3">Your Mission</h3>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Identify and mark celestial objects</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Categorize your findings (galaxies, nebulae, etc.)</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Help scientists discover new phenomena</span>
                </li>
              </ul>

              <div className="space-y-3">
                <button
                  onClick={handleStartAnnotating}
                  className="btn-primary w-full text-lg"
                >
                  Start Annotating
                </button>
                <button
                  onClick={loadRandomImage}
                  className="btn-secondary w-full"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Try Another Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
