import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LightboxProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  date: string;
  description?: string;
  type?: 'photo' | 'video';
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function Lightbox({
  isOpen,
  imageUrl,
  title,
  date,
  description,
  type = 'photo',
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const touchStartX = useRef(0);

  /** Keyboard navigation: Arrows, Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev?.();
          break;
        case 'ArrowRight':
          onNext?.();
          break;
      }
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].screenX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        onPrev?.();   // swipe right → previous
      } else {
        onNext?.();   // swipe left  → next
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 max-w-4xl w-full mx-auto px-4 max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media Container */}
            <div className="relative w-full flex-1 mb-4 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {type === 'video' ? (
                <video
                  src={imageUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              ) : (
                <ImageWithFallback
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              )}
            </div>

            {/* Info */}
            <motion.div
              className="text-white text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">
                {date}
              </p>
              {title && (
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-base text-white/70 mb-4 max-w-xl mx-auto">
                  {description}
                </p>
              )}
            </motion.div>

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Previous Button */}
            {onPrev && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous memory"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.button>
            )}

            {/* Next Button */}
            {onNext && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next memory"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.button>
            )}

            {/* Swipe / Keyboard Hint */}
            <motion.div
              className="text-center text-white/50 text-xs mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="hidden md:inline">← → Navigate · Esc to close</span>
              <span className="md:hidden">Swipe to navigate · Tap backdrop to close</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
