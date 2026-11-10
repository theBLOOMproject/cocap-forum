import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import learning from "./learning/vite-plugin.mjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    learning({
      contentDir: "learning/content",
      // Wiki sections (by title in learning/content/site.yml) not shown on this site.
      hideSections: ["Defining the problem"],
      // Order of the remaining sections on this site (must list all of them).
      sectionOrder: [
        "Introduction & overview",
        "AI-related decisions in Central Oregon",
        "Public engagement",
        "Developing recommendations",
      ],
    }),
  ],
});
