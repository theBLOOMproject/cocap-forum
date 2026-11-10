import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ------------------------------------------------------------------ *
 * Utah Common Ground — Solutions Forum
 * Prototype per ucg-site-spec.md
 * ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');

.ucg {
  --cream: #FDF1E3;
  --cream-deep: #FBE7D2;
  --orange: #EE7B3C;
  --orange-soft: #F5B48A;
  --orange-tint: rgba(238,123,60,0.10);
  --olive: #5F7042;
  --brown: #3B1E12;
  --brown-mute: rgba(59,30,18,0.55);
  --white: #ffffff;

  font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif;
  color: var(--brown);
  background: var(--cream);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.ucg *, .ucg *::before, .ucg *::after { box-sizing: border-box; }
/* :where() zeroes out this reset's specificity. Written as a plain
   ".ucg button" selector (0,1,1) it outranked single-class rules like
   .ucg-burger (0,1,0) and silently stripped their backgrounds. */
:where(.ucg button) { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
:where(.ucg input) { font-family: inherit; }
.ucg :focus-visible { outline: 3px solid var(--brown); outline-offset: 3px; border-radius: 4px; }

/* ---------- top rule + nav ---------- */
.ucg-rule { position: fixed; top: 0; left: 0; right: 0; height: 6px; background: var(--orange); z-index: 60; }
.ucg-nav {
  position: fixed; top: 6px; left: 0; right: 0; z-index: 55;
  display: flex; justify-content: flex-end; align-items: center; gap: 44px;
  padding: 26px 56px;
  transition: color 240ms ease;
}
.ucg-nav button { font-size: 17px; font-weight: 700; letter-spacing: -0.01em; color: var(--olive); padding: 4px 0; }
.ucg-nav button:hover { color: var(--orange); }
.ucg-nav.is-invert button { color: rgba(255,255,255,0.92); }
.ucg-nav.is-invert button:hover { color: #fff; }
.ucg-nav.is-invert :focus-visible { outline-color: #fff; }
.ucg-nav .ucg-nav-current { color: var(--orange) !important; }
.ucg-navtoggle { display: none; }

/* ---------- mobile menu ---------- */
.ucg-burger {
  position: fixed; top: 0; right: 0; z-index: 80;
  width: 60px; height: 60px; border-radius: 0;
  background: var(--orange); display: grid; place-items: center;
}
.ucg-burger-icon { position: relative; width: 24px; height: 16px; display: block; }
.ucg-burger-icon i {
  position: absolute; left: 0; width: 100%; height: 2.5px; border-radius: 2px;
  background: #fff; transition: transform 320ms cubic-bezier(0.32,0.72,0.24,1), opacity 180ms ease;
}
.ucg-burger-icon i:nth-child(1) { top: 0; }
.ucg-burger-icon i:nth-child(2) { top: 6.75px; }
.ucg-burger-icon i:nth-child(3) { top: 13.5px; }
.ucg-burger-icon.is-open i:nth-child(1) { transform: translateY(6.75px) rotate(45deg); }
.ucg-burger-icon.is-open i:nth-child(2) { opacity: 0; transform: scaleX(0.4); }
.ucg-burger-icon.is-open i:nth-child(3) { transform: translateY(-6.75px) rotate(-45deg); }

.ucg-sheet {
  position: fixed; inset: 0; z-index: 70; background: var(--orange);
  display: flex; align-items: center; padding: 104px 28px 48px;
  overflow: hidden;
  transform: translateY(-100%); visibility: hidden;
  transition: transform 480ms cubic-bezier(0.32,0.72,0.24,1), visibility 0s linear 480ms;
}
.ucg-sheet.is-open {
  transform: translateY(0); visibility: visible;
  transition: transform 480ms cubic-bezier(0.32,0.72,0.24,1), visibility 0s linear 0s;
}
.ucg-sheet-nav { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 8px; width: 100%; }
.ucg-sheet-nav button {
  font-size: clamp(34px, 9.5vw, 52px); font-weight: 800; line-height: 1.05;
  letter-spacing: -0.038em; color: #fff; text-align: left; padding: 8px 0;
  overflow-wrap: break-word;
  opacity: 0; transform: translateY(-18px);
  transition: opacity 300ms ease, transform 420ms cubic-bezier(0.32,0.72,0.24,1);
}
.ucg-sheet.is-open .ucg-sheet-nav button { opacity: 1; transform: translateY(0); }
.ucg-sheet.is-open .ucg-sheet-nav button:nth-child(1) { transition-delay: 160ms; }
.ucg-sheet.is-open .ucg-sheet-nav button:nth-child(2) { transition-delay: 220ms; }
.ucg-sheet.is-open .ucg-sheet-nav button:nth-child(3) { transition-delay: 280ms; }
.ucg-sheet.is-open .ucg-sheet-nav button:nth-child(4) { transition-delay: 340ms; }
.ucg-sheet-nav button.ucg-nav-current { color: var(--brown); }
.ucg-sheet :focus-visible { outline-color: #fff; }
/* flush to the corner, so pull the focus ring inward instead of outward */
.ucg-burger:focus-visible { outline-color: #fff; outline-offset: -6px; border-radius: 0; }

/* ---------- ambient concentric rings ---------- */
.ucg-rings { position: absolute; pointer-events: none; z-index: 0; }
.ucg-rings circle { fill: none; }

/* ---------- section shell ---------- */
.ucg-section { position: relative; min-height: 100vh; display: flex; align-items: center; padding: 132px 56px 88px; }
.ucg-inner { position: relative; z-index: 2; width: 100%; max-width: 1360px; margin: 0 auto; }
.ucg-split { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
/* grid items default to min-width:auto, which lets carousels and long words
   push past the column and bleed out of the section */
.ucg-split > * { min-width: 0; }

/* ---------- type ---------- */
.ucg-display, .ucg-sub, .ucg-body, .ucg-card-title, .ucg-card-blurb {
  overflow-wrap: break-word; word-break: normal;
}
.ucg-display {
  font-size: clamp(40px, 5.2vw, 74px); font-weight: 800; line-height: 1.02;
  letter-spacing: -0.035em; color: var(--olive); margin: 0;
}
.ucg-display .o { color: var(--orange); }
.ucg-sub { font-size: clamp(22px, 2.3vw, 32px); font-weight: 700; line-height: 1.22; letter-spacing: -0.02em; color: var(--olive); margin: 26px 0 0; }
.ucg-sub .o { color: var(--orange); }
.ucg-body { font-size: clamp(17px, 1.35vw, 21px); line-height: 1.5; margin: 24px 0 0; max-width: 30ch; }
.ucg-eyebrow { font-size: 13px; font-weight: 800; letter-spacing: 0.13em; text-transform: uppercase; color: #C2724C; margin: 0; }
.ucg-link { display: inline-flex; align-items: center; gap: 9px; margin-top: 26px; font-size: clamp(17px,1.3vw,20px); font-weight: 500; color: var(--orange); }
.ucg-link span { transition: transform 200ms ease; }
.ucg-link:hover span { transform: translateX(5px); }

/* ---------- hero ---------- */
.ucg-hero { padding-right: 0; }
.ucg-hero .ucg-split { grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: end; }
.ucg-hero-copy { padding-bottom: 40px; }
.ucg-pill {
  display: inline-block; background: var(--orange); color: #fff;
  font-size: clamp(17px,1.5vw,23px); font-weight: 700; letter-spacing: -0.01em;
  padding: 13px 28px; border-radius: 999px; margin-bottom: 30px;
}
.ucg-hero-media {
  position: relative; height: 74vh; min-height: 440px;
  border-radius: 20px 0 0 20px; overflow: hidden;
  background: linear-gradient(150deg, #E8D3BC 0%, #DCC0A4 55%, #C9A484 100%);
}
.ucg-ph-tag {
  position: absolute; bottom: 18px; left: 20px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(59,30,18,0.42);
}
.ucg-ph-figures { position: absolute; inset: 0; opacity: 0.5; }

/* ---------- logo marquee ---------- */
.ucg-marquee { margin-top: 52px; max-width: 620px; overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.ucg-marquee-track { display: flex; width: max-content; animation: ucg-slide 26s linear infinite; }
.ucg-marquee:hover .ucg-marquee-track { animation-play-state: paused; }
.ucg-logo {
  flex: 0 0 auto; display: flex; align-items: center; justify-content: center;
  height: 46px; padding: 0 34px;
  font-size: 15px; font-weight: 800; letter-spacing: 0.02em; line-height: 1.1;
  text-align: center; color: var(--brown); opacity: 0.62; white-space: pre-line;
}
@keyframes ucg-slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ---------- process accordion ---------- */
.ucg-stack { display: flex; flex-direction: column; gap: 22px; }
.ucg-card {
  position: relative; background: #fff; border-radius: 24px;
  box-shadow: 0 10px 34px rgba(190,120,70,0.12);
  overflow: hidden; text-align: left; width: 100%;
  transition: box-shadow 260ms ease;
}
.ucg-card.is-open { box-shadow: 0 16px 46px rgba(190,120,70,0.20); }
.ucg-card-progress {
  position: absolute; top: 0; left: 0; height: 4px; background: var(--orange); z-index: 3;
  transition: opacity 200ms ease;
}
.ucg-card-pad { padding: 26px 30px; }
.ucg-card-head {
  display: block; width: 100%; text-align: left; padding: 26px 30px;
  transition: padding-bottom 400ms cubic-bezier(0.32,0.72,0.24,1);
}
.ucg-card.is-open .ucg-card-head { padding-bottom: 8px; }
.ucg-card-head:disabled { cursor: default; }
.ucg-card-title { font-size: clamp(18px,1.5vw,22px); font-weight: 600; letter-spacing: -0.015em; color: var(--brown); margin: 0; transition: color 260ms ease; }
.ucg-card.is-open .ucg-card-title { color: var(--orange); }

/* height animation: 0fr -> 1fr grows and shrinks the card itself */
.ucg-card-reveal {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows 520ms cubic-bezier(0.32,0.72,0.24,1);
}
.ucg-card.is-open .ucg-card-reveal { grid-template-rows: 1fr; }
.ucg-card-reveal > div { overflow: hidden; min-height: 0; }
.ucg-card-inner {
  padding: 0 30px 28px;
  opacity: 0; transform: translateY(-10px);
  transition: opacity 260ms ease, transform 380ms cubic-bezier(0.32,0.72,0.24,1);
}
.ucg-card.is-open .ucg-card-inner {
  opacity: 1; transform: translateY(0);
  transition-delay: 140ms;
}
.ucg-card-blurb { font-size: 16px; line-height: 1.45; margin: 0; max-width: 44ch; }
.ucg-card-img {
  margin-top: 20px; aspect-ratio: 16 / 9; border-radius: 12px; position: relative;
  background: linear-gradient(140deg, #EBD8C2, #D8BA9C);
}

/* ---------- process mobile carousel ---------- */
/* The track is clipped at the screen edges (negative margin cancels the
   section's 20px padding), and the inset lives on the cells instead — so the
   next card is fully off-screen at rest and cannot peek. */
.ucg-carousel { overflow: hidden; margin: 0 -20px; }
.ucg-carousel-track { display: flex; transition: transform 460ms cubic-bezier(0.22,0.61,0.36,1); }
.ucg-carousel-cell { flex: 0 0 100%; min-width: 0; padding: 0 20px; }
.ucg-dots { display: flex; justify-content: center; gap: 9px; margin-top: 22px; }
.ucg-dots button { width: 9px; height: 9px; border-radius: 999px; background: rgba(59,30,18,0.22); padding: 0; }
.ucg-dots button.is-on { background: var(--orange); width: 26px; }

/* ---------- forum dot cluster ---------- */
.ucg-cluster { position: relative; width: 100%; max-width: 520px; margin: 0 auto; }
.ucg-cluster svg { width: 100%; height: auto; display: block; overflow: visible; }
.ucg-node { fill: var(--orange-soft); transition: fill 160ms ease, transform 160ms ease; cursor: pointer; }
.ucg-node.is-on { fill: var(--orange); }
.ucg-tip {
  position: absolute; z-index: 6; pointer-events: none;
  background: #2B140C; color: #fff; border-radius: 7px;
  padding: 9px 12px; font-size: 13px; font-weight: 500; line-height: 1.35;
  box-shadow: 0 8px 20px rgba(43,20,12,0.28); white-space: nowrap;
  transform: translate(-6px, -100%);
}
.ucg-tip-lo { transform: translate(-6px, 8px); }
.ucg-hint { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--brown-mute); text-align: center; margin: 26px 0 0; }

/* ---------- signup ---------- */
.ucg-signup { background: var(--orange); color: #fff; text-align: center; }
.ucg-signup .ucg-display { color: #fff; }
.ucg-signup-inner { position: relative; z-index: 2; max-width: 660px; margin: 0 auto; }
.ucg-signup-sub { font-size: clamp(18px,1.6vw,23px); line-height: 1.45; color: rgba(255,255,255,0.94); margin: 22px 0 0; }
.ucg-field { position: relative; margin: 44px auto 0; max-width: 600px; }
.ucg-field input {
  width: 100%; height: 78px; border-radius: 999px; border: 3px solid transparent;
  background: #fff; padding: 0 92px 0 34px; font-size: 19px; color: var(--brown);
  transition: border-color 180ms ease;
}
.ucg-field input::placeholder { color: rgba(59,30,18,0.5); }
.ucg-field.is-bad input { border-color: #7A2E12; }
.ucg-field button {
  position: absolute; right: 12px; top: 12px; width: 54px; height: 54px; border-radius: 999px;
  background: var(--brown); color: #fff; display: grid; place-items: center;
  transition: transform 180ms ease, background 180ms ease;
}
.ucg-field button:hover { transform: scale(1.06); background: #2B140C; }
.ucg-msg { min-height: 24px; margin: 16px 0 0; font-size: 16px; font-weight: 600; }
.ucg-msg.is-bad { color: #6E2A10; }
.ucg-msg.is-ok { color: #fff; }
.ucg-signup .ucg-link { color: #fff; font-size: clamp(17px,1.4vw,21px); margin-top: 46px; }

/* ---------- subpages ---------- */
.ucg-page { padding: 176px 56px 110px; position: relative; }
.ucg-page-inner { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }
.ucg-back { font-size: 15px; font-weight: 700; color: var(--brown-mute); margin-bottom: 26px; display: inline-flex; gap: 8px; }
.ucg-back:hover { color: var(--orange); }
.ucg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 52px; }
.ucg-source {
  display: block; text-align: left; background: #fff; border-radius: 20px; padding: 26px;
  box-shadow: 0 8px 26px rgba(190,120,70,0.11); transition: transform 200ms ease, box-shadow 200ms ease;
}
.ucg-source:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(190,120,70,0.18); }
.ucg-tag { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.11em; text-transform: uppercase; color: var(--orange); background: var(--orange-tint); padding: 5px 10px; border-radius: 999px; }
.ucg-source h3 { font-size: 19px; font-weight: 700; letter-spacing: -0.015em; line-height: 1.25; color: var(--olive); margin: 16px 0 8px; }
.ucg-source p { font-size: 14px; color: var(--brown-mute); margin: 0; }

.ucg-gate { max-width: 460px; margin: 40px auto 0; background: #fff; border-radius: 24px; padding: 38px; box-shadow: 0 14px 40px rgba(190,120,70,0.14); text-align: center; }
.ucg-gate h2 { font-size: 27px; font-weight: 800; letter-spacing: -0.025em; color: var(--olive); margin: 0 0 10px; }
.ucg-gate p { font-size: 15px; color: var(--brown-mute); margin: 0 0 24px; line-height: 1.45; }
.ucg-gate input { width: 100%; height: 56px; border-radius: 999px; border: 2px solid rgba(59,30,18,0.16); padding: 0 22px; font-size: 16px; }
.ucg-gate input.is-bad { border-color: #B4441C; }
.ucg-gate .ucg-btn { margin-top: 14px; width: 100%; height: 56px; border-radius: 999px; background: var(--orange); color: #fff; font-size: 17px; font-weight: 700; }
.ucg-gate .ucg-btn:hover { background: #DD6A2C; }
.ucg-gate-note { font-size: 12px; color: var(--brown-mute); margin: 18px 0 0; }
.ucg-doc { margin-top: 52px; }
.ucg-doc section { padding: 32px 0; border-top: 1px solid rgba(59,30,18,0.12); }
.ucg-doc h2 { font-size: clamp(24px,2.2vw,32px); font-weight: 800; letter-spacing: -0.03em; color: var(--olive); margin: 0 0 14px; }
.ucg-doc p { font-size: 17px; line-height: 1.55; margin: 0 0 10px; max-width: 62ch; }
.ucg-doc ul { margin: 0; padding-left: 22px; }
.ucg-doc li { font-size: 17px; line-height: 1.6; margin-bottom: 6px; }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .ucg-nav { display: none; }
  .ucg-section { padding: 104px 20px 64px; min-height: 0; }
  .ucg-split { grid-template-columns: 1fr; gap: 40px; }
  .ucg-hero .ucg-split { grid-template-columns: 1fr; }
  .ucg-hero { padding-right: 20px; }
  .ucg-hero-copy { padding-bottom: 0; }
  .ucg-hero-media { display: none; }
  .ucg-marquee { max-width: 100%; margin-top: 38px; }
  .ucg-forum-copy { order: 1; }
  .ucg-forum-viz { order: 2; }
  .ucg-card { border-radius: 20px; box-shadow: 0 8px 24px rgba(190,120,70,0.13); }
  .ucg-card-head { padding: 20px 22px; }
  .ucg-card-pad { padding: 20px 22px; }
  .ucg-card-inner { padding: 0 22px 22px; }
  .ucg-card-blurb { max-width: none; }
  .ucg-cluster { max-width: 400px; }
  .ucg-grid { grid-template-columns: repeat(2, 1fr); }
  .ucg-page { padding: 116px 20px 72px; }
  .ucg-body { max-width: none; }
}
@media (max-width: 620px) {
  .ucg-grid { grid-template-columns: 1fr; }
  .ucg-field input { height: 66px; padding: 0 74px 0 24px; font-size: 16px; }
  .ucg-field button { width: 46px; height: 46px; top: 10px; right: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .ucg * { animation: none !important; transition: none !important; }
  .ucg-marquee-track { animation: none !important; }
  .ucg-sheet { transition: none !important; }
}
`;

/* ------------------------------------------------------------------ *
 * data
 * ------------------------------------------------------------------ */

const NAV = [
  { label: "The Process", kind: "anchor", target: "process" },
  { label: "The Forum", kind: "anchor", target: "forum" },
  { label: "Learning Materials", kind: "page", target: "learning" },
  { label: "Delegate Portal", kind: "page", target: "delegates" },
];

const SUPPORTERS = [
  "UTAH COMMON\nGROUND",
  "BLOOM\nPROJECT",
  "AEGIX",
  "KEM C. GARDNER\nINSTITUTE",
  "BRAVER\nANGELS",
  "MWEG",
];

const STEPS = [
  {
    title: "Assemble a Steering Committee.",
    blurb: "Utahns from across the political spectrum set the ground rules and vouch for the process.",
  },
  {
    title: "Set the agenda.",
    blurb: "We engaged over 500 Utahns through surveys and community conversations.",
  },
  {
    title: "Organize an assembly of residents.",
    blurb: "Forty randomly selected delegates meet for two days to write recommendations.",
  },
];

const STEP_MS = 5000;

const PARTIES = ["Democrat", "Republican", "Independent", "Unaffiliated"];
const RACES = ["White", "Hispanic or Latino", "Asian", "Native American", "Black", "Two or more races", "Pacific Islander"];
const AGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

const SOURCES = [
  { tag: "Primer", title: "What is generative AI, in plain terms", meta: "Prepared for delegates · 6 pages" },
  { tag: "Briefing", title: "AI data centers and Utah's water and power", meta: "Utah Common Ground · 9 pages" },
  { tag: "Report", title: "Where 500 Utahns agreed, and where they split", meta: "Community conversation findings" },
  { tag: "Explainer", title: "Who regulates AI today: state, federal, private", meta: "Prepared for delegates · 5 pages" },
  { tag: "Perspectives", title: "Four arguments about public oversight of AI", meta: "Balanced review · 12 pages" },
  { tag: "Case study", title: "How other states have consulted residents", meta: "Comparative summary · 8 pages" },
  { tag: "Glossary", title: "Terms you'll hear at the Forum", meta: "Reference · 3 pages" },
  { tag: "Video", title: "Steering Committee on why this question", meta: "14 minutes" },
];

const PORTAL_DOC = [
  {
    h: "Basic logistics",
    p: ["The Forum runs Thursday, September 17 through Friday, September 18. Both days begin at 8:30 a.m. and end by 5:00 p.m. Meals are provided."],
    ul: ["Venue: TBC, downtown Salt Lake City", "Doors and check-in open at 8:00 a.m.", "Free parking in the adjacent structure; validate at the front desk", "Nearest transit: TRAX Blue and Green lines"],
  },
  {
    h: "Schedule",
    p: ["Day one covers shared learning and questions for the expert panel. Day two is drafting, deliberation, and the final vote on recommendations."],
    ul: ["Day 1 · Orientation, learning sessions, small-group discussion", "Day 1 · Expert panel and open Q&A", "Day 2 · Drafting recommendations at your table", "Day 2 · Full-assembly deliberation and vote"],
  },
  {
    h: "What to bring",
    p: ["Everything you need to participate will be provided. Bring yourself, and anything that makes a long day comfortable."],
    ul: ["Photo ID for check-in", "Reading materials, if you'd like your notes on hand", "A sweater — the rooms run cold", "Any accessibility or dietary needs, sent ahead to the team"],
  },
  {
    h: "Stipend",
    p: ["Delegates receive a stipend for both days, plus reimbursement for travel, parking, and child or elder care. Payment is issued within 15 business days of the Forum. Submit receipts through the link emailed after check-in."],
  },
  {
    h: "Contact",
    p: ["Reach the delegate support line during business hours, or email the coordination team any time. Someone will be at the check-in desk both mornings from 8:00 a.m."],
  },
];

/* ------------------------------------------------------------------ *
 * helpers
 * ------------------------------------------------------------------ */

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic organic cluster: 40 nodes nearest the centre of a jittered hex grid. */
function buildDelegates() {
  const rnd = mulberry32(11);
  const raw = [];
  const s = 1;
  for (let row = -5; row <= 5; row++) {
    for (let col = -5; col <= 5; col++) {
      const x = col * s + (Math.abs(row) % 2 ? s / 2 : 0);
      const y = row * s * 0.88;
      raw.push({ x, y, d: Math.hypot(x, y * 1.06) });
    }
  }
  raw.sort((a, b) => a.d - b.d);
  const picked = raw.slice(0, 40).map((p) => ({
    x: p.x + (rnd() - 0.5) * 0.3,
    y: p.y + (rnd() - 0.5) * 0.3,
  }));

  const xs = picked.map((p) => p.x), ys = picked.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 14, span = 200;

  return picked.map((p, i) => ({
    id: i,
    cx: pad + ((p.x - minX) / (maxX - minX)) * (span - pad * 2),
    cy: pad + ((p.y - minY) / (maxY - minY)) * (span - pad * 2),
    party: PARTIES[Math.floor(rnd() * PARTIES.length)],
    race: RACES[Math.floor(rnd() * RACES.length)],
    age: AGES[Math.floor(rnd() * AGES.length)],
  }));
}

function Rings({ style, stroke = "rgba(238,123,60,0.10)", width = 34, radii = [140, 210, 280, 350, 420] }) {
  const max = radii[radii.length - 1] + width;
  return (
    <svg className="ucg-rings" style={style} width={max * 2} height={max * 2} viewBox={`0 0 ${max * 2} ${max * 2}`} aria-hidden="true">
      {radii.map((r) => (
        <circle key={r} cx={max} cy={max} r={r} stroke={stroke} strokeWidth={width} />
      ))}
    </svg>
  );
}

function Arrow({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function useIsNarrow(px = 1000) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px}px)`);
    setNarrow(mq.matches);
    const on = (e) => setNarrow(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [px]);
  return narrow;
}

/* ------------------------------------------------------------------ *
 * nav
 * ------------------------------------------------------------------ */

function Nav({ invert, current, onGo }) {
  const mobile = useIsNarrow(900);
  const [open, setOpen] = useState(false);

  useEffect(() => { if (!mobile) setOpen(false); }, [mobile]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (item) => { setOpen(false); onGo(item); };

  if (mobile) {
    return (
      <>
        <div className="ucg-rule" />
        <button
          className={`ucg-burger${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`ucg-burger-icon${open ? " is-open" : ""}`}>
            <i /><i /><i />
          </span>
        </button>
        <div className={`ucg-sheet${open ? " is-open" : ""}`}>
          <Rings
            style={{ bottom: -420, left: -300 }}
            stroke="rgba(255,255,255,0.13)"
            width={40}
            radii={[180, 260, 340, 420]}
          />
          <nav className="ucg-sheet-nav" aria-label="Main">
            {NAV.map((item) => (
              <button
                key={item.label}
                className={current === item.target ? "ucg-nav-current" : ""}
                tabIndex={open ? 0 : -1}
                onClick={() => pick(item)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="ucg-rule" />
      <nav className={`ucg-nav${invert ? " is-invert" : ""}`} aria-label="Main">
        {NAV.map((item) => (
          <button
            key={item.label}
            className={current === item.target ? "ucg-nav-current" : ""}
            onClick={() => onGo(item)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * hero
 * ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="ucg-section ucg-hero" id="hero">
      <Rings style={{ top: -330, left: -300 }} />
      <div className="ucg-inner">
        <div className="ucg-split">
          <div className="ucg-hero-copy">
            <span className="ucg-pill">September 17–18, 2026</span>
            <h1 className="ucg-display">
              What role should Utahns have in decisions around AI?
            </h1>
            <p className="ucg-sub">
              A <span className="o">Solutions Forum,</span> hosted by Utah Common Ground
            </p>

            <div style={{ marginTop: 56 }}>
              <p className="ucg-eyebrow">Supported by</p>
              <div className="ucg-marquee">
                <div className="ucg-marquee-track">
                  {[...SUPPORTERS, ...SUPPORTERS].map((name, i) => (
                    <div className="ucg-logo" key={i} aria-hidden={i >= SUPPORTERS.length}>{name}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ucg-hero-media" aria-hidden="true">
            <svg className="ucg-ph-figures" viewBox="0 0 300 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <circle cx="205" cy="150" r="46" fill="rgba(59,30,18,0.13)" />
              <path d="M120 400c0-70 38-118 85-118s85 48 85 118z" fill="rgba(59,30,18,0.13)" />
              <circle cx="95" cy="243" r="38" fill="rgba(59,30,18,0.10)" />
              <path d="M20 400c0-58 33-96 75-96s75 38 75 96z" fill="rgba(59,30,18,0.10)" />
            </svg>
            <span className="ucg-ph-tag">Photo placeholder</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * process
 * ------------------------------------------------------------------ */

/**
 * The element type and DOM shape stay identical whether the card is open or
 * closed — swapping tags would remount the node and skip the transition.
 */
function ProcessCard({ step, open, progress, onClick }) {
  return (
    <div className={`ucg-card${open ? " is-open" : ""}`}>
      <div
        className="ucg-card-progress"
        style={{ width: `${(open ? progress : 0) * 100}%`, opacity: open ? 1 : 0 }}
      />
      <button
        className="ucg-card-head"
        onClick={onClick}
        aria-expanded={open}
        disabled={open}
      >
        <h3 className="ucg-card-title">{step.title}</h3>
      </button>
      <div className="ucg-card-reveal">
        <div>
          <div className="ucg-card-inner">
            <p className="ucg-card-blurb">{step.blurb}</p>
            <div className="ucg-card-img">
              <span className="ucg-ph-tag">Photo placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ step }) {
  return (
    <div className="ucg-card is-open">
      <div className="ucg-card-pad">
        <div className="ucg-card-img" style={{ marginTop: 0 }}>
          <span className="ucg-ph-tag">Photo placeholder</span>
        </div>
        <p className="ucg-card-blurb" style={{ marginTop: 18 }}>{step.blurb}</p>
        {/* mobile cards are always expanded, so no reveal wrapper */}
      </div>
    </div>
  );
}

function ProcessSection({ onGo }) {
  const reduced = usePrefersReducedMotion();
  const narrow = useIsNarrow(900);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const progressRef = useRef(0);
  const touchX = useRef(null);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  const cycling = !reduced && !paused && !stopped;

  useEffect(() => {
    if (!cycling) return;
    let raf;
    const start = performance.now() - progressRef.current * STEP_MS;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / STEP_MS);
      progressRef.current = p;
      setProgress(p);
      if (p >= 1) {
        progressRef.current = 0;
        setProgress(0);
        setActive((a) => (a + 1) % STEPS.length);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cycling, active]);

  const jump = useCallback((i) => {
    setActive(i);
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) {
      setStopped(true);
      setActive((a) => Math.min(STEPS.length - 1, Math.max(0, a + (dx < 0 ? 1 : -1))));
    }
    touchX.current = null;
  };

  return (
    <section className="ucg-section" id="process">
      <Rings style={{ top: "50%", left: -430, transform: "translateY(-50%)" }} radii={[180, 250, 320, 390, 460]} />
      <div className="ucg-inner">
        <div className="ucg-split">
          <div>
            <h2 className="ucg-display">
              AI has huge implications for <span className="o">Utah&rsquo;s future.</span>
            </h2>
            <p className="ucg-body">
              We&rsquo;ve engaged over 500 residents to understand their priorities, from
              environmental impact to transparency and public control.
            </p>
            <button className="ucg-link" onClick={() => onGo({ kind: "anchor", target: "forum" })}>
              Learn about our process <span><Arrow /></span>
            </button>
          </div>

          {narrow ? (
            <div>
              <div
                className="ucg-carousel"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <div className="ucg-carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
                  {STEPS.map((s) => (
                    <div className="ucg-carousel-cell" key={s.title}>
                      <MobileCard step={s} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="ucg-dots">
                {STEPS.map((s, i) => (
                  <button
                    key={s.title}
                    className={i === active ? "is-on" : ""}
                    aria-label={s.title}
                    aria-current={i === active}
                    onClick={() => { setStopped(true); jump(i); }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="ucg-stack"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              {STEPS.map((s, i) => (
                <ProcessCard
                  key={s.title}
                  step={s}
                  open={reduced ? true : i === active}
                  progress={i === active ? progress : 0}
                  onClick={() => jump(i)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * forum
 * ------------------------------------------------------------------ */

const SAMPLE_IDS = [7, 18, 31];

function ForumSection({ onGo }) {
  const nodes = useMemo(buildDelegates, []);
  const [hovered, setHovered] = useState(null);
  const [showSamples, setShowSamples] = useState(true);

  const touch = () => { if (showSamples) setShowSamples(false); };

  const visible = hovered != null
    ? [hovered]
    : showSamples ? SAMPLE_IDS : [];

  return (
    <section className="ucg-section" id="forum">
      <Rings style={{ top: "50%", right: -420, transform: "translateY(-50%)" }} radii={[200, 275, 350, 425]} />
      <div className="ucg-inner">
        <div className="ucg-split">
          <div className="ucg-forum-viz">
            <div className="ucg-cluster">
              <svg viewBox="0 0 200 200" role="group" aria-label="Forty delegates, selected to reflect Utah">
                {nodes.map((n) => (
                  <circle
                    key={n.id}
                    className={`ucg-node${visible.includes(n.id) ? " is-on" : ""}`}
                    cx={n.cx}
                    cy={n.cy}
                    r="10.5"
                    tabIndex={0}
                    role="img"
                    aria-label={`Delegate: ${n.party}, ${n.race}, age ${n.age}`}
                    onMouseEnter={() => { touch(); setHovered(n.id); }}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => { touch(); setHovered(n.id); }}
                    onBlur={() => setHovered(null)}
                  />
                ))}
              </svg>

              {visible.map((id) => {
                const n = nodes[id];
                const low = n.cy < 40;
                return (
                  <div
                    key={id}
                    className={`ucg-tip${low ? " ucg-tip-lo" : ""}`}
                    style={{ left: `${(n.cx / 200) * 100}%`, top: `${(n.cy / 200) * 100}%` }}
                  >
                    {n.party}<br />{n.race}<br />{n.age}
                  </div>
                );
              })}
            </div>
            <p className="ucg-hint">Hover a delegate</p>
          </div>

          <div className="ucg-forum-copy">
            <h2 className="ucg-display">
              <span className="o">40 residents</span> will develop policy proposals.
            </h2>
            <p className="ucg-body" style={{ maxWidth: "34ch" }}>
              They&rsquo;ll be supported by experts in facilitation and public policy, free from
              the influence of special interests.
            </p>
            <button className="ucg-link" onClick={() => onGo({ kind: "page", target: "delegates" })}>
              Learn about the assembly <span><Arrow /></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * signup
 * ------------------------------------------------------------------ */

function SignupSection({ innerRef, onGo }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  const submit = () => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!ok) { setState("bad"); return; }
    setState("ok");
    setEmail("");
  };

  return (
    <section className="ucg-section ucg-signup" id="signup" ref={innerRef}>
      <Rings style={{ top: "50%", left: -560, transform: "translateY(-50%)" }} stroke="rgba(255,255,255,0.12)" width={44} radii={[200, 290, 380, 470]} />
      <Rings style={{ top: "50%", right: -560, transform: "translateY(-50%)" }} stroke="rgba(255,255,255,0.12)" width={44} radii={[200, 290, 380, 470]} />
      <div className="ucg-inner">
        <div className="ucg-signup-inner">
          <h2 className="ucg-display">Be part of the story.</h2>
          <p className="ucg-signup-sub">
            Share your email to receive updates from Utah Common Ground.
          </p>

          <div className={`ucg-field${state === "bad" ? " is-bad" : ""}`}>
            <input
              type="email"
              value={email}
              placeholder="Enter your email..."
              aria-label="Email address"
              aria-invalid={state === "bad"}
              onChange={(e) => { setEmail(e.target.value); if (state !== "idle") setState("idle"); }}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            <button onClick={submit} aria-label="Sign up for updates"><Arrow size={22} color="#fff" /></button>
          </div>

          <p className={`ucg-msg${state === "bad" ? " is-bad" : state === "ok" ? " is-ok" : ""}`} role="status">
            {state === "bad" && "Enter an email address in the form name@example.com."}
            {state === "ok" && "You're on the list. Watch for updates before September 17."}
          </p>

          <button className="ucg-link" onClick={() => onGo({ kind: "page", target: "learning" })}>
            Access the learning materials to follow along <span><Arrow /></span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * subpages
 * ------------------------------------------------------------------ */

function LearningPage({ onGo }) {
  return (
    <div className="ucg-page">
      <Rings style={{ top: -380, right: -340 }} />
      <div className="ucg-page-inner">
        <button className="ucg-back" onClick={() => onGo({ kind: "page", target: "home" })}>
          ← Back to the Forum
        </button>
        <h1 className="ucg-display" style={{ maxWidth: "18ch" }}>
          Learning <span className="o">materials.</span>
        </h1>
        <p className="ucg-body" style={{ maxWidth: "60ch" }}>
          Every delegate receives the same set of materials before the Forum: primers,
          briefings, and a balanced review of the arguments. They&rsquo;re public, so you can
          read along with the assembly.
        </p>

        <div className="ucg-grid">
          {SOURCES.map((s) => (
            <button className="ucg-source" key={s.title}>
              <span className="ucg-tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.meta}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DelegatesPage({ onGo }) {
  const [pass, setPass] = useState("");
  const [bad, setBad] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = () => {
    if (pass.trim().toLowerCase() === "utah2026") { setOpen(true); setBad(false); }
    else setBad(true);
  };

  return (
    <div className="ucg-page">
      <Rings style={{ top: -380, left: -340 }} />
      <div className="ucg-page-inner">
        <button className="ucg-back" onClick={() => onGo({ kind: "page", target: "home" })}>
          ← Back to the Forum
        </button>
        <h1 className="ucg-display" style={{ maxWidth: "20ch" }}>
          Delegate <span className="o">portal.</span>
        </h1>

        {!open ? (
          <div className="ucg-gate">
            <h2>Enter your access code</h2>
            <p>Delegates received a code by email with their confirmation. Lost it? Contact the coordination team.</p>
            <input
              type="password"
              value={pass}
              className={bad ? "is-bad" : ""}
              placeholder="Access code"
              aria-label="Access code"
              aria-invalid={bad}
              onChange={(e) => { setPass(e.target.value); setBad(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            {bad && <p style={{ color: "#B4441C", fontSize: 14, fontWeight: 600, margin: "12px 0 0" }}>
              That code doesn&rsquo;t match. Check the email, or request a new code.
            </p>}
            <button className="ucg-btn" onClick={submit}>Unlock the portal</button>
            <p className="ucg-gate-note">Prototype: the code is <strong>utah2026</strong>. Not real authentication.</p>
          </div>
        ) : (
          <div className="ucg-doc">
            {PORTAL_DOC.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((t, i) => <p key={i}>{t}</p>)}
                {s.ul && <ul>{s.ul.map((t) => <li key={t}>{t}</li>)}</ul>}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * app
 * ------------------------------------------------------------------ */

export default function App() {
  const [view, setView] = useState("home");
  const [invert, setInvert] = useState(false);
  const pending = useRef(null);
  const signupRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [reduced]);

  const onGo = useCallback((item) => {
    if (item.kind === "anchor") {
      if (view !== "home") { pending.current = item.target; setView("home"); }
      else scrollTo(item.target);
    } else {
      setView(item.target);
      setInvert(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [view, scrollTo]);

  useEffect(() => {
    if (view === "home" && pending.current) {
      const id = pending.current;
      pending.current = null;
      requestAnimationFrame(() => scrollTo(id));
    }
  }, [view, scrollTo]);

  // nav inverts over the orange signup section
  useEffect(() => {
    if (view !== "home" || !signupRef.current) { setInvert(false); return; }
    const io = new IntersectionObserver(
      ([e]) => setInvert(e.intersectionRatio > 0.55),
      { threshold: [0, 0.55, 1] }
    );
    io.observe(signupRef.current);
    return () => io.disconnect();
  }, [view]);

  return (
    <div className="ucg">
      <style>{CSS}</style>
      <Nav invert={invert} current={view === "home" ? null : view} onGo={onGo} />

      {view === "home" && (
        <>
          <Hero />
          <ProcessSection onGo={onGo} />
          <ForumSection onGo={onGo} />
          <SignupSection innerRef={signupRef} onGo={onGo} />
        </>
      )}
      {view === "learning" && <LearningPage onGo={onGo} />}
      {view === "delegates" && <DelegatesPage onGo={onGo} />}
    </div>
  );
}
