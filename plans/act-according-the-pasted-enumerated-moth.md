# Context

The user wants a premium, single-page birthday website for their girlfriend (birthday June 20). The site should feel like a luxury digital memory album — romantic, cinematic, mobile-first. The spec comes from `src/imports/pasted_text/girlfriend-birthday-site.md`.

The project is a React + Tailwind CSS v4 app with shadcn/ui components. No @make-kits packages. `motion` (Framer Motion API) is already installed.

---

# Recommended Approach

## Packages to Install

- `lenis` — smooth scroll library
- `gsap` — scroll-triggered animations
- `react-responsive-masonry` — Pinterest masonry grid

## Component Architecture

Create these files in `src/app/components/`:

| File | Purpose |
|---|---|
| `FloatingHearts.tsx` | Animated floating hearts particles for hero |
| `HeroSection.tsx` | Full-screen landing with typography, CTA, hearts |
| `FeaturedMemory.tsx` | Edge-to-edge landscape card with glassmorphism overlay, parallax |
| `GalleryCard.tsx` | Individual memory card (image/video) with hover + tap behavior |
| `MemoryGallery.tsx` | Masonry grid container using `react-responsive-masonry` |

`src/app/App.tsx` — root component, initializes Lenis smooth scroll, renders all three sections.

## Section 1 — Hero

- Full viewport height (`min-h-screen`)
- Blush-to-lavender gradient background
- `motion/react` for entrance animations (fade in, slide up on mount)
- `FloatingHearts` component: 12–15 heart emojis animated with `motion` (random positions, float up, looping)
- Elegant serif/display heading: "Happy Birthday, My Love ❤️"
- Subtitle text
- CTA button ("Start the Celebration ✨") — smooth scrolls to gallery on click

## Section 2 — Featured Memory

- Full-width landscape card (`aspect-[16/9]` or `aspect-[3/1]`)
- Unsplash image placeholder (romantic/scenic — sourced via `mcp__plugin_make_unsplash__search_photos`)
- Glassmorphism overlay with date, title, description
- GSAP ScrollTrigger: parallax zoom on scroll-in, fade reveal

## Section 3 — Memory Gallery

- `react-responsive-masonry` with responsive column counts: mobile 1-2, tablet 2-3, desktop 3-5
- 12 sample `memories` data array (easily extendable — no hardcoded count)
- Each memory: `{ id, imageUrl, title, date, type: 'photo'|'video', aspectRatio }`
- Mix of portrait, square, landscape, and video cards

### GalleryCard behavior
- **Desktop hover**: image zoom (scale transform), dark overlay fade-in, title + date slide up
- **Mobile tap**: first tap shows overlay, second tap opens full-screen lightbox dialog (using `Dialog` from shadcn/ui)
- Video cards get a play icon overlay

## Design Tokens (inline Tailwind + CSS vars)

Custom color palette injected via inline styles / CSS vars (not modifying theme.css):
- `--blush`: #f9a8d4
- `--rose`: #f43f5e  
- `--lavender`: #c4b5fd
- `--ivory`: #fefce8
- `--champagne`: #d4a373

Glassmorphism utility: `backdrop-blur-md bg-white/10 border border-white/20`

## Motion Design

- `motion/react` for all entrance + hover animations
- GSAP ScrollTrigger for parallax in Featured Memory section
- Lenis initialized in App.tsx `useEffect`, connected to GSAP ticker

## Images

Source placeholder images from Unsplash (romantic couples, nature, travel) using `mcp__plugin_make_unsplash__search_photos`. Use `ImageWithFallback` component from `src/app/components/figma/ImageWithFallback.tsx`.

---

# Critical Files

- **Edit:** `src/app/App.tsx`
- **Create:** `src/app/components/FloatingHearts.tsx`
- **Create:** `src/app/components/HeroSection.tsx`
- **Create:** `src/app/components/FeaturedMemory.tsx`
- **Create:** `src/app/components/GalleryCard.tsx`
- **Create:** `src/app/components/MemoryGallery.tsx`
- **Reference:** `src/app/components/figma/ImageWithFallback.tsx` (use, don't modify)
- **Reference:** `src/app/components/ui/dialog.tsx` (use for lightbox)
- **Reference:** `src/app/components/ui/button.tsx` (use for CTA)

---

# Verification

1. Preview renders all 3 sections on load
2. Hero floating hearts animate continuously
3. Scroll into Featured Memory shows parallax/fade effect
4. Gallery cards show hover overlay on desktop
5. Gallery cards show tap-overlay then lightbox on mobile
6. Layout is responsive: 1-2 cols mobile, 2-3 tablet, 3-5 desktop
