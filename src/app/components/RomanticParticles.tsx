import { useEffect, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  type: 'heart' | 'sparkle';
  size: number;
}

export function RomanticParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on mount
    const generatedParticles: Particle[] = [];
    const particleCount = 25; // Optimized for performance

    for (let i = 0; i < particleCount; i++) {
      generatedParticles.push({
        id: `particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 15 + Math.random() * 25, // 15-40 seconds
        delay: Math.random() * 5,
        type: Math.random() > 0.6 ? 'sparkle' : 'heart',
        size: 6 + Math.random() * 8, // 6-14px
      });
    }

    setParticles(generatedParticles);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        .romantic-particle {
          position: fixed;
          pointer-events: none;
          z-index: 5;
        }

        .romantic-particle.heart {
          font-size: 12px;
        }

        .romantic-particle.sparkle {
          font-size: 10px;
        }
      `}</style>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`romantic-particle ${particle.type}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `floatUp ${particle.duration}s linear ${particle.delay}s infinite`,
            fontSize: `${particle.size}px`,
            opacity: particle.type === 'sparkle' ? 0.4 : 0.5,
          }}
        >
          {particle.type === 'heart' ? '💗' : '✨'}
        </div>
      ))}
    </>
  );
}
