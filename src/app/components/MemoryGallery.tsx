import { useState } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-responsive-masonry';
import { GalleryCard } from './GalleryCard';
import { SectionBackground } from './SectionBackground';
import { Lightbox } from './Lightbox';
import { groupMemoriesByMonth, memories, type MemoryItem } from '../data/galleryData';

export function MemoryGallery() {
  const monthGroups = groupMemoriesByMonth();

  // Lightbox state — driven by index into the flat `memories` array
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (memoryId: string) => {
    const idx = memories.findIndex((m) => m.id === memoryId);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null && lightboxIndex < memories.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const activeMem: MemoryItem | null =
    lightboxIndex !== null ? memories[lightboxIndex] : null;

  return (
    <SectionBackground type="gallery">
      <div
        id="gallery"
        className="bg-transparent py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div
            className="text-center mb-12 sm:mb-14 md:mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">
              Our Beautiful Journey
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Every moment with you is a treasured memory
            </p>
          </motion.div>

          {/* Timeline Groups */}
          {monthGroups.map((group) => (
            <div key={group.key} className="mb-10 sm:mb-14">
              {/* Month Separator */}
              <motion.div
                className="flex items-center gap-4 mb-6 sm:mb-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-pink-300/60 via-rose-300/40 to-transparent" />
                <span className="text-sm sm:text-base md:text-lg font-serif font-semibold text-gray-700 whitespace-nowrap tracking-wide">
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-pink-300/60 via-rose-300/40 to-transparent" />
              </motion.div>

              {/* Masonry for this month */}
              <Masonry
                columnsCountBreakPoints={{
                  0: 2,       // 0-639px: 2 columns
                  640: 2,     // 640-767px: 2 columns
                  768: 3,     // 768-1023px: 3 columns
                  1024: 4,    // 1024-1279px: 4 columns
                  1280: 5,    // 1280px+: 5 columns
                }}
                gutter="12px"
              >
                {group.memories.map((memory) => (
                  <GalleryCard
                    key={memory.id}
                    id={memory.id}
                    imageUrl={memory.url}
                    title={memory.title || memory.displayDate}
                    date={memory.displayDate}
                    description={memory.description}
                    type={memory.type}
                    sizeVariant={memory.sizeVariant}
                    onOpenLightbox={() => openLightbox(memory.id)}
                  />
                ))}
              </Masonry>
            </div>
          ))}

          {/* Elegant Ending Message */}
          <motion.div
            className="text-center mt-16 sm:mt-20 md:mt-24 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-lg sm:text-xl md:text-2xl font-serif text-gray-700 tracking-wide">
              ❤️ Every Picture Here Is A Moment I Never Want To Forget ❤️
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Global Lightbox with prev/next navigation */}
      {activeMem && (
        <Lightbox
          isOpen={lightboxIndex !== null}
          imageUrl={activeMem.url}
          title={activeMem.title || activeMem.displayDate}
          date={activeMem.displayDate}
          description={activeMem.description}
          type={activeMem.type}
          onClose={closeLightbox}
          onPrev={lightboxIndex! > 0 ? goPrev : undefined}
          onNext={lightboxIndex! < memories.length - 1 ? goNext : undefined}
        />
      )}
    </SectionBackground>
  );
}
