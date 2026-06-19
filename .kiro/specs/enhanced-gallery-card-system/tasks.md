# Implementation Plan: Enhanced Gallery Card System

## Overview

This implementation plan converts the Enhanced Gallery Card System design into actionable TypeScript coding tasks. The system expands the existing GalleryCard and MemoryGallery components from 3 to 5 card size variants, refines mobile two-tap interaction with timeout behavior, optimizes desktop hover interactions, and updates masonry layout breakpoints for better responsive behavior.

## Tasks

- [x] 1. Create CardSizeVariant type definition and aspect ratio mapping
  - Create or update type definitions file for CardSizeVariant type
  - Export CardSizeVariant as union type: 'small-portrait' | 'large-portrait' | 'square' | 'landscape' | 'video'
  - Create sizeVariantMap object mapping each variant to Tailwind CSS aspect ratio classes
  - Add JSDoc comments explaining each size variant's aspect ratio and use case
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.1, 10.4_

- [x] 1.1 Write unit tests for CardSizeVariant type validation
  - Test that all 5 variant values are accepted
  - Test that invalid values are rejected at compile time
  - _Requirements: 10.5_

- [ ] 2. Enhance GalleryCard component with sizeVariant prop
  - [x] 2.1 Update GalleryCardProps interface to include sizeVariant prop
    - Add optional sizeVariant prop of type CardSizeVariant
    - Maintain backward compatibility with existing aspectRatio prop
    - Add JSDoc documentation for the new prop
    - _Requirements: 1.6, 1.7, 10.1, 10.2, 10.3_

  - [x] 2.2 Implement sizeVariant validation and fallback logic
    - Create validateSizeVariant utility function
    - Implement console warning for invalid sizeVariant values
    - Fall back to 'square' for invalid or missing sizeVariant
    - Ensure sizeVariant takes precedence over aspectRatio when both are provided
    - _Requirements: 1.7, 10.3, 10.5_

  - [x] 2.3 Apply aspect ratio mapping in component render
    - Use sizeVariantMap to convert sizeVariant to Tailwind classes
    - Apply the resulting aspect ratio class to the card container
    - Ensure smooth rendering with existing framer-motion animations
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 2.4 Write unit tests for sizeVariant prop handling
    - Test all 5 size variants render with correct aspect ratio classes
    - Test default to 'square' when no sizeVariant provided
    - Test sizeVariant takes precedence over aspectRatio
    - Test invalid sizeVariant logs warning and falls back to 'square'
    - _Requirements: 10.3, 10.5_

- [ ] 3. Implement enhanced mobile two-tap interaction with timeout
  - [x] 3.1 Add state management for tap tracking and timeouts
    - Add tapTimeout state (NodeJS.Timeout | null)
    - Add lastTapTime state (number) for debouncing rapid taps
    - Update existing isMobile state management
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.2 Implement mobile tap detection and overlay toggle logic
    - Update handleCardInteraction to distinguish first vs second tap
    - On first tap: show overlay and start 3-second auto-hide timeout
    - On second tap: open lightbox and clear timeout
    - Add debouncing to prevent rapid tap issues (300ms threshold)
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 3.3 Implement overlay auto-hide timeout behavior
    - Create 3-second timeout that sets isOverlayVisible to false
    - Clear existing timeout before creating new one
    - Add cleanup to clear timeout on component unmount
    - _Requirements: 2.3_

  - [x] 3.4 Implement swipe-away detection for mobile
    - Track touch start and end positions in onTouchEnd handler
    - If vertical movement > 10px, treat as swipe (not tap)
    - Start 2-second timeout to hide overlay on swipe detection
    - _Requirements: 2.4_

  - [x] 3.5 Write unit tests for mobile two-tap interaction
    - Test first tap shows overlay
    - Test second tap opens lightbox
    - Test overlay auto-hides after 3 seconds
    - Test swipe away hides overlay within 2 seconds
    - Test rapid taps are debounced correctly
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Enhance desktop hover interaction
  - [x] 4.1 Refine handleHoverEnter and handleHoverExit methods
    - Ensure handleHoverEnter only applies on desktop (isMobile === false)
    - Set isOverlayVisible to true on mouse enter
    - Set isOverlayVisible to false on mouse leave
    - Ensure click opens lightbox immediately without overlay requirement
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 4.2 Update image scale animation for desktop hover
    - Apply group-hover:scale-110 transform with 500ms transition
    - Ensure transform uses GPU acceleration (will-change: transform)
    - Verify animation performs at 60fps
    - _Requirements: 6.2_

  - [x] 4.3 Write unit tests for desktop hover interaction
    - Test hover enter shows overlay
    - Test hover exit hides overlay
    - Test click opens lightbox without requiring overlay
    - Test mobile interactions don't trigger hover handlers
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 5. Add accessibility attributes and keyboard navigation
  - [x] 5.1 Add ARIA attributes to GalleryCard
    - Add role="button" to card container
    - Generate aria-label with title and date (e.g., "View photo: First Sunset Together from July 2024")
    - Ensure aria-label is descriptive for screen readers
    - _Requirements: 8.1_

  - [x] 5.2 Implement keyboard navigation support
    - Add onKeyDown handler to detect Enter and Space keys
    - Show overlay on keyboard focus (onFocus handler)
    - Open lightbox on Enter or Space key press
    - Ensure visible focus indicator with outline
    - _Requirements: 8.2, 8.3, 8.4_

  - [x] 5.3 Add alt text support for image fallback
    - Pass title as alt text to ImageWithFallback component
    - Ensure alt text is displayed when images fail to load
    - _Requirements: 8.5_

  - [x] 5.4 Write accessibility tests
    - Test role="button" attribute is present
    - Test aria-label contains title and date
    - Test keyboard focus shows overlay
    - Test Enter and Space keys open lightbox
    - Test alt text is provided to images
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 6. Update MemoryGallery masonry breakpoint configuration
  - [x] 6.1 Update columnsCountBreakPoints object
    - Set 0-639px: 1 column
    - Set 640-767px: 2 columns
    - Set 768-1023px: 2 columns
    - Set 1024-1279px: 3 columns
    - Set 1280-1535px: 4 columns
    - Set 1536px+: 5 columns
    - Maintain gutter at 12px
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.4_

  - [x] 6.2 Add sizeVariant to memory data objects
    - Update memories array to include sizeVariant property for each item
    - Use a mix of all 5 size variants for visual diversity
    - Ensure at least one video type card for testing
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 6.3 Write integration tests for masonry layout
    - Test correct column counts at each breakpoint
    - Test gutter spacing is consistent (12px)
    - Test layout recalculates within 200ms on resize
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 7. Implement visual feedback enhancements
  - [x] 7.1 Add glow effect on overlay visibility
    - Create motion.div with conditional rendering based on isOverlayVisible
    - Apply box-shadow with rgba(248, 215, 218, 0.4) color
    - Animate opacity from 0 to 1 over 300ms using framer-motion
    - Apply pointer-events-none to prevent interaction blocking
    - _Requirements: 6.1_

  - [x] 7.2 Enhance overlay content with proper styling
    - Display date in white text with 80% opacity (text-white/80)
    - Display title in white text with 100% opacity (text-white)
    - Add "Tap to view" indicator on mobile with pulsing hand emoji 👆
    - Animate overlay content with y-axis translation (from y: 20 to y: 0)
    - _Requirements: 6.4, 6.5_

  - [x] 7.3 Implement card entry animation
    - Use framer-motion initial={{ opacity: 0, scale: 0.9 }}
    - Use whileInView={{ opacity: 1, scale: 1 }}
    - Set transition duration to 500ms
    - Add viewport={{ once: true, margin: '50px' }} for lazy triggering
    - _Requirements: 6.3_

  - [x] 7.4 Write visual feedback tests
    - Test glow effect appears when overlay is visible
    - Test date displays with correct opacity
    - Test "Tap to view" indicator appears on mobile only
    - Test card entry animation completes
    - _Requirements: 6.1, 6.3, 6.4, 6.5_

- [ ] 8. Implement video card indicator overlay
  - [x] 8.1 Add conditional play icon overlay for video type
    - Check if type === 'video'
    - Render centered play icon using ▶️ emoji at text-5xl (3rem)
    - Apply 20% opacity black background (bg-black/20)
    - Add hover state with 30% opacity background (group-hover:bg-black/30)
    - _Requirements: 1.5, 7.1, 7.4_

  - [x] 8.2 Add play icon scale animation on hover
    - Wrap play icon in motion.div
    - Apply whileHover={{ scale: 1.2 }} for 120% scale on hover
    - Ensure smooth transition
    - _Requirements: 7.2_

  - [x] 8.3 Write tests for video card indicator
    - Test play icon appears only for type='video'
    - Test play icon scales to 120% on hover
    - Test background darkens to 30% on hover
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 9. Implement performance optimizations
  - [x] 9.1 Add lazy loading to gallery card images
    - Ensure loading="lazy" attribute is passed to ImageWithFallback
    - Verify images load as they enter viewport (within 100ms)
    - Test with multiple cards to ensure optimization works
    - _Requirements: 9.1, 9.2_

  - [x] 9.2 Implement debounced resize handler for device detection
    - Add useEffect hook with resize event listener
    - Debounce resize events to 200ms intervals
    - Update isMobile state only when crossing 768px threshold
    - Clear event listener and timeout on component unmount
    - _Requirements: 4.7, 9.4_

  - [x] 9.3 Optimize animation performance
    - Use only GPU-accelerated properties (transform, opacity)
    - Ensure framer-motion animations target 60fps
    - Add will-change: transform hint for complex animations
    - Test on mid-range devices for performance validation
    - _Requirements: 9.5_

  - [x] 9.4 Write performance tests
    - Test lazy loading triggers as cards enter viewport
    - Test resize debouncing prevents excessive re-renders
    - Test animations maintain 60fps frame rate
    - Test no memory leaks from timeouts or event listeners
    - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [x] 10. Checkpoint - Ensure all tests pass and functionality works
  - Run all unit tests and ensure they pass
  - Test mobile two-tap interaction on actual mobile device or emulator
  - Test desktop hover interaction in desktop browser
  - Test all 5 size variants render correctly
  - Test masonry layout at all 6 breakpoints
  - Test keyboard navigation and accessibility features
  - Test video card indicator appears and animates correctly
  - Test performance optimizations (lazy loading, debouncing)
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Integration and final verification
  - [x] 11.1 Update MemoryGallery with diverse size variants
    - Add variety of sizeVariant values across memory items
    - Include at least one of each variant type for visual testing
    - Ensure masonry layout arranges cards beautifully
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 11.2 Verify backward compatibility
    - Test that existing aspectRatio prop still works
    - Ensure sizeVariant takes precedence when both props provided
    - Verify no breaking changes to existing component usage
    - _Requirements: 10.2, 10.3_

  - [x] 11.3 Write end-to-end integration tests
    - Test full mobile interaction flow (tap → overlay → tap → lightbox)
    - Test full desktop interaction flow (hover → overlay, click → lightbox)
    - Test multiple cards can have overlays simultaneously on desktop
    - Test only one lightbox can be open at a time
    - Test masonry layout recalculates correctly on window resize
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.7_

- [x] 12. Final checkpoint - Comprehensive testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements from requirements.md for traceability
- Two checkpoints (tasks 10 and 12) ensure incremental validation
- Tests are marked optional to allow rapid implementation, but are recommended for production quality
- All TypeScript code should follow existing project conventions and use existing dependencies (framer-motion, react-responsive-masonry)
- Performance optimizations should be validated on both desktop and mobile devices
