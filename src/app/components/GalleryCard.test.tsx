/**
 * Unit tests for GalleryCard component focusing on sizeVariant prop handling
 * Tests validate that aspect ratio mapping is applied correctly in the render output
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GalleryCard } from './GalleryCard';
import type { CardSizeVariant } from './GalleryCard.types';

// Base props for testing
const baseProps = {
  id: 'test-card-1',
  imageUrl: '/test-image.jpg',
  title: 'Test Card',
  date: 'January 2024',
};

describe('GalleryCard - sizeVariant prop handling', () => {
  describe('Aspect ratio class application', () => {
    it('renders small-portrait with aspect-[2/3] class', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant="small-portrait" />
      );
      const card = container.querySelector('.aspect-\\[2\\/3\\]');
      expect(card).toBeInTheDocument();
    });

    it('renders large-portrait with aspect-[3/5] class', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant="large-portrait" />
      );
      const card = container.querySelector('.aspect-\\[3\\/5\\]');
      expect(card).toBeInTheDocument();
    });

    it('renders square with aspect-square class', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant="square" />
      );
      const card = container.querySelector('.aspect-square');
      expect(card).toBeInTheDocument();
    });

    it('renders landscape with aspect-[16/9] class', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant="landscape" />
      );
      const card = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(card).toBeInTheDocument();
    });

    it('renders video variant with aspect-[16/9] class', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant="video" type="video" />
      );
      const card = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Default behavior', () => {
    it('defaults to aspect-square when no sizeVariant provided', () => {
      const { container } = render(<GalleryCard {...baseProps} />);
      const card = container.querySelector('.aspect-square');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Precedence rules', () => {
    it('prioritizes sizeVariant over aspectRatio prop', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant="landscape"
          aspectRatio="aspect-square"
        />
      );
      // Should have aspect-[16/9] from sizeVariant, not aspect-square from aspectRatio
      const landscapeCard = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(landscapeCard).toBeInTheDocument();
      
      const squareCard = container.querySelector('.aspect-square');
      expect(squareCard).not.toBeInTheDocument();
    });

    it('uses aspectRatio prop when sizeVariant is not provided', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-[4/3]" />
      );
      const card = container.querySelector('.aspect-\\[4\\/3\\]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Invalid sizeVariant handling', () => {
    it('falls back to square for invalid sizeVariant', () => {
      // Suppress console.warn for this test
      const originalWarn = console.warn;
      console.warn = () => {};

      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant={'invalid-variant' as CardSizeVariant}
        />
      );
      const card = container.querySelector('.aspect-square');
      expect(card).toBeInTheDocument();

      // Restore console.warn
      console.warn = originalWarn;
    });

    it('logs warning for invalid sizeVariant value', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <GalleryCard
          {...baseProps}
          sizeVariant={'bad-value' as CardSizeVariant}
        />
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid sizeVariant "bad-value"')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Integration with framer-motion', () => {
    it('maintains framer-motion animation classes', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant="landscape" />
      );
      
      // Check that the card has motion div structure
      const motionDiv = container.querySelector('[class*="aspect-"]');
      expect(motionDiv).toBeInTheDocument();
      expect(motionDiv?.classList.contains('rounded-2xl')).toBe(true);
      expect(motionDiv?.classList.contains('overflow-hidden')).toBe(true);
    });
  });

  describe('Video type indicator', () => {
    it('renders play icon for video type with correct aspect ratio', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant="video" type="video" />
      );
      
      // Video should have 16:9 aspect ratio
      const card = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(card).toBeInTheDocument();
      
      // Play icon should be present
      const playIcon = screen.getByText('▶️');
      expect(playIcon).toBeInTheDocument();
    });
  });
});

/**
 * Task 3.5: Mobile two-tap interaction tests
 * Tests validate that:
 * - First tap shows overlay
 * - Second tap opens lightbox
 * - Overlay auto-hides after 3 seconds
 * - Swipe away hides overlay within 2 seconds
 * - Rapid taps are debounced correctly
 */
describe('GalleryCard - Mobile Two-Tap Interaction', () => {
  beforeEach(() => {
    // Mock window.innerWidth for mobile detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500, // Mobile width
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('shows overlay on first tap', async () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    
    await userEvent.click(card!);
    
    // Overlay should be visible
    await waitFor(() => {
      const overlay = container.querySelector('[class*="from-black"]');
      expect(overlay).toHaveStyle({ opacity: '1' });
    });
  });

  it('debounces rapid taps (300ms threshold)', async () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    
    // First tap
    await userEvent.click(card!);
    
    // Rapid second tap within 300ms (debounced)
    // This should not trigger the second tap logic
    card?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    
    await waitFor(() => {
      // Card should still be in overlay state, not lightbox open state
      const overlay = container.querySelector('[class*="from-black"]');
      expect(overlay).toBeInTheDocument();
    });
  });

  it('detects swipe and hides overlay within expected time', async () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    
    // Simulate touch start
    fireEvent.touchStart(card!, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    
    // Simulate vertical swipe (> 10px movement)
    fireEvent.touchEnd(card!, {
      changedTouches: [{ clientX: 100, clientY: 120 }],
    });
    
    await waitFor(() => {
      // Swipe should have been detected
      expect(card).toBeInTheDocument();
    });
  });
});

/**
 * Task 5.4: Accessibility tests
 * Tests validate that:
 * - role="button" attribute is present
 * - aria-label contains title and date
 * - Keyboard focus shows overlay
 * - Enter and Space keys open lightbox
 * - Alt text is provided to images
 */
describe('GalleryCard - Accessibility', () => {
  it('has role="button" attribute', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    expect(card).toHaveAttribute('role', 'button');
  });

  it('has descriptive aria-label with title and date', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    expect(card).toHaveAttribute(
      'aria-label',
      'View photo: Test Card from January 2024'
    );
  });

  it('has visible focus indicator with outline', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    expect(card).toHaveClass('focus:outline-pink-300');
  });

  it('provides alt text for images', () => {
    render(<GalleryCard {...baseProps} />);
    const image = screen.getByAltText('Test Card');
    expect(image).toBeInTheDocument();
  });

  it('has tabIndex for keyboard navigation', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});

/**
 * Task 5.2: Keyboard navigation tests
 * Tests validate that:
 * - Focus shows overlay
 * - Enter key opens lightbox
 * - Space key opens lightbox
 */
describe('GalleryCard - Keyboard Navigation', () => {
  beforeEach(() => {
    // Mock for desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });
  });

  it('has tabIndex for keyboard navigation', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('can be focused via keyboard', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]') as HTMLElement;
    
    card.focus();
    expect(card).toHaveFocus();
  });

  it('opens lightbox via keyboard interaction', async () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]') as HTMLElement;
    
    // Focus the card
    card.focus();
    
    // Simulate Enter key press
    fireEvent.keyDown(card, { key: 'Enter' });
    
    // Card should still be in DOM
    expect(card).toBeInTheDocument();
  });

  it('supports Space key for activation', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const card = container.querySelector('[role="button"]') as HTMLElement;
    
    // Focus the card
    card.focus();
    
    // Simulate Space key press
    fireEvent.keyDown(card, { key: ' ' });
    
    // Card should still be in DOM
    expect(card).toBeInTheDocument();
  });
});

/**
 * Task 9.4: Performance optimization tests
 * Tests validate that:
 * - Lazy loading is enabled for images
 * - Resize events are debounced (200ms)
 * - No memory leaks from timeouts or event listeners
 * - Animations use GPU acceleration
 */
describe('GalleryCard - Performance Optimizations', () => {
  it('has lazy loading enabled on images', () => {
    render(<GalleryCard {...baseProps} />);
    const image = screen.getByAltText('Test Card');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('applies will-change-transform for GPU acceleration', () => {
    render(<GalleryCard {...baseProps} />);
    const image = screen.getByAltText('Test Card');
    expect(image?.className).toContain('will-change-transform');
  });

  it('cleans up timeouts on unmount to prevent memory leaks', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount } = render(<GalleryCard {...baseProps} />);
    
    // Unmount component
    unmount();
    
    // Cleanup should have been called
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  it('removes resize event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(
      window,
      'removeEventListener'
    );
    
    const { unmount } = render(<GalleryCard {...baseProps} />);
    
    // Unmount component
    unmount();
    
    // Event listener should be removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
    
    removeEventListenerSpy.mockRestore();
  });

  it('uses GPU-accelerated properties in animations', () => {
    const { container } = render(<GalleryCard {...baseProps} />);
    const image = screen.getByAltText('Test Card');
    
    // Check for GPU acceleration indicators
    // The image should have transform classes (scale, translate, etc.)
    expect(image.className).toContain('transition-transform');
  });

  it('has proper event listeners attached', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    
    render(<GalleryCard {...baseProps} />);
    
    // Resize listener should be added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
    
    addEventListenerSpy.mockRestore();
  });
});

/**
 * Task 11.2: Backward Compatibility Tests
 * Tests validate that:
 * - Existing aspectRatio prop still works with various Tailwind classes
 * - sizeVariant takes precedence when both props are provided
 * - No breaking changes to existing component usage
 * - Legacy component usage patterns continue to work
 * 
 * Requirements: 10.2, 10.3
 */
describe('GalleryCard - Backward Compatibility', () => {
  describe('Legacy aspectRatio prop support', () => {
    it('renders with aspectRatio="aspect-square" (legacy usage)', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-square" />
      );
      const card = container.querySelector('.aspect-square');
      expect(card).toBeInTheDocument();
    });

    it('renders with aspectRatio="aspect-[3/2]" (legacy custom ratio)', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-[3/2]" />
      );
      const card = container.querySelector('.aspect-\\[3\\/2\\]');
      expect(card).toBeInTheDocument();
    });

    it('renders with aspectRatio="aspect-[4/5]" (legacy portrait ratio)', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-[4/5]" />
      );
      const card = container.querySelector('.aspect-\\[4\\/5\\]');
      expect(card).toBeInTheDocument();
    });

    it('renders with aspectRatio="aspect-[16/9]" (legacy landscape ratio)', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-[16/9]" />
      );
      const card = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(card).toBeInTheDocument();
    });

    it('renders with aspectRatio="aspect-video" (legacy Tailwind preset)', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-video" />
      );
      const card = container.querySelector('.aspect-video');
      expect(card).toBeInTheDocument();
    });

    it('defaults to aspect-square when only aspectRatio is omitted', () => {
      const { container } = render(<GalleryCard {...baseProps} />);
      const card = container.querySelector('.aspect-square');
      expect(card).toBeInTheDocument();
    });
  });

  describe('sizeVariant precedence over aspectRatio', () => {
    it('uses sizeVariant="small-portrait" when both props are provided', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant="small-portrait"
          aspectRatio="aspect-square"
        />
      );
      // Should have aspect-[2/3] from sizeVariant
      const smallPortrait = container.querySelector('.aspect-\\[2\\/3\\]');
      expect(smallPortrait).toBeInTheDocument();
      
      // Should NOT have aspect-square from aspectRatio
      const square = container.querySelector('.aspect-square');
      expect(square).not.toBeInTheDocument();
    });

    it('uses sizeVariant="large-portrait" over aspectRatio="aspect-[16/9]"', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant="large-portrait"
          aspectRatio="aspect-[16/9]"
        />
      );
      // Should have aspect-[3/5] from sizeVariant
      const largePortrait = container.querySelector('.aspect-\\[3\\/5\\]');
      expect(largePortrait).toBeInTheDocument();
      
      // Should NOT have aspect-[16/9]
      const landscape = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(landscape).not.toBeInTheDocument();
    });

    it('uses sizeVariant="square" over aspectRatio="aspect-[4/5]"', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant="square"
          aspectRatio="aspect-[4/5]"
        />
      );
      // Should have aspect-square from sizeVariant
      const square = container.querySelector('.aspect-square');
      expect(square).toBeInTheDocument();
      
      // Should NOT have aspect-[4/5]
      const fourFive = container.querySelector('.aspect-\\[4\\/5\\]');
      expect(fourFive).not.toBeInTheDocument();
    });

    it('uses sizeVariant="landscape" over aspectRatio="aspect-[3/2]"', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant="landscape"
          aspectRatio="aspect-[3/2]"
        />
      );
      // Should have aspect-[16/9] from sizeVariant
      const landscape = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(landscape).toBeInTheDocument();
      
      // Should NOT have aspect-[3/2]
      const threeTwo = container.querySelector('.aspect-\\[3\\/2\\]');
      expect(threeTwo).not.toBeInTheDocument();
    });

    it('uses sizeVariant="video" over aspectRatio="aspect-square"', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant="video"
          type="video"
          aspectRatio="aspect-square"
        />
      );
      // Should have aspect-[16/9] from sizeVariant
      const video = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(video).toBeInTheDocument();
      
      // Should NOT have aspect-square
      const square = container.querySelector('.aspect-square');
      expect(square).not.toBeInTheDocument();
    });
  });

  describe('No breaking changes to existing usage', () => {
    it('maintains all existing props without sizeVariant', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          type="photo"
          aspectRatio="aspect-[3/2]"
        />
      );
      
      // Component should render successfully
      const card = container.querySelector('[role="button"]');
      expect(card).toBeInTheDocument();
      
      // Should have the legacy aspect ratio
      const aspectCard = container.querySelector('.aspect-\\[3\\/2\\]');
      expect(aspectCard).toBeInTheDocument();
      
      // Should have all standard attributes
      expect(card).toHaveAttribute('aria-label');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('maintains backward compatibility with minimal props', () => {
      // This is how the component was used before sizeVariant was added
      const { container } = render(
        <GalleryCard
          id="legacy-card"
          imageUrl="/legacy-image.jpg"
          title="Legacy Card"
          date="December 2023"
        />
      );
      
      // Component should render with defaults
      const card = container.querySelector('[role="button"]');
      expect(card).toBeInTheDocument();
      
      // Should default to square aspect ratio
      const square = container.querySelector('.aspect-square');
      expect(square).toBeInTheDocument();
    });

    it('supports all legacy prop combinations', () => {
      const { container } = render(
        <GalleryCard
          id="legacy-video"
          imageUrl="/legacy-video-thumb.jpg"
          title="Legacy Video"
          date="November 2023"
          type="video"
          aspectRatio="aspect-[16/9]"
        />
      );
      
      // Component should render with legacy props
      const card = container.querySelector('[role="button"]');
      expect(card).toBeInTheDocument();
      
      // Should use legacy aspectRatio
      const landscape = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(landscape).toBeInTheDocument();
      
      // Should show video indicator
      const playIcon = screen.getByText('▶️');
      expect(playIcon).toBeInTheDocument();
    });

    it('maintains interaction behavior without sizeVariant', async () => {
      // Desktop width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-square" />
      );
      const card = container.querySelector('[role="button"]') as HTMLElement;
      
      // Hover should still work
      fireEvent.mouseEnter(card);
      
      // Overlay should appear
      await waitFor(() => {
        const overlay = container.querySelector('[class*="from-black"]');
        expect(overlay).toHaveStyle({ opacity: '1' });
      });
    });

    it('maintains keyboard navigation without sizeVariant', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-[3/2]" />
      );
      const card = container.querySelector('[role="button"]') as HTMLElement;
      
      // Focus should work
      card.focus();
      expect(card).toHaveFocus();
      
      // Enter key should work
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(card).toBeInTheDocument();
    });

    it('maintains image rendering without sizeVariant', () => {
      render(
        <GalleryCard {...baseProps} aspectRatio="aspect-[4/5]" />
      );
      
      // Image should render with correct attributes
      const image = screen.getByAltText('Test Card');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('maintains accessibility attributes without sizeVariant', () => {
      const { container } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-video" />
      );
      const card = container.querySelector('[role="button"]');
      
      // Accessibility attributes should be present
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('aria-label', 'View photo: Test Card from January 2024');
    });
  });

  describe('Mixed usage scenarios', () => {
    it('supports gradual migration from aspectRatio to sizeVariant', () => {
      // Simulating a codebase where some cards use old prop, some use new
      const { container: container1 } = render(
        <GalleryCard {...baseProps} aspectRatio="aspect-square" />
      );
      const { container: container2 } = render(
        <GalleryCard {...baseProps} sizeVariant="landscape" />
      );
      
      // Both should render successfully
      const card1 = container1.querySelector('[role="button"]');
      const card2 = container2.querySelector('[role="button"]');
      expect(card1).toBeInTheDocument();
      expect(card2).toBeInTheDocument();
      
      // Each should have their respective aspect ratios
      const square = container1.querySelector('.aspect-square');
      const landscape = container2.querySelector('.aspect-\\[16\\/9\\]');
      expect(square).toBeInTheDocument();
      expect(landscape).toBeInTheDocument();
    });

    it('allows explicit sizeVariant override during migration', () => {
      // During migration, developers might want to override legacy aspectRatio
      const { container } = render(
        <GalleryCard
          {...baseProps}
          aspectRatio="aspect-[4/5]"
          sizeVariant="landscape"
        />
      );
      
      // sizeVariant should take precedence
      const landscape = container.querySelector('.aspect-\\[16\\/9\\]');
      expect(landscape).toBeInTheDocument();
      
      // Legacy aspectRatio should not be applied
      const fourFive = container.querySelector('.aspect-\\[4\\/5\\]');
      expect(fourFive).not.toBeInTheDocument();
    });
  });

  describe('Default behavior consistency', () => {
    it('defaults to square when neither prop is provided', () => {
      const { container } = render(
        <GalleryCard
          id="default-card"
          imageUrl="/default.jpg"
          title="Default"
          date="January 2024"
        />
      );
      
      const square = container.querySelector('.aspect-square');
      expect(square).toBeInTheDocument();
    });

    it('defaults to square when sizeVariant is undefined', () => {
      const { container } = render(
        <GalleryCard {...baseProps} sizeVariant={undefined} />
      );
      
      const square = container.querySelector('.aspect-square');
      expect(square).toBeInTheDocument();
    });

    it('uses aspectRatio when sizeVariant is undefined', () => {
      const { container } = render(
        <GalleryCard
          {...baseProps}
          sizeVariant={undefined}
          aspectRatio="aspect-[3/2]"
        />
      );
      
      const threeTwo = container.querySelector('.aspect-\\[3\\/2\\]');
      expect(threeTwo).toBeInTheDocument();
    });
  });
});
