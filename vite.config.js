import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import learning from "./learning/vite-plugin.mjs";

// https://vite.dev/config/
export default defineConfig({
  // "/" locally and on Vercel; the GitHub Pages workflow sets BASE_PATH to
  // "/cocap-forum/" because Pages serves the site from that subpath.
  base: process.env.BASE_PATH || "/",
  plugins: [
    react(),
    learning({
      contentDir: "learning/content",
      // Site-side section overrides (titles from learning/content/site.yml):
      //   hideSections: ["Title"]  — sections not shown on this site
      //   sectionOrder: [...]      — reorder; must list every visible section
      // None for now: the site follows the wiki's sections and order.
    }),
  ],
});
