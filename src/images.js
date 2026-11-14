/* ------------------------------------------------------------------ *
 * Static photo references.
 *
 * Files live in /public/images and are served from the site root, so
 * these paths work in dev, in `vite preview`, and in production.
 * ------------------------------------------------------------------ */

const base = `${import.meta.env.BASE_URL}images`;

export const IMAGES = {
  favicon: `${base}/favicon.svg`,

  // Hero — photos that cross-fade inside the rounded frame on the right.
  hero: [
    {
      src: `${base}/IMG_7406.jpg`,
      alt: "A Central Oregon resident sharing her perspective during a community conversation",
    },
    {
      src: `${base}/IMG_7409.jpg`,
      alt: "A graphic recorder illustrating a community conversation on a large wall chart",
    },
    {
      src: `${base}/IMG_7389.jpg`,
      alt: "Residents smiling and talking during a community conversation",
    },
  ],

  // Supporter logos for the hero marquee. Files live in /public/images/logos.
  logos: {
    cocap: `${base}/logos/cocap.png`,
    "bloom-project": `${base}/logos/bloom.png`,
  },

  // "The Process" accordion — an optional 16:9 image per step, keyed by
  // step id. Steps without an entry show no image.
  process: {
    "steering-committee": {
      src: `${base}/IMG_7374.jpg`,
      alt: "Two Central Oregon residents working through ideas together at a table",
    },
    "community-conversations": {
      src: `${base}/IMG_7394.jpg`,
      alt: "A Central Oregon resident speaking during a community conversation",
    },
  },
};
