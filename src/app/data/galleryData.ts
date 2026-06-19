/// <reference types="vite/client" />
/**
 * galleryData.ts — Auto-generated gallery content.
 *
 * All memories are derived from filenames like "3rd June 2024.jpg".
 * The gallery automatically discovers files from public/gallery/ and sorts them chronologically.
 */

import { CardSizeVariant } from '../components/GalleryCard.types';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface MemoryItem {
  id: string;
  filename: string;
  /** URL served from public/gallery/ */
  url: string;
  /** Parsed Date object (used for sorting) */
  date: Date;
  /** Pretty display string, e.g. "3 June 2024" */
  displayDate: string;
  type: 'photo' | 'video';
  sizeVariant: CardSizeVariant;
  /** Optional title from metadata map */
  title: string;
  /** Optional description from metadata map */
  description: string;
}

export interface MonthGroup {
  /** e.g. "April 2025 ❤️" */
  label: string;
  /** Sortable key, e.g. "2025-04" */
  key: string;
  memories: MemoryItem[];
}

// FeaturedMemoryData interface – used for the featured banner
export interface FeaturedMemoryData {
  imageUrl: string;
  date: string;
  title: string;
  description: string;
}

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PHOTO_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov']);

// ─────────────────────────────────────────────────────────
// Date Parsing Utilities
// ─────────────────────────────────────────────────────────

/**
 * Normalize a month name to handle common typos.
 */
function normalizeMonth(month: string): string {
  return month.toLowerCase().replace('febrary', 'february');
}

/**
 * Parse a filename like "3rd June 2024.jpg" into a Date.
 * Supports: 1st, 2nd, 3rd, 4th, 21st, 22nd, 23rd, 31st.
 * Returns null if the filename doesn't match the expected pattern.
 */
export function parseFilenameDate(filename: string): Date | null {
  const nameOnly = filename.replace(/\.[^/.]+$/, '');

  const match = nameOnly.match(
    /^(\d{1,2})(?:st|nd|rd|th)\s+([A-Za-z]+)\s+(\d{4})(?:\s*-\s*\d+)?$/i
  );

  if (!match) return null;

  const day = parseInt(match[1], 10);
  const monthStr = normalizeMonth(match[2]);
  const year = parseInt(match[3], 10);

  const month = MONTH_MAP[monthStr];
  if (month === undefined) return null;

  const date = new Date(year, month, day);
  // Ensure the date components match (invalid dates like 31 June become July 1st)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Format a Date into a display string like "3 June 2024 ❤️".
 */
export function formatDisplayDate(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year} ❤️`;
}

/**
 * Format a Date into "Month Year" like "June 2024".
 */
function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()} ❤️`;
}

/**
 * Create a sortable key like "2024-06" from a Date.
 */
function monthSortKey(date: Date): string {
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${date.getFullYear()}-${m}`;
}

/**
 * Extract the base name from a filename (without extension or "-1" suffix).
 */
function getBaseName(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/\s*-\s*\d+$/, '')
    .trim();
}

/**
 * Determine if a file is a photo or video based on its extension.
 */
function getMediaType(filename: string): 'photo' | 'video' | null {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (PHOTO_EXTENSIONS.has(ext)) return 'photo';
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  return null;
}

/**
 * Assign a sizeVariant to make the masonry visually interesting.
 */
function assignSizeVariant(index: number, type: 'photo' | 'video'): CardSizeVariant {
  if (type === 'video') return 'video';

  const photoVariants: CardSizeVariant[] = [
    'square',
    'small-portrait',
    'landscape',
    'large-portrait',
    'square',
    'small-portrait',
    'square',
    'landscape',
  ];

  return photoVariants[index % photoVariants.length];
}

// ─────────────────────────────────────────────────────────
// Dynamic File Discovery (Vite)
// ─────────────────────────────────────────────────────────

// Import all media files – Vite will replace this with an object whose keys are the URLs.
const galleryFiles = import.meta.glob<{ default: string }>('/public/gallery/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Import all JSON metadata files eagerly.
const metadataFiles = import.meta.glob<{ default: { title?: string; description?: string } }>('/public/gallery/*.json', {
  eager: true,
});

/** Convert glob map keys to clean filenames. */
function getGalleryFilenames(): string[] {
  return Object.keys(galleryFiles)
    .map((key) => key.replace('/public/gallery/', ''))
    .filter((filename) => getMediaType(filename) !== null)
    .sort();
}

/** Retrieve metadata for a given base filename (without extension). */
function getMetadata(baseName: string): { title?: string; description?: string } {
  const path = `/public/gallery/${baseName}.json`;
  const mod = metadataFiles[path];
  return mod?.default ?? {};
}

// ─────────────────────────────────────────────────────────
// Build sorted memories array
// ─────────────────────────────────────────────────────────

function buildMemories(): MemoryItem[] {
  const items: MemoryItem[] = [];
  let photoIndex = 0;

  for (const filename of getGalleryFilenames()) {
    const date = parseFilenameDate(filename);
    if (!date) continue;

    const type = getMediaType(filename);
    if (!type) continue;

    const baseName = getBaseName(filename);
    const meta = getMetadata(baseName);

    items.push({
      id: filename,
      filename,
      url: `/gallery/${encodeURIComponent(filename)}`,
      date,
      displayDate: formatDisplayDate(date),
      type,
      sizeVariant: assignSizeVariant(type === 'photo' ? photoIndex : 0, type),
      title: meta.title ?? '',
      description: meta.description ?? '',
    });

    if (type === 'photo') photoIndex++;
  }

  // Chronological sort (earliest → latest)
  items.sort((a, b) => a.date.getTime() - b.date.getTime());

  return items;
}

/** All memories sorted chronologically. */
export const memories: MemoryItem[] = buildMemories();

/** Featured memory – automatically the latest entry. */
export const featuredMemory: FeaturedMemoryData = (() => {
  const latest = memories[memories.length - 1];
  if (!latest) {
    return { imageUrl: '', date: '', title: '', description: '' };
  }
  return {
    imageUrl: latest.url,
    date: latest.displayDate,
    title: latest.title || latest.displayDate,
    description: latest.description,
  };
})();

// ─────────────────────────────────────────────────────────
// Group by month for timeline separators
// ─────────────────────────────────────────────────────────

export function groupMemoriesByMonth(): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();

  for (const mem of memories) {
    const key = monthSortKey(mem.date);
    if (!groups.has(key)) {
      groups.set(key, {
        label: formatMonthYear(mem.date),
        key,
        memories: [],
      });
    }
    groups.get(key)!.memories.push(mem);
  }

  return Array.from(groups.values());
}

// ─────────────────────────────────────────────────────────
// Love Letter Content
// ─────────────────────────────────────────────────────────

export const loveLetterContent: LoveLetterData = {
  sectionTitle: 'Things I Never Say Enough ❤️',
  recipientName: 'My Love',
  paragraphs: [
    "From the moment you came into my life, everything changed. You brought light into my darkest days and turned ordinary moments into extraordinary memories. Every smile, every laugh, every quiet moment with you feels like a gift I never knew I needed.",
    "You've shown me what it means to be truly seen and loved. Your kindness, your strength, and your beautiful soul inspire me every single day. You've made me want to be a better person, not because I have to, but because you make me believe I can be.",
    "I love the way you laugh at my silly jokes, even the terrible ones. I love how you make me feel safe enough to be completely myself. I love your passion, your dreams, and the way you see beauty in the smallest things. You are extraordinary in ways you don't even realize.",
    "These photos we've collected aren't just memories – they're proof of a love story I'm so grateful to be part of. Every adventure, every quiet evening, every challenge we've faced together has only made my love for you grow stronger. You are my favorite chapter in this story of life.",
    "I know I don't always find the right words to express how much you mean to me. But I want you to know: you are my best friend, my partner, my home. Every day with you is a day I'm thankful for. Every moment by your side is a moment I treasure. You make everything better just by being you.",
  ],
  closingLine: 'Thank you for choosing me every day. Thank you for being exactly who you are.',
  signature: 'Forever Yours ❤️',
  secretMessage:
    'You are my favorite person, my favorite memory, and my favorite chapter. In every lifetime, in every universe, I would choose you. Always. 💕',
  secretButtonText: 'Open Secret Message ❤️',
};
