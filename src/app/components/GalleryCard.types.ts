/**
 * Card size variant types for the Enhanced Gallery Card System
 * 
 * These variants define the aspect ratio and visual presentation of gallery cards.
 * Each variant is optimized for different content types and layout compositions.
 */

/**
 * Union type defining all supported card size variants
 * 
 * - `small-portrait`: 2:3 aspect ratio (0.667) - Ideal for tall portrait photos and vertical compositions
 * - `large-portrait`: 3:5 aspect ratio (0.6) - Extra tall portraits, full-body shots, and dramatic vertical framing
 * - `square`: 1:1 aspect ratio (1.0) - Balanced compositions, Instagram-style photos, and centered subjects
 * - `landscape`: 16:9 aspect ratio (1.778) - Wide shots, panoramas, cinematic views, and horizontal compositions
 * - `video`: 16:9 aspect ratio (1.778) - Video content with play indicator overlay
 */
export type CardSizeVariant = 
  | 'small-portrait'
  | 'large-portrait'
  | 'square'
  | 'landscape'
  | 'video';

/**
 * Mapping of card size variants to Tailwind CSS aspect ratio classes
 * 
 * This object provides the CSS class strings needed to apply the correct
 * aspect ratio styling to gallery cards based on their size variant.
 * 
 * @example
 * ```tsx
 * const variant: CardSizeVariant = 'small-portrait';
 * const aspectClass = sizeVariantMap[variant]; // 'aspect-[2/3]'
 * ```
 */
export const sizeVariantMap: Record<CardSizeVariant, string> = {
  /**
   * Small portrait variant with 2:3 aspect ratio
   * Use case: Tall portrait photos, vertical compositions, mobile-optimized content
   */
  'small-portrait': 'aspect-[2/3]',
  
  /**
   * Large portrait variant with 3:5 aspect ratio
   * Use case: Extra tall portraits, full-body shots, dramatic vertical framing
   */
  'large-portrait': 'aspect-[3/5]',
  
  /**
   * Square variant with 1:1 aspect ratio
   * Use case: Balanced compositions, Instagram-style photos, centered subjects
   */
  'square': 'aspect-square',
  
  /**
   * Landscape variant with 16:9 aspect ratio
   * Use case: Wide shots, panoramas, cinematic views, horizontal compositions
   */
  'landscape': 'aspect-[16/9]',
  
  /**
   * Video variant with 16:9 aspect ratio and play indicator
   * Use case: Video content that requires a play button overlay
   */
  'video': 'aspect-[16/9]',
};
