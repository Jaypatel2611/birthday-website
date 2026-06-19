import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock IntersectionObserver for framer-motion viewport features
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver for resize event handling
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

// Mock react-responsive-masonry to avoid module loading issues
vi.mock('react-responsive-masonry', () => {
  return {
    default: ({ children }: { children: React.ReactNode }) => children,
    ResponsiveMasonry: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Cleanup after each test case
afterEach(() => {
  cleanup();
});
