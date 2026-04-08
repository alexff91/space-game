import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imageService } from '@/services/imageService';
import { annotationService } from '@/services/annotationService';
import { Image, Annotation, AnnotationCoordinates } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { isDemoMode, DEMO_IMAGES, DEMO_ANNOTATIONS } from '@/services/demoData';
import ImageViewer from '@/components/ImageViewer';
import EducationalPanel from '@/components/EducationalPanel';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Info, BookOpen } from 'lucide-react';

export default function ImageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [image, setImage] = useState<Image | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [myAnnotations, setMyAnnotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confidence, setConfidence] = useState(3);
  const [description, setDescription] = useState('');
  const [showEducation, setShowEducation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('galaxy');

  useEffect(() => {
    if (id) {
      loadImage();
      loadAnnotations();
    }
  }, [id]);

  const loadImage = async () => {
    setLoading(true);
    try {
      if (isDemoMode()) {
        const img = DEMO_IMAGES.find((i) => i.id === Number(id)) || DEMO_IMAGES[0];
        setImage(img);
        setSelectedCategory(img.category || 'galaxy');
      } else {
        const response = await imageService.getImage(Number(id));
        setImage(response.data);
      }
    } catch {
      const img = DEMO_IMAGES.find((i) => i.id === Number(id)) || DEMO_IMAGES[0];
      setImage(img);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnotations = async () => {
    try {
      if (isDemoMode()) {
        const anns = DEMO_ANNOTATIONS.filter((a) => a.imageId === Number(id));
        setAnnotations(anns);
      } else {
        const response = await annotationService.getImageAnnotations(Number(id));
        setAnnotations(response.data);
      }
    } catch {
      setAnnotations(DEMO_ANNOTATIONS.filter((a) => a.imageId === Number(id)));
    }
  };

  const handleAnnotate = (annotation: {
    type: string;
    coordinates: AnnotationCoordinates;
    category: string;
  }) => {
    setMyAnnotations([...myAnnotations, annotation]);
    setSelectedCategory(annotation.category);
    toast.success('Annotation added! Click Save when done.');
  };

  const handleSave = async () => {
    if (myAnnotations.length === 0) {
      toast.error('Please add at least one annotation');
      return;
    }

    setSaving(true);
    try {
      if (!isDemoMode()) {
        for (const ann of myAnnotations) {
          await annotationService.createAnnotation({
            imageId: Number(id),
            type: ann.type as any,
            coordinates: ann.coordinates,
            category: ann.category,
            confidence,
            description: description || undefined,
          });
        }
      }

      const points = myAnnotations.length * (confidence >= 4 ? 20 : 10);
      toast.success(`Saved ${myAnnotations.length} annotations! +${points} points`);
      setMyAnnotations([]);
      setDescription('');
      loadAnnotations();

      setTimeout(() => {
        navigate('/explore');
      }, 2000);
    } catch {
      toast.error('Failed to save annotations');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!image) {
    return null;
  }

  const allAnnotations = [
    ...annotations,
    ...myAnnotations.map((ann, i) => ({
      ...ann,
      id: `temp-${i}`,
      userId: user?.id || 0,
      imageId: image.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/explore')}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Explore</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Image Viewer */}
        <div className="lg:col-span-2">
          <ImageViewer
            image={image}
            annotations={allAnnotations as Annotation[]}
            onAnnotate={handleAnnotate}
          />
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Image Info */}
          <div className="card">
            <div className="flex items-start space-x-2 mb-3">
              <Info className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">{image.title}</h3>
                <p className="text-sm text-gray-400">
                  {image.description?.slice(0, 150)}
                  {image.description && image.description.length > 150 && '...'}
                </p>
              </div>
            </div>
            {image.telescope && (
              <div className="text-xs text-gray-500 mt-2">
                <span className="text-gray-400">Telescope:</span> {image.telescope}
              </div>
            )}
          </div>

          {/* Annotation Form */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Annotation Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confidence (1-5)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfidence(level)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all text-sm ${
                        confidence >= level
                          ? 'border-primary-500 bg-primary-900/30 text-primary-400'
                          : 'border-gray-600 text-gray-500'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Add any observations or notes..."
                />
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-3">
                  Current annotations: {myAnnotations.length}
                </div>
                <button
                  onClick={handleSave}
                  disabled={myAnnotations.length === 0 || saving}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : 'Save & Continue'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Educational toggle */}
          <button
            onClick={() => setShowEducation(!showEducation)}
            className="card w-full text-left flex items-center gap-2 hover:bg-space-purple transition-colors"
          >
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium">
              {showEducation ? 'Hide' : 'Show'} Learning Panel
            </span>
          </button>

          {showEducation && <EducationalPanel category={selectedCategory} />}

          {/* Stats */}
          <div className="card bg-gradient-to-r from-primary-900/30 to-purple-900/30">
            <h4 className="font-semibold mb-3">Community Progress</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Annotations:</span>
                <span className="font-semibold">{image.annotationCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Annotations:</span>
                <span className="font-semibold text-primary-400">
                  {myAnnotations.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
