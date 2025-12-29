import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  tip?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Welcome to AstroQuest!',
    description:
      'Join thousands of citizen scientists in analyzing real astronomical images from NASA, ESA, and the Hubble Space Telescope. Your annotations help researchers discover new celestial phenomena!',
    tip: 'Every annotation you make contributes to actual space research.',
  },
  {
    title: 'Viewing Images',
    description:
      'Browse through our collection of authentic space images. Use your mouse wheel to zoom in and out. Click and drag to pan around the image and explore every detail.',
    tip: 'Look for interesting patterns, bright spots, and unusual structures.',
  },
  {
    title: 'Annotation Tools',
    description:
      'Use the Point tool to mark specific locations, or the Rectangle tool to highlight larger areas. Select the appropriate category for what you find - galaxies, nebulae, star clusters, and more!',
    tip: 'Be precise! The more accurate your annotations, the more valuable they are.',
  },
  {
    title: 'Categories Matter',
    description:
      'Choose the right category for your findings: Galaxies (spiral, elliptical), Nebulae (emission, reflection), Star Clusters, Supernovae, Black Holes, and Anomalies. Not sure? Take your best guess!',
    tip: 'When multiple users mark the same object, it creates a "consensus" annotation.',
  },
  {
    title: 'Earn Points & Level Up',
    description:
      'Earn points for every annotation you make. When your annotations match with others or get validated by researchers, you earn bonus points! Level up to unlock new achievements.',
    tip: 'Validated annotations give you 50 bonus points!',
  },
  {
    title: 'Daily Challenges',
    description:
      'Complete daily challenges to earn extra rewards! Challenge yourself with specific tasks like finding galaxies or creating annotations. New challenges appear every day.',
    tip: 'Build a streak by logging in daily for even more rewards!',
  },
  {
    title: 'Ready to Explore!',
    description:
      "You're all set! Start exploring the cosmos and help advance our understanding of the universe. Remember: there are no wrong answers, only discoveries waiting to be made.",
    tip: 'Have fun and happy exploring! 🚀',
  },
];

interface TutorialProps {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if user has completed tutorial
    const completed = localStorage.getItem('tutorialCompleted');
    if (completed) {
      setShow(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card max-w-2xl w-full relative"
        >
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-primary-900/30 rounded-full mb-4">
              <span className="text-primary-400 font-semibold">
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-3">{step.title}</h2>
          </div>

          <div className="mb-8">
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              {step.description}
            </p>

            {step.tip && (
              <div className="bg-primary-900/20 border border-primary-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-primary-300">{step.tip}</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-space-purple transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 btn-primary"
            >
              <span>{isLastStep ? 'Get Started' : 'Next'}</span>
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
