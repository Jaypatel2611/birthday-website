import { useEffect, useRef } from 'react';

export function AnimatedGradientBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Get all animated elements
    const blobs = svg.querySelectorAll('circle, ellipse');

    // Assign different animation durations for depth
    blobs.forEach((blob, index) => {
      const duration = 30 + index * 8; // 30-70 seconds
      blob.setAttribute('style', `
        animation: float ${duration}s ease-in-out infinite;
      `);
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(30px, 10px) scale(1.02); }
        }

        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, 15px); }
        }

        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <svg
        ref={svgRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0, pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Define gradients */}
          <radialGradient id="champagneGlow" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#F5E6C8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F5E6C8" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="roseGlow" cx="70%" cy="20%">
            <stop offset="0%" stopColor="#F8D7DA" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F8D7DA" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="lavenderGlow" cx="50%" cy="80%">
            <stop offset="0%" stopColor="#E8DFF5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E8DFF5" stopOpacity="0" />
          </radialGradient>

          <filter id="blur1">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          </filter>
          <filter id="blur2">
            <feGaussianBlur in="SourceGraphic" stdDeviation="80" />
          </filter>
        </defs>

        {/* Base gradient background */}
        <rect width="100%" height="100%" fill="url(#baseGradient)" />

        {/* Champagne light spots (top-left) */}
        <ellipse cx="10%" cy="15%" rx="400" ry="500" fill="url(#champagneGlow)" filter="url(#blur2)" />

        {/* Rose light spots (top-right) */}
        <ellipse cx="90%" cy="20%" rx="350" ry="450" fill="url(#roseGlow)" filter="url(#blur2)" />

        {/* Lavender light spots (bottom) */}
        <ellipse cx="50%" cy="95%" rx="500" ry="300" fill="url(#lavenderGlow)" filter="url(#blur2)" />

        {/* Subtle bokeh circles for depth */}
        <circle cx="15%" cy="40%" r="120" fill="#F8D7DA" opacity="0.08" filter="url(#blur1)" />
        <circle cx="85%" cy="60%" r="150" fill="#F7C8D0" opacity="0.06" filter="url(#blur1)" />
        <circle cx="50%" cy="25%" r="100" fill="#E8DFF5" opacity="0.07" filter="url(#blur1)" />

        {/* Floating champagne highlights */}
        <circle cx="20%" cy="30%" r="200" fill="#F5E6C8" opacity="0.04" filter="url(#blur2)" />
        <circle cx="75%" cy="70%" r="180" fill="#FFFDF8" opacity="0.05" filter="url(#blur2)" />
      </svg>

      {/* Base gradient as CSS fallback */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          zIndex: 0,
          background: `linear-gradient(135deg, 
            #FFFDF8 0%,
            #F8D7DA 25%,
            #F7C8D0 50%,
            #E8DFF5 75%,
            #FFFDF8 100%)`,
          backgroundSize: '400% 400%',
          animation: 'floatSlow 120s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
