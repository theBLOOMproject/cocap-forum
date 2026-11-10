import { IMAGES } from "./images.js";

/* ------------------------------------------------------------------ *
 * Central Oregon Civic Action Project — 2026 Civic Assembly on AI
 * Static content. Sources: cocap.us/ai and
 * report.bloomproject.us/central-oregon-ai
 * ------------------------------------------------------------------ */

export const SITE_NAME = "Central Oregon Civic Assembly on AI";

/**
 * Primary navigation.
 *  - kind "anchor":   a section on the home page. `target` is the element id
 *    and the URL hash (e.g. "/#process").
 *  - kind "route":    a standalone page. `target` is the path segment.
 *  - kind "external": an off-site link opened in a new tab. `href` is the URL.
 */
export const NAV = [
  { label: "Learning Center", kind: "route", target: "learning" },
  { label: "News", kind: "route", target: "news" },
  {
    label: "More about COCAP",
    kind: "external",
    href: "https://cocap.us/ai/",
  },
  { label: "Delegate Portal", kind: "route", target: "delegates", pill: true },
];

/**
 * Hero marquee supporters. `logo` is optional — when present it renders as an
 * image; `placeholder: true` renders an empty logo slot to fill in later.
 */
export const SUPPORTERS = [
  { name: "Central Oregon Civic Action Project", logo: IMAGES.logos.cocap },
  { name: "BLOOM Project", logo: IMAGES.logos["bloom-project"] },
  { name: "Partner logo", placeholder: true },
  { name: "Partner logo", placeholder: true },
  { name: "Partner logo", placeholder: true },
];

export const POLL_REPORT_URL = "https://report.bloomproject.us/central-oregon-ai";

export const STEPS = [
  {
    id: "open-poll",
    title: "Open Poll",
    blurb:
      "From April through June 2026, more than 400 Central Oregonians shared where they stand on AI and its impacts on the region. Rather than a traditional survey, the Open Poll mapped the community’s full opinion landscape: where people agree, where they diverge, and what common ground already exists.",
    image: IMAGES.process["open-poll"],
    link: { href: POLL_REPORT_URL, label: "See the results" },
  },
  {
    id: "community-conversations",
    title: "Community Conversations",
    blurb:
      "Through the summer and fall, small-group conversations — online and in person, hosted by local partners across the region — went deeper into what the Open Poll surfaced. In October, an open, World Café–style Community Café brought even more voices into the process.",
    image: IMAGES.process["community-conversations"],
  },
  {
    id: "steering-committee",
    title: "Steering Committee",
    // TODO: confirm with COCAP — no public description of the committee yet.
    blurb:
      "A steering committee of Central Oregon community members and local partners guided the process: shaping the questions, reviewing materials for balance, and helping make sure the Civic Assembly reflects the whole region.",
    image: IMAGES.process["steering-committee"],
  },
];

export const STEP_MS = 5000;

/** Number of seats drawn in the forum-section dot cluster. */
export const DELEGATE_SEATS = 40;

/**
 * Learning-materials cards. Every card is just: title, url (or file), and the
 * author/source it came from (rendered as "From <source>").
 * Empty until the Learning Center is rebuilt.
 */
export const ACCESS_MATERIALS = [];

/** Press coverage for the News page. */
export const NEWS = [];

export const PORTAL_CODE = "cocap26";

export const PORTAL_DOC = [
  {
    h: "Basic Logistics",
    p: [
      "The Civic Assembly will take place in December 2026. Venue, schedule, meals, and stipend details will be posted here soon.",
    ],
  },
];

export const PORTAL_CONTACT_EMAIL = "info@cocap.us";

/** Day 1 schedule for the Delegate Portal; null shows "Coming soon". */
export const DAY1_SCHEDULE = null;

/** Breakout-group documents for the Delegate Portal. */
export const BREAKOUT_DOCS = [];
