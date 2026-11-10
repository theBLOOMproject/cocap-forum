# Central Oregon Civic Assembly on AI

A small React site for the Central Oregon Civic Action Project's (COCAP) 2026
Civic Assembly on AI (December 2026). Forked from the Utah Common Ground
Solutions Forum site; CSS classes still use the `ucg-` prefix.

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
| `/learning`   | Learning Center (interim placeholder)                   |
| `/delegates`  | Delegate Portal (access code: `cocap26`)       |
| anything else | Not Found                                               |

Client-side routing needs a server that falls back to `index.html` for unknown
paths. `vite dev`/`preview` do this automatically; `vercel.json` configures it
for deployment on Vercel. For other hosts, add the equivalent SPA rewrite.

## Photos

All imagery is referenced through `src/images.js`, which points at files in
`public/images/` (served from the site root).

| Slot                  | Where it's set                              |
| --------------------- | ------------------------------------------- |
| Hero frame (3 photos, cross-fade) | `IMAGES.hero` in `src/images.js` |
| Supporter logos       | `IMAGES.logos` + `SUPPORTERS` in `src/data.js` (`placeholder: true` = empty slot) |
| Process step images   | `IMAGES.process` — currently placeholders; replace `placeholder(...)` with `{ src, alt }` |
| Favicon               | `public/images/favicon.svg`                 |

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
