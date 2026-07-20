import type { Lang } from './i18n';

/** Aspect shape of a collage tile, used to vary the sizes in the grid. */
export type GalleryRatio = 'portrait' | 'landscape' | 'square' | 'tall';

/** A single photo in the sport collage, with a shape and a bilingual caption. */
export interface GalleryShot {
  id: string;
  image: string;
  ratio: GalleryRatio;
  caption: Record<Lang, string>;
}

/** Placeholder shots. Swap the image paths for real photos in public/images/gallery/. */
export const GALLERY: readonly GalleryShot[] = [
  { id: 'shot-01', image: '/images/gallery/shot-01.svg', ratio: 'portrait', caption: { de: 'Heimspiel, 2024', en: 'Home game, 2024' } },
  { id: 'shot-02', image: '/images/gallery/shot-02.svg', ratio: 'landscape', caption: { de: 'Kabine, 2024', en: 'Locker room, 2024' } },
  { id: 'shot-03', image: '/images/gallery/shot-03.svg', ratio: 'square', caption: { de: 'Auswärts, 2023', en: 'Away, 2023' } },
  { id: 'shot-04', image: '/images/gallery/shot-04.svg', ratio: 'tall', caption: { de: 'Zweikampf, 2023', en: 'Duel, 2023' } },
  { id: 'shot-05', image: '/images/gallery/shot-05.svg', ratio: 'landscape', caption: { de: 'Torjubel, 2024', en: 'Celebration, 2024' } },
  { id: 'shot-06', image: '/images/gallery/shot-06.svg', ratio: 'portrait', caption: { de: 'Auszeit, 2022', en: 'Time out, 2022' } },
  { id: 'shot-07', image: '/images/gallery/shot-07.svg', ratio: 'square', caption: { de: 'Flutlicht, 2024', en: 'Floodlights, 2024' } },
  { id: 'shot-08', image: '/images/gallery/shot-08.svg', ratio: 'tall', caption: { de: 'Nach dem Spiel, 2023', en: 'After the game, 2023' } },
];
