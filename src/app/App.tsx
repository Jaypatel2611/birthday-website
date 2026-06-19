import { useEffect } from 'react';
import Lenis from 'lenis';
import { HeroSection } from './components/HeroSection';
import { FeaturedMemory } from './components/FeaturedMemory';
import { MemoryGallery } from './components/MemoryGallery';
import { AnimatedGradientBackground } from './components/AnimatedGradientBackground';
import { RomanticParticles } from './components/RomanticParticles';

export default function App() {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full relative">
      {/* Global atmospheric background */}
      <AnimatedGradientBackground />
      
      {/* Floating romantic particles */}
      <RomanticParticles />

      {/* Content layers */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturedMemory />
        <MemoryGallery />
              </div>
    </div>
  );
}