# Design Document

## Overview

This design enhances the existing Gallery Card System by expanding card size options, refining responsive behaviors, and optimizing mobile and desktop interaction patterns. The system consists of two primary React components:

- **GalleryCard**: Renders individual media cards with support for multiple aspect ratios, overlay interactions, and visual feedback
- **MemoryGallery**: Orchestrates the masonry layout arrangement and responsive column breakpoints

The enhancement builds on the existing implementation which uses:
- `react-responsive-masonry` for dynamic masonry layout management
- `framer-motion` for animation orchestration
- Two-tap mobile interaction pattern (basic implementation exists)
- Tailwind CSS for styling with custom aspect ratio utilities

### Key Design Goals

1. **Visual Diversity**: Expand from 3 card sizes (square, 3/2, 4/5) to 5 distinct variants (small-portrait, large-portrait, square, landscape, video)
2. **Interaction Refinement**: Optimize the existing two-tap mobile pattern with timeout behavior and improve desktop hover feedback
3. **Responsive Excellence**: Fine-tune column breakpoints for optimal display across device sizes (1, 2, 2, 3, 4, 5 columns)
4. **Performance**: Implement lazy-loading, debounced resize handling, and smooth 60fps animations
5. **Accessibility**: Ensure keyboard navigation, screen reader support, and ARIA annotations
6. **Backward Compatibility**: Maintain support for existing `aspectRatio` prop while introducing new `sizeVariant` prop

### Research Context

**Masonry Layout with react-responsive-masonry**
- The library handles column calculation and item distribution automatically based on breakpoints
- It uses CSS columns internally which provides native browser performance
- Gutter spacing is applied uniformly across all breakpoints
- Column recalculation triggers on window resize with built-in debouncing

**Framer Motion Animation Patterns**
- `whileInView` enables viewport-triggered animations for cards entering the viewport
- `animate` prop allows conditional animations based on state (e.g., overlay visibility)
- Layout animations can be achieved with `layout` prop for position changes
- Performance is maintained by using GPU-accelerated properties (opacity, scale, transform)

**Mobile Detection Strategy**
- Current implementation uses `window.innerWidth < 768` for mobile detection
- This should be enhanced with a resize event listener for dynamic updates
- Consider using `matchMedia` API for more robust breakpoint detection
- The 768px threshold aligns with Tailwind's `md:` breakpoint

**Touch Event Handling**
- Two-tap pattern requires tracking tap count and timeout state
- `onTouchEnd` provides basic touch detection but doesn't distinguish between tap and swipe
- Consider adding touch gesture detection library or implementing custom touch tracking
- Auto-hide overlay after 3 seconds requires timeout management with cleanup

## Architecture

### Component Hierarchy

```
MemoryGallery (Container)
  └─ SectionBackground (Wrapper)
      └─ Masonry Layout Container
          └─ GalleryCard[] (Items)
              ├─ ImageWithFallback (Media)
              ├─ Overlay (Interaction Layer)
              ├─ Video Indicator (Conditional)
              └─ Lightbox (Modal)
```

### State Management Architecture

The system uses **local component state** with React hooks rather than global state management. This is appropriate because:

1. **Isolated Interactions**: Each card's overlay and lightbox state is independent
2. **No Cross-Component Communication**: Cards don't need to share state with siblings
3. **Performance**: Local state prevents unnecessary re-renders of unaffected cards
4. **Simplicity**: No Redux/Zustand overhead for this feature scope

**State Distribution**:
- **GalleryCard Component**: Manages `isOverlayVisible`, `isLightboxOpen`, `isMobile`, and tap timeout state
- **MemoryGallery Component**: Manages static gallery data array (no state needed currently)
- **Masonry Library**: Internally manages column distribution and breakpoint detection

### Interaction Flow Architecture

**Desktop Flow**:
```
Hover Enter → Set isOverlayVisible=true → Display overlay
Hover Exit → Set isOverlayVisible=false → Hide overlay
Click → Set isLightboxOpen=true → Open lightbox
```

**Mobile Flow**:
```
First Tap → Set isOverlayVisible=true → Display overlay → Start 3s timeout
Second Tap → Set isLightboxOpen=true → Open lightbox
Timeout (3s) → Set isOverlayVisible=false → Hide overlay
Touch Move (swipe) → Start 2s timeout → Set isOverlayVisible=false
```

### Animation Architecture

**Performance Strategy**:
- Use `transform` and `opacity` only (GPU-accelerated properties)
- Avoid animating `width`, `height`, `top`, `left` (causes layout thrashing)
- Apply `will-change: transform` via Framer Motion for complex animations
- Limit concurrent animations to 60fps with Framer Motion's built-in frame limiting

**Animation Layers**:
1. **Card Entry Animation**: Viewport-triggered fade-in with scale (500ms)
2. **Image Scale on Hover**: CSS transform with 500ms transition
3. **Overlay Fade**: Framer Motion opacity animation (300ms)
4. **Glow Effect**: Opacity fade for box-shadow (300ms)
5. **Layout Shift on Resize**: Masonry handles positioning (200ms debounce)

## Components and Interfaces

### GalleryCard Component

**Props Interface**:

```typescript
export type CardSizeVariant = 
  | 'small-portrait'  // 2:3 aspect ratio
  | 'large-portrait'  // 3:5 aspect ratio
  | 'square'          // 1:1 aspect ratio
  | 'landscape'       // 16:9 aspect ratio
  | 'video';          // 16:9 with play indicator

interface GalleryCardProps {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  type?: 'photo' | 'video';
  aspectRatio?: string;          // Legacy prop (Tailwind classes)
  sizeVariant?: CardSizeVariant; // New prop (priority over aspectRatio)
}
```

**Internal State**:

```typescript
interface GalleryCardState {
  isOverlayVisible: boolean;     // Overlay display state
  isLightboxOpen: boolean;       // Lightbox modal state
  isMobile: boolean;             // Device type detection
  tapTimeout: NodeJS.Timeout | null; // Auto-hide overlay timer
  lastTapTime: number;           // For double-tap detection
}
```

**Key Methods**:

```typescript
// Handle card click/tap interaction
handleCardInteraction(): void

// Handle hover enter (desktop only)
handleHoverEnter(): void

// Handle hover exit (desktop only)
handleHoverExit(): void

// Handle touch end for mobile tap detection
handleTouchEnd(): void

// Clean up timeouts on unmount
useEffect cleanup(): void

// Update isMobile on resize
useEffect resize listener(): void
```

**Aspect Ratio Mapping**:

The `sizeVariant` prop maps to CSS aspect-ratio values:

```typescript
const sizeVariantMap: Record<CardSizeVariant, string> = {
  'small-portrait': 'aspect-[2/3]',   // 0.667 ratio
  'large-portrait': 'aspect-[3/5]',   // 0.6 ratio
  'square': 'aspect-square',           // 1.0 ratio
  'landscape': 'aspect-[16/9]',        // 1.778 ratio
  'video': 'aspect-[16/9]',            // 1.778 ratio
};
```

### MemoryGallery Component

**Props Interface**:

```typescript
interface MemoryGalleryProps {
  memories?: Memory[];  // Optional prop for custom data source
}

interface Memory {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  type?: 'photo' | 'video';
  sizeVariant?: CardSizeVariant;
  aspectRatio?: string; // Legacy support
}
```

**Masonry Configuration**:

```typescript
const masonryBreakpoints = {
  0: 1,      // 0-639px: Mobile small (1 column)
  640: 2,    // 640-767px: Mobile large (2 columns)
  768: 2,    // 768-1023px: Tablet (2 columns)
  1024: 3,   // 1024-1279px: Tablet large/Desktop small (3 columns)
  1280: 4,   // 1280-1535px: Desktop (4 columns)
  1536: 5,   // 1536px+: Desktop large (5 columns)
};

const gutterSize = '12px'; // Consistent across all breakpoints
```

### ImageWithFallback Component

This existing component handles:
- Image loading with fallback on error
- Lazy loading via `loading="lazy"` attribute
- Placeholder display during load
- Error state rendering

**Interface** (existing, no changes needed):

```typescript
interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}
```

### Lightbox Component

This existing component handles:
- Full-screen modal display
- Image zoom and pan
- Close interactions (ESC key, click outside, close button)
- Keyboard navigation

**Interface** (existing, no changes needed):

```typescript
interface LightboxProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  date: string;
  onClose: () => void;
}
```

## Data Models

### CardSizeVariant Type

```typescript
export type CardSizeVariant = 
  | 'small-portrait'
  | 'large-portrait'
  | 'square'
  | 'landscape'
  | 'video';
```

**Aspect Ratio Specifications**:

| Variant | Aspect Ratio | CSS Value | Use Case |
|---------|--------------|-----------|----------|
| small-portrait | 2:3 | aspect-[2/3] | Tall portrait photos, vertical compositions |
| large-portrait | 3:5 | aspect-[3/5] | Extra tall portraits, full-body shots |
| square | 1:1 | aspect-square | Balanced compositions, Instagram-style |
| landscape | 16:9 | aspect-[16/9] | Wide shots, panoramas, cinematic |
| video | 16:9 | aspect-[16/9] | Video content with play indicator |

### Memory Data Model

```typescript
interface Memory {
  id: string;                    // Unique identifier (required)
  imageUrl: string;              // Image/video source URL (required)
  title: string;                 // Display title (required)
  date: string;                  // Display date string (required)
  type?: 'photo' | 'video';      // Media type (default: 'photo')
  sizeVariant?: CardSizeVariant; // Size variant (default: 'square')
  aspectRatio?: string;          // Legacy Tailwind class (deprecated)
}
```

**Validation Rules**:
- `id` must be unique across all gallery items
- `imageUrl` must be a valid URL or relative path
- `sizeVariant` must be one of the defined CardSizeVariant values
- If both `sizeVariant` and `aspectRatio` are provided, `sizeVariant` takes precedence
- Invalid `sizeVariant` values should trigger a console warning and fall back to 'square'

### Device Detection Model

```typescript
interface DeviceContext {
  isMobile: boolean;      // true if viewport < 768px
  breakpoint: Breakpoint; // Current responsive breakpoint
}

type Breakpoint = 
  | 'xs'   // 0-639px
  | 'sm'   // 640-767px
  | 'md'   // 768-1023px
  | 'lg'   // 1024-1279px
  | 'xl'   // 1280-1535px
  | '2xl'; // 1536px+
```

### Animation Configuration Model

```typescript
interface AnimationConfig {
  cardEntry: {
    duration: 500;        // milliseconds
    initial: { opacity: 0, scale: 0.9 };
    animate: { opacity: 1, scale: 1 };
  };
  overlayFade: {
    duration: 300;        // milliseconds
  };
  imageScale: {
    duration: 500;        // milliseconds
    scale: 1.1;           // 110% on hover
  };
  glowEffect: {
    duration: 300;        // milliseconds
    shadow: 'rgba(248, 215, 218, 0.4)';
  };
  layoutShift: {
    debounce: 200;        // milliseconds
  };
}
```

### Masonry Layout Model

```typescript
interface MasonryConfig {
  columnsCountBreakPoints: Record<number, number>;
  gutter: string;
}

const masonryConfig: MasonryConfig = {
  columnsCountBreakPoints: {
    0: 1,
    640: 2,
    768: 2,
    1024: 3,
    1280: 4,
    1536: 5,
  },
  gutter: '12px',
};
```



## Error Handling

### Image Loading Errors

**Strategy**: Graceful degradation using the existing `ImageWithFallback` component

```typescript
// ImageWithFallback handles:
// - Image load failures with fallback placeholder
// - Broken URL detection
// - Network timeout scenarios
// - CORS errors
```

**Error States**:
1. **Image Load Failure**: Display placeholder with gallery icon
2. **Slow Network**: Show skeleton loader during initial load
3. **Invalid URL**: Catch error and display fallback immediately
4. **CORS Issues**: Display error message with fallback

**User Experience**:
- No JavaScript errors thrown to console for image failures
- Gallery continues to render other cards even if some images fail
- Alt text provides context to screen readers when images fail
- Retry mechanism not implemented (graceful failure preferred for UX)

### Invalid sizeVariant Prop

**Strategy**: Validation with console warning and fallback to default

```typescript
const validateSizeVariant = (variant: string | undefined): CardSizeVariant => {
  const validVariants: CardSizeVariant[] = [
    'small-portrait',
    'large-portrait',
    'square',
    'landscape',
    'video'
  ];
  
  if (!variant) {
    return 'square'; // Default
  }
  
  if (!validVariants.includes(variant as CardSizeVariant)) {
    console.warn(
      `Invalid sizeVariant "${variant}". Falling back to "square". ` +
      `Valid values: ${validVariants.join(', ')}`
    );
    return 'square';
  }
  
  return variant as CardSizeVariant;
};
```

**Error Handling**:
- Invalid values trigger console warning (development visibility)
- Gallery continues to render with default 'square' variant
- No UI disruption for end users
- TypeScript types prevent most invalid values at compile time

### Touch Event Edge Cases

**Strategy**: Defensive event handling with state cleanup

**Edge Cases Handled**:

1. **Rapid Taps**: Debounce tap events to prevent double-trigger
   ```typescript
   const TAP_DEBOUNCE_MS = 300;
   if (Date.now() - lastTapTime < TAP_DEBOUNCE_MS) {
     return; // Ignore rapid taps
   }
   ```

2. **Touch During Animation**: Prevent interactions while overlay is animating
   ```typescript
   if (isAnimating) {
     return; // Wait for animation to complete
   }
   ```

3. **Scroll vs Tap**: Detect scroll intent to prevent accidental tap triggers
   ```typescript
   const touchStartY = event.touches[0].clientY;
   const touchEndY = event.changedTouches[0].clientY;
   if (Math.abs(touchEndY - touchStartY) > 10) {
     return; // This was a scroll, not a tap
   }
   ```

4. **Memory Leak from Timeouts**: Clear all timeouts on unmount
   ```typescript
   useEffect(() => {
     return () => {
       if (tapTimeout) {
         clearTimeout(tapTimeout);
       }
     };
   }, [tapTimeout]);
   ```

### Resize Event Handling

**Strategy**: Debounced resize listener with cleanup

**Issues Addressed**:
1. **Excessive Re-renders**: Debounce resize events to 200ms
2. **Memory Leaks**: Remove event listeners on component unmount
3. **Breakpoint Thrashing**: Only update state when crossing breakpoint thresholds

```typescript
useEffect(() => {
  let resizeTimeout: NodeJS.Timeout;
  
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        // Reset overlay state on device type change
        setIsOverlayVisible(false);
      }
    }, 200);
  };
  
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimeout);
  };
}, [isMobile]);
```

### Animation Performance Issues

**Strategy**: Fallback to reduced motion when performance degrades

**Detection**:
```typescript
// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Apply reduced animations
const animationDuration = prefersReducedMotion ? 0 : 500;
```

**Performance Monitoring**:
- Use `framer-motion`'s built-in performance optimizations
- Disable animations on low-end devices (detected via frame rate)
- Provide instant state changes instead of animated transitions when needed

### Lightbox Interaction Errors

**Strategy**: Ensure lightbox can always be closed

**Safeguards**:
1. **ESC Key Always Works**: Even if click handlers fail
2. **Click Outside Closes**: Provides alternative close method
3. **Close Button Visible**: Always accessible fallback
4. **Body Scroll Lock**: Prevent background scroll, restore on close
5. **Focus Trap**: Keep keyboard focus within lightbox

```typescript
const handleLightboxClose = () => {
  setIsLightboxOpen(false);
  setIsOverlayVisible(false);
  // Ensure body scroll is restored
  document.body.style.overflow = 'auto';
};
```

## Testing Strategy

### Overview

The Enhanced Gallery Card System requires a **multi-layered testing approach** combining unit tests, integration tests, and visual regression tests. Property-based testing is **not applicable** for this feature because:

1. **UI Rendering Focus**: The system primarily handles React component rendering, DOM manipulation, and visual feedback
2. **Browser-Specific Behaviors**: Touch events, hover states, and resize handlers depend on browser APIs that don't have universal properties
3. **Interaction Patterns**: Mobile two-tap and desktop hover are specific behavioral examples, not universal properties
4. **Visual Verification**: Animation timing, layout arrangement, and visual effects require visual inspection

### Unit Testing Approach

**Framework**: Jest + React Testing Library

**Focus Areas**:

1. **Component Rendering**
   - Verify GalleryCard renders with all size variants
   - Verify default props apply correctly
   - Verify video indicator appears only for type='video'
   - Verify accessibility attributes (role, aria-label)

2. **State Management**
   - Test overlay visibility toggles correctly on mobile tap
   - Test hover show/hide on desktop
   - Test lightbox opens on second tap (mobile) or first click (desktop)
   - Test timeout clearing on unmount

3. **Prop Validation**
   - Test sizeVariant takes precedence over aspectRatio
   - Test invalid sizeVariant logs warning and falls back to 'square'
   - Test backward compatibility with aspectRatio prop

4. **Device Detection**
   - Test isMobile state updates on resize
   - Test mobile detection threshold (768px)
   - Test resize debouncing

**Example Unit Test Structure**:

```typescript
describe('GalleryCard', () => {
  describe('Size Variants', () => {
    it('renders small-portrait with aspect-[2/3] class', () => {
      render(<GalleryCard sizeVariant="small-portrait" {...baseProps} />);
      expect(screen.getByRole('button')).toHaveClass('aspect-[2/3]');
    });
    
    it('defaults to square when no sizeVariant provided', () => {
      render(<GalleryCard {...baseProps} />);
      expect(screen.getByRole('button')).toHaveClass('aspect-square');
    });
    
    it('prioritizes sizeVariant over aspectRatio prop', () => {
      render(
        <GalleryCard 
          sizeVariant="landscape" 
          aspectRatio="aspect-square" 
          {...baseProps} 
        />
      );
      expect(screen.getByRole('button')).toHaveClass('aspect-[16/9]');
    });
  });
  
  describe('Mobile Interaction', () => {
    beforeEach(() => {
      window.innerWidth = 375; // Mobile viewport
    });
    
    it('shows overlay on first tap', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      fireEvent.click(card);
      
      expect(screen.getByText('Tap to view')).toBeInTheDocument();
    });
    
    it('opens lightbox on second tap', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      fireEvent.click(card); // First tap
      fireEvent.click(card); // Second tap
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    it('hides overlay after 3 seconds', async () => {
      jest.useFakeTimers();
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      fireEvent.click(card);
      expect(screen.getByText('Tap to view')).toBeInTheDocument();
      
      jest.advanceTimersByTime(3000);
      
      await waitFor(() => {
        expect(screen.queryByText('Tap to view')).not.toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });
  });
  
  describe('Desktop Interaction', () => {
    beforeEach(() => {
      window.innerWidth = 1024; // Desktop viewport
    });
    
    it('shows overlay on hover', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText(baseProps.title)).toBeVisible();
    });
    
    it('hides overlay on mouse leave', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);
      
      expect(screen.getByText(baseProps.title)).not.toBeVisible();
    });
    
    it('opens lightbox on click', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      fireEvent.click(card);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
  
  describe('Accessibility', () => {
    it('has role="button"', () => {
      render(<GalleryCard {...baseProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    it('has aria-label with title and date', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute(
        'aria-label',
        expect.stringContaining(baseProps.title)
      );
      expect(card).toHaveAttribute(
        'aria-label',
        expect.stringContaining(baseProps.date)
      );
    });
    
    it('shows overlay on keyboard focus', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      card.focus();
      
      expect(screen.getByText(baseProps.title)).toBeVisible();
    });
    
    it('opens lightbox on Enter key', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      card.focus();
      fireEvent.keyDown(card, { key: 'Enter' });
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    it('opens lightbox on Space key', () => {
      render(<GalleryCard {...baseProps} />);
      const card = screen.getByRole('button');
      
      card.focus();
      fireEvent.keyDown(card, { key: ' ' });
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
```

### Integration Testing Approach

**Framework**: Jest + React Testing Library + Testing Playground

**Focus Areas**:

1. **Masonry Layout Integration**
   - Test column counts at different viewport widths
   - Test gutter spacing consistency
   - Test layout recalculation on resize
   - Test card distribution across columns

2. **Multi-Card Interactions**
   - Test multiple cards can have overlays visible simultaneously (desktop)
   - Test only one lightbox can be open at a time
   - Test scroll behavior doesn't interfere with interactions

3. **ImageWithFallback Integration**
   - Test lazy loading triggers as cards enter viewport
   - Test fallback displays when images fail to load
   - Test gallery continues rendering when some images fail

4. **Animation Performance**
   - Test animations complete within expected timeframes
   - Test no memory leaks from animation cleanup
   - Test reduced motion preference is respected

**Example Integration Test**:

```typescript
describe('MemoryGallery Integration', () => {
  it('renders correct column count at different breakpoints', () => {
    const { rerender } = render(<MemoryGallery />);
    
    // Mobile small: 1 column
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    // Assert 1 column layout
    
    // Tablet: 2 columns
    window.innerWidth = 800;
    window.dispatchEvent(new Event('resize'));
    // Assert 2 column layout
    
    // Desktop: 4 columns
    window.innerWidth = 1400;
    window.dispatchEvent(new Event('resize'));
    // Assert 4 column layout
  });
  
  it('allows multiple desktop hover overlays simultaneously', () => {
    window.innerWidth = 1024; // Desktop
    render(<MemoryGallery />);
    
    const cards = screen.getAllByRole('button');
    
    fireEvent.mouseEnter(cards[0]);
    fireEvent.mouseEnter(cards[1]);
    
    // Both overlays should be visible
    expect(screen.getByText('First Sunset Together')).toBeVisible();
    expect(screen.getByText('Mountain Adventure')).toBeVisible();
  });
  
  it('prevents multiple lightboxes from opening', () => {
    render(<MemoryGallery />);
    const cards = screen.getAllByRole('button');
    
    fireEvent.click(cards[0]);
    fireEvent.click(cards[1]);
    
    // Only one dialog should exist
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs).toHaveLength(1);
  });
});
```

### Visual Regression Testing

**Framework**: Playwright or Cypress with Percy/Chromatic

**Focus Areas**:

1. **Size Variant Rendering**
   - Capture screenshots of all 5 size variants
   - Verify aspect ratios match specifications
   - Check spacing and alignment

2. **Responsive Layouts**
   - Capture gallery at all 6 breakpoints
   - Verify column counts and gutter spacing
   - Check for layout shifts or overlaps

3. **Interaction States**
   - Capture overlay appearance (mobile + desktop)
   - Capture hover states (scale, glow, opacity)
   - Capture video indicator rendering

4. **Animation Snapshots**
   - Capture keyframes of entry animation
   - Capture overlay fade transition
   - Verify smooth visual transitions

**Example Visual Test**:

```typescript
test('visual regression - all size variants', async ({ page }) => {
  await page.goto('/gallery');
  
  // Wait for images to load
  await page.waitForSelector('[role="button"]');
  
  // Capture baseline
  await expect(page).toHaveScreenshot('gallery-all-variants.png');
});

test('visual regression - responsive breakpoints', async ({ page }) => {
  await page.goto('/gallery');
  
  const breakpoints = [
    { width: 375, height: 812, name: 'mobile-small' },
    { width: 640, height: 1136, name: 'mobile-large' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1024, height: 768, name: 'desktop-small' },
    { width: 1440, height: 900, name: 'desktop' },
    { width: 1920, height: 1080, name: 'desktop-large' },
  ];
  
  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.waitForTimeout(300); // Allow layout to settle
    await expect(page).toHaveScreenshot(`gallery-${bp.name}.png`);
  }
});

test('visual regression - hover state', async ({ page }) => {
  await page.goto('/gallery');
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const firstCard = page.locator('[role="button"]').first();
  await firstCard.hover();
  
  // Wait for animation to complete
  await page.waitForTimeout(500);
  
  await expect(page).toHaveScreenshot('gallery-card-hover.png');
});
```

### Manual Testing Checklist

**Device Testing**:
- [ ] iOS Safari (iPhone 12, 13, 14)
- [ ] Android Chrome (Samsung Galaxy S21, Pixel 6)
- [ ] Desktop Chrome (Windows, macOS)
- [ ] Desktop Firefox (Windows, macOS)
- [ ] Desktop Safari (macOS)

**Interaction Testing**:
- [ ] Two-tap mobile interaction works smoothly
- [ ] Overlay auto-hides after 3 seconds on mobile
- [ ] Swipe away hides overlay within 2 seconds
- [ ] Desktop hover shows/hides overlay correctly
- [ ] Click opens lightbox without double-tap
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces card information

**Performance Testing**:
- [ ] Lazy loading triggers as cards enter viewport
- [ ] No layout shift during image load
- [ ] Smooth 60fps animations on mid-range devices
- [ ] Resize debouncing prevents excessive re-renders
- [ ] No memory leaks from timeouts or event listeners

**Visual Testing**:
- [ ] All 5 size variants display correct aspect ratios
- [ ] Masonry layout has no awkward gaps
- [ ] Glow effect appears on overlay visibility
- [ ] Video play icon scales correctly on hover
- [ ] Responsive breakpoints transition smoothly

### Test Coverage Goals

**Target Coverage**:
- **Unit Tests**: 85%+ code coverage for GalleryCard component
- **Integration Tests**: All user interaction paths covered
- **Visual Regression**: All size variants and breakpoints captured
- **Accessibility**: WCAG 2.1 AA compliance verified

**Priority Areas**:
1. **High Priority**: Core interaction logic (tap, hover, click)
2. **High Priority**: Size variant rendering and validation
3. **Medium Priority**: Responsive breakpoint transitions
4. **Medium Priority**: Animation performance and timing
5. **Low Priority**: Edge cases with rapid interactions

