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
  // Hidden for now (page kept in src/pages/NewsPage.jsx; route in App.jsx):
  // { label: "News", kind: "route", target: "news" },
  {
    label: "More about COCAP",
    kind: "external",
    href: "https://cocap.us/ai/",
  },
  { label: "Delegate Portal", kind: "route", target: "delegates", pill: true },
];

/**
 * Hero supporters. `logo` is optional — when present it renders as an image,
 * otherwise the name shows as text. With fewer than four they sit in a static
 * row; four or more scroll as a marquee.
 */
export const SUPPORTERS = [
  { name: "Central Oregon Civic Action Project", logo: IMAGES.logos.cocap },
  { name: "BLOOM Project", logo: IMAGES.logos["bloom-project"] },
];

export const POLL_REPORT_URL = "https://report.bloomproject.us/central-oregon-ai";

export const STEPS = [
  {
    id: "steering-committee",
    title: "Steering Committee",
    // TODO: confirm with COCAP — no public description of the committee yet.
    blurb:
      "A steering committee of Central Oregon community members and local partners guided the process: shaping the questions, reviewing materials for balance, and helping make sure the Civic Assembly reflects the whole region.",
    image: IMAGES.process["steering-committee"],
  },
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
];

export const STEP_MS = 5000;

/** Number of seats drawn in the forum-section dot cluster. */
export const DELEGATE_SEATS = 40;

/** Press coverage for the News page. */
export const NEWS = [];

export const PORTAL_CODE = "cocap26";

/**
 * Basic Information tab of the Delegate Portal. Each section has a heading
 * (`h`) and any of: labelled facts (`facts`: a label, its lines of text, and
 * an optional link), paragraphs (`p`), bullets (`ul`), or a YouTube video
 * (`youtube`: the video id from its URL, plus a `title` for screen readers).
 */
export const PORTAL_DOC = [
  {
    h: "Basic Logistics",
    facts: [
      { label: "Date", lines: ["Saturday & Sunday, December 5 & 6, 2026"] },
      {
        label: "Location",
        lines: [
          "Central Oregon Community College",
          "Redmond Technology Education Center",
          "2324 SE College Loop",
          "Redmond, OR 97756",
        ],
        link: {
          href: "https://www.google.com/maps/search/?api=1&query=2324+SE+College+Loop+Redmond+OR+97756",
          label: "Get directions",
        },
      },
    ],
  },
  {
    h: "Orientation Recording",
    youtube: { id: "JzE3dWELVlg", title: "Delegate orientation recording" },
  },
];

export const PORTAL_CONTACT_EMAIL = "info@cocap.us";

/**
 * Schedule tab of the Delegate Portal; null shows "Coming soon". Shape:
 * { day: "Saturday, Dec 5", title: "…", items: [{ time, label, note? }] }
 */
export const SCHEDULE = null;
