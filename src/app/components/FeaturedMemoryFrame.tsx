import { ReactNode } from 'react';

interface FeaturedMemoryFrameProps {
  children: ReactNode;
}

export function FeaturedMemoryFrame({ children }: FeaturedMemoryFrameProps) {
  return (
    <>
      <style>{`
        .featured-memory-frame {
          position: relative;
        }

        .featured-memory-glow {
          position: absolute;
          inset: -60px;
          background: 
            radial-gradient(ellipse at center, rgba(248, 215, 218, 0.25) 0%, transparent 70%),
            radial-gradient(ellipse at 40% 40%, rgba(245, 230, 200, 0.15) 0%, transparent 50%);
          border-radius: 32px;
          pointer-events: none;
          z-index: 1;
        }

        .featured-memory-vignette {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.08) 100%);
          border-radius: 24px;
          pointer-events: none;
          z-index: 2;
        }

        .featured-memory-content {
          position: relative;
          z-index: 3;
        }
      `}</style>

      <div className="featured-memory-frame">
        <div className="featured-memory-glow" />
        {children}
        <div className="featured-memory-vignette" />
      </div>
    </>
  );
}
