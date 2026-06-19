import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SectionBackground } from './SectionBackground';
import { FeaturedMemoryFrame } from './FeaturedMemoryFrame';
import { featuredMemory } from '../data/galleryData';

export function FeaturedMemory() {
  // Determine if the featured memory is a video
  const isVideo = featuredMemory.imageUrl.match(/\.(mp4|webm|mov)$/i);

  return (
    <SectionBackground type="featured">
      <div id="featured" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <FeaturedMemoryFrame>
            <motion.div
              className="featured-memory-content group relative w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl transition-shadow duration-500 hover:shadow-2xl"
              whileHover={{ scale: 1.0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Media Container with Hover Zoom */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                {isVideo ? (
                  <video
                    src={featuredMemory.imageUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <ImageWithFallback
                    src={featuredMemory.imageUrl}
                    alt="Featured Memory"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                )}
              </div>

              {/* Cinematic Gradient Overlay - Darker and more dramatic */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/50" />

              {/* Glassmorphism overlay for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Text Content - Bottom Left with Generous Padding */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="max-w-4xl"
                >
                  {/* Date - Small Uppercase */}
                  <p className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.15em] mb-2 sm:mb-3 md:mb-4 opacity-90 text-rose-100">
                    {featuredMemory.date}
                  </p>
                  
                  {/* Title - Large Serif */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 sm:mb-4 md:mb-5 line-clamp-2 leading-tight text-white drop-shadow-lg">
                    {featuredMemory.title}
                  </h2>
                  
                  {/* Description - Soft White */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-3xl line-clamp-3 leading-relaxed text-gray-100">
                    {featuredMemory.description}
                  </p>
                </motion.div>
              </div>

              {/* Subtle edge vignette for depth */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none" />
            </motion.div>
          </FeaturedMemoryFrame>
        </motion.div>
      </div>
    </SectionBackground>
  );
}
