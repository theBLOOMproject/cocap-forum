/* ------------------------------------------------------------------ *
 * Static photo references.
 *
 * Files live in /public/images and are served from the site root, so
 * these paths work in dev, in `vite preview`, and in production.
 * ------------------------------------------------------------------ */

const base = `${import.meta.env.BASE_URL}images`;

/** Marker for an image slot that doesn't have a photo yet. */
const placeholder = (label) => ({ placeholder: true, label });

export const IMAGES = {
  favicon: `${base}/favicon.svg`,

  // Hero — photos that cross-fade inside the rounded frame on the right.
  hero: [
    {
      src: `${base}/IMG_7374.jpg`,
      alt: "Two Central Oregon residents working through ideas together at a table",
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

  // "The Process" accordion — one 16:9 image per step, keyed by step id.
  // Placeholders render as a labelled block until real photos are added.
  process: {
    "open-poll": placeholder("Open Poll image"),
    "community-conversations": placeholder("Community Conversations photo"),
    "steering-committee": placeholder("Steering Committee photo"),
  },
};
