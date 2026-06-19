import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { CardSizeVariant, sizeVariantMap } from './GalleryCard.types';

/**
 * Validates a sizeVariant value and provides fallback behavior
 * 
 * @param variant - The sizeVariant value to validate (may be undefined)
 * @returns A valid CardSizeVariant value, defaulting to 'square' if invalid or missing
 * 
 * @remarks
 * - Logs a console warning when an invalid variant is provided
 * - Returns 'square' as the default for missing or invalid values
 * - Type guard ensures only valid CardSizeVariant values are returned
 */
const validateSizeVariant = (variant: string | undefined): CardSizeVariant => {
  const validVariants: CardSizeVariant[] = [
    'small-portrait',
    'large-portrait',
    'square',
    'landscape',
    'video'
  ];
  
  if (!variant) {
    return 'square'; // Default
  }
  
  if (!validVariants.includes(variant as CardSizeVariant)) {
    console.warn(
      `Invalid sizeVariant "${variant}". Falling back to "square". ` +
      `Valid values: ${validVariants.join(', ')}`
    );
    return 'square';
  }
  
  return variant as CardSizeVariant;
};

interface GalleryCardProps {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  description?: string;
  type?: 'photo' | 'video';
  /**
   * Legacy prop for specifying aspect ratio using Tailwind CSS classes.
   * @deprecated Use sizeVariant instead for predefined card sizes
   * @example aspectRatio="aspect-square" or aspectRatio="aspect-[16/9]"
   */
  aspectRatio?: string;
  /**
   * Predefined card size variant that determines the aspect ratio and visual presentation.
   * Takes precedence over aspectRatio prop when both are provided.
   * @default 'square'
   * @example sizeVariant="small-portrait" or sizeVariant="landscape"
   */
  sizeVariant?: CardSizeVariant;
  /**
   * Callback to open lightbox from the parent (MemoryGallery manages navigation).
   * If not provided, falls back to internal lightbox behavior.
   */
  onOpenLightbox?: () => void;
}

export function GalleryCard({
  id,
  imageUrl,
  title,
  date,
  description,
  type = 'photo',
  aspectRatio = 'aspect-square',
  sizeVariant,
  onOpenLightbox,
}: GalleryCardProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  // Validate and apply sizeVariant with fallback logic
  // sizeVariant takes precedence over aspectRatio when both are provided
  const validatedSizeVariant = validateSizeVariant(sizeVariant);
  const aspectRatioClass = sizeVariant 
    ? sizeVariantMap[validatedSizeVariant] 
    : aspectRatio;

  /**
   * Task 3.1: Manage tap tracking and timeouts
   * Clean up timeout on component unmount
   */
  useEffect(() => {
    return () => {
      if (tapTimeout) {
        clearTimeout(tapTimeout);
      }
    };
  }, [tapTimeout]);

  /**
   * Task 9.2: Debounced device detection on window resize
   * Updates isMobile state only when crossing 768px threshold
   */
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newIsMobile = window.innerWidth < 768;
        setIsMobile(newIsMobile);
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const triggerLightbox = () => {
    if (onOpenLightbox) {
      onOpenLightbox();
    }
  };

  /**
   * Task 3.2: Mobile tap detection with debouncing (300ms threshold)
   * First tap: Show overlay and start 3-second auto-hide timeout
   * Second tap: Open lightbox and clear timeout
   */
  const handleCardInteraction = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;

    // Debounce rapid taps (300ms threshold)
    if (timeSinceLastTap < 300) {
      return;
    }

    setLastTapTime(now);

    if (isMobile) {
      // Mobile: Two-tap system
      if (!isOverlayVisible) {
        // First tap: Show overlay
        setIsOverlayVisible(true);

        // Task 3.3: Auto-hide overlay after 3 seconds
        if (tapTimeout) {
          clearTimeout(tapTimeout);
        }
        const timeout = setTimeout(() => {
          setIsOverlayVisible(false);
          setTapTimeout(null);
        }, 3000);
        setTapTimeout(timeout);
      } else {
        // Second tap: Open lightbox
        triggerLightbox();
        if (tapTimeout) {
          clearTimeout(tapTimeout);
          setTapTimeout(null);
        }
      }
    } else {
      // Desktop: Direct lightbox open on click
      triggerLightbox();
    }
  };

  /**
   * Task 3.4: Swipe-away detection for mobile
   * Track vertical movement and hide overlay if > 10px
   */
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || !isMobile) return;

    const touchEndPos = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const verticalMovement = Math.abs(touchEndPos.y - touchStartPos.current.y);
    const horizontalMovement = Math.abs(touchEndPos.x - touchStartPos.current.x);

    // If vertical movement > 10px, treat as swipe (not tap)
    if (verticalMovement > 10 && verticalMovement > horizontalMovement) {
      // Swipe detected: Start 2-second timeout to hide overlay
      if (tapTimeout) {
        clearTimeout(tapTimeout);
      }
      const swipeTimeout = setTimeout(() => {
        setIsOverlayVisible(false);
        setTapTimeout(null);
      }, 2000);
      setTapTimeout(swipeTimeout);
    }

    touchStartPos.current = null;
  };

  /**
   * Task 5.2: Keyboard navigation support
   * Enter or Space key opens lightbox
   * Focus shows overlay
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerLightbox();
    }
  };

  /**
   * Task 5.2: Show overlay on keyboard focus
   */
  const handleFocus = () => {
    if (!isMobile) {
      setIsOverlayVisible(true);
    }
  };

  const handleBlur = () => {
    if (!isMobile) {
      setIsOverlayVisible(false);
    }
  };

  return (
    <motion.div
      // Task 5.1: Accessibility attributes
      role="button"
      tabIndex={0}
      aria-label={`View ${type}: ${title} from ${date}`}
      className={`relative w-full ${aspectRatioClass} rounded-2xl overflow-hidden cursor-pointer group outline-offset-2 focus:outline-2 focus:outline-pink-300`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '50px' }}
      onClick={handleCardInteraction}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseLeave={() => !isMobile && setIsOverlayVisible(false)}
      onMouseEnter={() => !isMobile && setIsOverlayVisible(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image or Video Thumbnail */}
      {type === 'video' ? (
        <video
          src={imageUrl}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
          loading="lazy"
        />
      )}

      {/* Play Icon for Videos */}
      {type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
          <motion.div
            className="text-white text-5xl"
            whileHover={{ scale: 1.2 }}
          >
            ▶️
          </motion.div>
        </div>
      )}

      {/* Overlay - Desktop Hover or Mobile Tap */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOverlayVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        pointerEvents="none"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: isOverlayVisible ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white/80 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            {date}
          </p>
          {title && title !== date && (
            <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold line-clamp-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-white/70 text-xs sm:text-sm mt-1 line-clamp-2">
              {description}
            </p>
          )}

          {/* Mobile Tap Indicator */}
          {isMobile && isOverlayVisible && (
            <motion.p
              className="text-white/60 text-xs mt-2 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block animate-pulse">👆</span>
              Tap to view
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Glow Effect on Hover/Tap */}
      {isOverlayVisible && (
        <motion.div
          className="absolute inset-0 rounded-2xl shadow-2xl pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(248, 215, 218, 0.4)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
