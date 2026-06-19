/**
 * Unit tests for CardSizeVariant type validation
 * 
 * **Validates: Requirements 10.5**
 * 
 * These tests verify that:
 * 1. All 5 variant values ('small-portrait', 'large-portrait', 'square', 'landscape', 'video') are accepted
 * 2. Invalid values are rejected at compile time through TypeScript type checking
 * 3. The sizeVariantMap correctly maps all variants to their corresponding CSS classes
 */

import { describe, it, expect, expectTypeOf } from 'vitest';
import { CardSizeVariant, sizeVariantMap } from './GalleryCard.types';

describe('CardSizeVariant Type Validation', () => {
  describe('Valid variant values', () => {
    it('should accept "small-portrait" as valid CardSizeVariant', () => {
      const variant: CardSizeVariant = 'small-portrait';
      expect(variant).toBe('small-portrait');
      expectTypeOf(variant).toEqualTypeOf<CardSizeVariant>();
    });

    it('should accept "large-portrait" as valid CardSizeVariant', () => {
      const variant: CardSizeVariant = 'large-portrait';
      expect(variant).toBe('large-portrait');
      expectTypeOf(variant).toEqualTypeOf<CardSizeVariant>();
    });

    it('should accept "square" as valid CardSizeVariant', () => {
      const variant: CardSizeVariant = 'square';
      expect(variant).toBe('square');
      expectTypeOf(variant).toEqualTypeOf<CardSizeVariant>();
    });

    it('should accept "landscape" as valid CardSizeVariant', () => {
      const variant: CardSizeVariant = 'landscape';
      expect(variant).toBe('landscape');
      expectTypeOf(variant).toEqualTypeOf<CardSizeVariant>();
    });

    it('should accept "video" as valid CardSizeVariant', () => {
      const variant: CardSizeVariant = 'video';
      expect(variant).toBe('video');
      expectTypeOf(variant).toEqualTypeOf<CardSizeVariant>();
    });

    it('should accept all 5 variants in an array', () => {
      const variants: CardSizeVariant[] = [
        'small-portrait',
        'large-portrait',
        'square',
        'landscape',
        'video'
      ];
      
      expect(variants).toHaveLength(5);
      expect(variants).toContain('small-portrait');
      expect(variants).toContain('large-portrait');
      expect(variants).toContain('square');
      expect(variants).toContain('landscape');
      expect(variants).toContain('video');
    });
  });

  describe('Type safety and compile-time validation', () => {
    it('should enforce CardSizeVariant type at compile time', () => {
      // These type checks ensure TypeScript enforces the union type
      expectTypeOf<CardSizeVariant>().toEqualTypeOf<
        'small-portrait' | 'large-portrait' | 'square' | 'landscape' | 'video'
      >();
    });

    it('should only allow valid variant strings', () => {
      // Valid assignment - should compile
      const validVariant: CardSizeVariant = 'square';
      expect(validVariant).toBe('square');

      // The following would cause TypeScript compilation errors (demonstrating compile-time rejection):
      // @ts-expect-error - Invalid value should not be assignable to CardSizeVariant
      const invalidVariant1: CardSizeVariant = 'invalid';
      
      // @ts-expect-error - Number is not assignable to CardSizeVariant
      const invalidVariant2: CardSizeVariant = 123;
      
      // @ts-expect-error - Empty string is not a valid CardSizeVariant
      const invalidVariant3: CardSizeVariant = '';
      
      // @ts-expect-error - null is not assignable to CardSizeVariant
      const invalidVariant4: CardSizeVariant = null;
      
      // @ts-expect-error - undefined is not assignable to CardSizeVariant
      const invalidVariant5: CardSizeVariant = undefined;

      // Suppress unused variable warnings for the error demonstration
      void invalidVariant1;
      void invalidVariant2;
      void invalidVariant3;
      void invalidVariant4;
      void invalidVariant5;
    });

    it('should enforce type safety in function parameters', () => {
      const acceptsVariant = (variant: CardSizeVariant): string => {
        return `Variant: ${variant}`;
      };

      // Valid calls
      expect(acceptsVariant('small-portrait')).toBe('Variant: small-portrait');
      expect(acceptsVariant('large-portrait')).toBe('Variant: large-portrait');
      expect(acceptsVariant('square')).toBe('Variant: square');
      expect(acceptsVariant('landscape')).toBe('Variant: landscape');
      expect(acceptsVariant('video')).toBe('Variant: video');

      // The following would cause TypeScript compilation errors:
      // @ts-expect-error - Invalid variant should not be accepted
      acceptsVariant('portrait');
      
      // @ts-expect-error - Typo in variant name should not be accepted
      acceptsVariant('sqaure');
    });

    it('should enforce type safety in object properties', () => {
      interface CardConfig {
        id: string;
        variant: CardSizeVariant;
      }

      // Valid object
      const validConfig: CardConfig = {
        id: '1',
        variant: 'square'
      };
      expect(validConfig.variant).toBe('square');

      // The following would cause TypeScript compilation errors:
      // @ts-expect-error - Invalid variant in object property
      const invalidConfig: CardConfig = {
        id: '2',
        variant: 'medium'
      };
      
      void invalidConfig;
    });
  });

  describe('sizeVariantMap validation', () => {
    it('should have entries for all 5 CardSizeVariant values', () => {
      const variants: CardSizeVariant[] = [
        'small-portrait',
        'large-portrait',
        'square',
        'landscape',
        'video'
      ];

      variants.forEach(variant => {
        expect(sizeVariantMap).toHaveProperty(variant);
        expect(typeof sizeVariantMap[variant]).toBe('string');
      });
    });

    it('should map "small-portrait" to "aspect-[2/3]"', () => {
      expect(sizeVariantMap['small-portrait']).toBe('aspect-[2/3]');
    });

    it('should map "large-portrait" to "aspect-[3/5]"', () => {
      expect(sizeVariantMap['large-portrait']).toBe('aspect-[3/5]');
    });

    it('should map "square" to "aspect-square"', () => {
      expect(sizeVariantMap['square']).toBe('aspect-square');
    });

    it('should map "landscape" to "aspect-[16/9]"', () => {
      expect(sizeVariantMap['landscape']).toBe('aspect-[16/9]');
    });

    it('should map "video" to "aspect-[16/9]"', () => {
      expect(sizeVariantMap['video']).toBe('aspect-[16/9]');
    });

    it('should have exactly 5 entries in sizeVariantMap', () => {
      expect(Object.keys(sizeVariantMap)).toHaveLength(5);
    });

    it('should have type-safe keys in sizeVariantMap', () => {
      // Verify that sizeVariantMap keys are typed as CardSizeVariant
      expectTypeOf(sizeVariantMap).toEqualTypeOf<Record<CardSizeVariant, string>>();
    });
  });

  describe('Exhaustive type checking', () => {
    it('should handle all variants in switch statement without default case', () => {
      const getAspectRatioDescription = (variant: CardSizeVariant): string => {
        // This switch statement demonstrates exhaustive checking
        // TypeScript will error if we miss any variant
        switch (variant) {
          case 'small-portrait':
            return '2:3 aspect ratio';
          case 'large-portrait':
            return '3:5 aspect ratio';
          case 'square':
            return '1:1 aspect ratio';
          case 'landscape':
            return '16:9 aspect ratio';
          case 'video':
            return '16:9 aspect ratio with video indicator';
        }
      };

      expect(getAspectRatioDescription('small-portrait')).toBe('2:3 aspect ratio');
      expect(getAspectRatioDescription('large-portrait')).toBe('3:5 aspect ratio');
      expect(getAspectRatioDescription('square')).toBe('1:1 aspect ratio');
      expect(getAspectRatioDescription('landscape')).toBe('16:9 aspect ratio');
      expect(getAspectRatioDescription('video')).toBe('16:9 aspect ratio with video indicator');
    });
  });
});
