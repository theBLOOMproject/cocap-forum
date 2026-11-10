# Utah Common Ground — Solutions Forum

A small React site for the Solutions Forum on the role Utahns should have in
decisions around AI (September 18–19, 2026).

Built with [Vite](https://vite.dev) + [React](https://react.dev) +
[React Router](https://reactrouter.com). It began as a single-file prototype
(`reference/ucg-prototype.jsx`), now split into a routed app with static assets.

## Commands

```bash
npm install
npm run dev       # local dev server (http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

## Routes

| Path          | Page                                                    |
| ------------- | ------------------------------------------------------- |
| `/`           | Home — Hero, The Process, The Forum, Signup sections    |
| `/#process`   | Home, scrolled to **The Process**                       |
| `/#forum`     | Home, scrolled to **The Forum**                         |
| `/learning`   | Learning Materials                                      |
| `/delegates`  | Delegate Portal (prototype access code: `utah2026`)     |
| anything else | Not Found                                               |

Client-side routing needs a server that falls back to `index.html` for unknown
paths. `vite dev`/`preview` do this automatically; `vercel.json` configures it
for deployment on Vercel. For other hosts, add the equivalent SPA rewrite.

## Photos

All imagery is referenced through `src/images.js`, which points at files in
`public/images/` (served from the site root). The repo ships lightweight SVG
placeholders. To use real photography, drop a file with the same base name into
`public/images/` and update its extension in `src/images.js` — nothing else
changes.

| Slot                  | File                                       | Used in                     |
| --------------------- | ------------------------------------------ | --------------------------- |
| Hero                  | `public/images/hero.svg`                   | `src/sections/Hero.jsx`     |
| Process · step 1      | `public/images/process-steering-committee.svg` | `src/data.js` (`STEPS`) |
| Process · step 2      | `public/images/process-set-agenda.svg`     | `src/data.js` (`STEPS`)     |
| Process · step 3      | `public/images/process-assembly.svg`       | `src/data.js` (`STEPS`)     |
| Favicon               | `public/images/favicon.svg`                | `index.html`                |

## Structure

```
src/
  main.jsx              app entry, Router mount
  App.jsx               routes, nav chrome, scroll + hash handling
  styles.css            all styles (scoped under .ucg)
  data.js               static content (nav, steps, sources, portal doc)
  images.js             static photo references
  components/           Nav, Rings, Arrow
  sections/             Hero, ProcessSection, ForumSection, SignupSection
  pages/                Home, LearningPage, DelegatesPage, NotFound
  lib/                  hooks, deterministic delegate cluster, nav context
```

## Notes

- The Delegate Portal gate is **not** real authentication — it's a prototype
  check against a hard-coded string. Replace before any real use.
- The signup form validates the address shape and shows a confirmation; it does
  not send anything anywhere yet.
