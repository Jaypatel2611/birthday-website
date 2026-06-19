import { ReactNode } from 'react';

interface SectionBackgroundProps {
  children: ReactNode;
  type: 'hero' | 'featured' | 'gallery';
}

export function SectionBackground({ children, type }: SectionBackgroundProps) {
  const getBackgroundStyle = () => {
    switch (type) {
      case 'hero':
        return {
          background: `
            radial-gradient(circle at 50% 40%, rgba(245, 230, 200, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 30% 60%, rgba(248, 215, 218, 0.1) 0%, transparent 40%),
            linear-gradient(135deg, rgba(255, 253, 248, 0.5) 0%, rgba(232, 223, 245, 0.3) 100%)
          `,
        };
      case 'featured':
        return {
          background: `
            radial-gradient(circle at 50% 50%, rgba(248, 215, 218, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 30%, rgba(247, 200, 208, 0.12) 0%, transparent 50%),
            linear-gradient(to bottom, rgba(248, 215, 218, 0.08) 0%, rgba(255, 253, 248, 0.05) 100%)
          `,
        };
      case 'gallery':
        return {
          background: `
            radial-gradient(circle at 50% 50%, rgba(255, 253, 248, 0.3) 0%, transparent 70%),
            linear-gradient(135deg, rgba(245, 230, 200, 0.08) 0%, rgba(232, 223, 245, 0.1) 100%)
          `,
        };
      default:
        return {};
    }
  };

  return (
    <div style={getBackgroundStyle()} className="relative">
      {children}
    </div>
  );
}
