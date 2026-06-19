import { motion } from 'framer-motion';
import { FloatingHearts } from './FloatingHearts';
import { SectionBackground } from './SectionBackground';

export function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SectionBackground type="hero">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
        <FloatingHearts />

        {/* Magical glow behind text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div
            className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245, 230, 200, 0.3) 0%, rgba(248, 215, 218, 0.15) 50%, transparent 100%)',
              animation: 'pulse 6s ease-in-out infinite',
            }}
          />
        </motion.div>

        <motion.div
          className="text-center z-10 relative max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Text glow background */}
          <motion.div
            className="absolute inset-0 blur-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 40% at 50% 50%, rgba(248, 215, 218, 0.2) 0%, transparent 80%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold mb-4 sm:mb-6 relative z-10"
            style={{
              color: '#1F2937',
              textShadow: '0 4px 20px rgba(248, 215, 218, 0.3)',
              lineHeight: 1.2,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Happy Birthday,
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <span style={{ color: '#DB2777' }}>My Love</span> ❤️
            </motion.div>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg md:text-2xl text-gray-700 mb-6 sm:mb-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            I am not from IT, but i have tried something for you
          </motion.p>

          <motion.button
            onClick={() => scrollToSection('featured')}
            className="relative px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-semibold rounded-full transition-all z-10"
            style={{
              background:
                'linear-gradient(135deg, rgba(248, 215, 218, 0.3) 0%, rgba(245, 230, 200, 0.2) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#4B5563',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{ scale: 1.08, background: 'rgba(248, 215, 218, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            Start the Celebration ✨
          </motion.button>
        </motion.div>
      </div>
    </SectionBackground>
  );
}
