import type { Lang } from './i18n';

/** Aspect shape of a collage tile, used to vary the sizes in the grid. */
export type GalleryRatio = 'portrait' | 'landscape' | 'square' | 'tall';

/** A single photo in the sport collage, with a shape and a bilingual alt text. */
export interface GalleryShot {
  id: string;
  image: string;
  ratio: GalleryRatio;
  alt: Record<Lang, string>;
}

const ALT: Record<Lang, string> = { de: 'Kay Weska beim Fußball', en: 'Kay Weska playing football' };

/** Photos for the sport collage. Shapes follow each photo's real orientation. */
export const GALLERY: readonly GalleryShot[] = [
  { id: 'shot-01', image: '/images/gallery/shot-01.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-02', image: '/images/gallery/shot-02.jpg', ratio: 'tall', alt: ALT },
  { id: 'shot-03', image: '/images/gallery/shot-03.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-04', image: '/images/gallery/shot-04.jpg', ratio: 'square', alt: ALT },
  { id: 'shot-05', image: '/images/gallery/shot-05.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-06', image: '/images/gallery/shot-06.jpg', ratio: 'tall', alt: ALT },
  { id: 'shot-25', image: '/images/gallery/shot-25.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-07', image: '/images/gallery/shot-07.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-08', image: '/images/gallery/shot-08.jpg', ratio: 'portrait', alt: ALT },
  { id: 'shot-09', image: '/images/gallery/shot-09.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-10', image: '/images/gallery/shot-10.jpg', ratio: 'square', alt: ALT },
  { id: 'shot-11', image: '/images/gallery/shot-11.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-12', image: '/images/gallery/shot-12.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-13', image: '/images/gallery/shot-13.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-14', image: '/images/gallery/shot-14.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-26', image: '/images/gallery/shot-26.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-15', image: '/images/gallery/shot-15.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-16', image: '/images/gallery/shot-16.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-17', image: '/images/gallery/shot-17.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-18', image: '/images/gallery/shot-18.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-19', image: '/images/gallery/shot-19.jpg', ratio: 'square', alt: ALT },
  { id: 'shot-20', image: '/images/gallery/shot-20.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-21', image: '/images/gallery/shot-21.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-27', image: '/images/gallery/shot-27.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-22', image: '/images/gallery/shot-22.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-23', image: '/images/gallery/shot-23.jpg', ratio: 'landscape', alt: ALT },
  { id: 'shot-24', image: '/images/gallery/shot-24.jpg', ratio: 'landscape', alt: ALT },
];
