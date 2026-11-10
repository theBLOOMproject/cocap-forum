// Vite plugin: exposes the compiled Learning Center as `virtual:learning`.
// Images are emitted as normal Vite assets (hashed, cached) via imports.
// In dev, editing anything under learning/content/ reloads the page.

import path from "node:path";
import { compileLearning, imageToken, BuildError } from "./compile.mjs";

const ID = "virtual:learning";
const RESOLVED = "\0" + ID;

export default function learning({ contentDir, hideSections = [], sectionOrder = null }) {
  const dir = path.resolve(contentDir);
  let server;
  let base = "/";

  return {
    name: "cocap-learning",
    configResolved(config) {
      base = config.base;
    },
    resolveId(id) {
      return id === ID ? RESOLVED : null;
    },
    configureServer(s) {
      server = s;
      s.watcher.add(dir);
      const reload = (file) => {
        if (!path.resolve(file).startsWith(dir)) return;
        const mod = s.moduleGraph.getModuleById(RESOLVED);
        if (mod) s.moduleGraph.invalidateModule(mod);
        s.ws.send({ type: "full-reload" });
      };
      s.watcher.on("change", reload);
      s.watcher.on("add", reload);
      s.watcher.on("unlink", reload);
    },
    load(id) {
      if (id !== RESOLVED) return null;
      let data;
      try {
        data = compileLearning(dir, { hideSections, sectionOrder });
      } catch (e) {
        if (e instanceof BuildError) {
          const msg = `Learning Center build failed: ${e.message}`;
          if (server) {
            // Keep the dev server alive; show the error on the page instead.
            server.config.logger.error(msg);
            return `export default { error: ${JSON.stringify(msg)} };`;
          }
          this.error(msg);
        }
        throw e;
      }

      const { images, files, ...payload } = data;
      // Page links are written as "/learning/…"; prefix the deploy base so
      // they also work when opened in a new tab under a subpath.
      if (base !== "/") {
        const withBase = (html) => html.replaceAll('href="/learning', `href="${base}learning`);
        for (const p of Object.values(payload.pages)) p.html = withBase(p.html);
        payload.home.html = withBase(payload.home.html);
      }
      files.forEach((f) => this.addWatchFile(f));

      const imports = images.map((file, i) => `import img${i} from ${JSON.stringify(file)};`).join("\n");
      const urls = `[${images.map((_, i) => `img${i}`).join(", ")}]`;
      return `${imports}
const data = ${JSON.stringify(payload)};
const urls = ${urls};
const tokens = ${JSON.stringify(images.map((_, i) => imageToken(i)))};
const fill = (html) => tokens.reduce((h, t, i) => h.split(t).join(urls[i]), html);
for (const p of Object.values(data.pages)) p.html = fill(p.html);
data.home.html = fill(data.home.html);
export default data;
`;
    },
  };
}
