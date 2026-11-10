// Compiles the Learning Center markdown (learning/content/) into page data for
// the React site. Ported from theBLOOMproject/wiki-playground's src/build.mjs:
// the markdown dialect (editor notes, ::: blocks, fact lists, {{> partials}})
// is identical, so pages render the same as in the wiki. Differences:
//   - editor notes and the review-notes page are stripped (public site)
//   - "#page-id" links become "/learning/page-id" routes
//   - images become Vite asset imports instead of inline data URIs
//   - reading times and section chrome are computed here, not in the browser

import fs from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import container from "markdown-it-container";
import deflist from "markdown-it-deflist";
import matter from "gray-matter";
import * as yaml from "js-yaml";
import * as cheerio from "cheerio";

export class BuildError extends Error {}
const fail = (msg) => {
  throw new BuildError(msg);
};

export const ROUTE_BASE = "/learning";

// ---------- Editor notes: {src: …} {check: …} {verify: …} {team: …} {gap: …} {new: …} {added: …} ----------
// Parsed exactly as in the wiki (so malformed notes still fail the build),
// then removed from the output in transform().
const NOTE_KINDS = {
  src: null,
  check: ["flag-check", "Check"],
  verify: ["flag-check", "Verify"],
  team: ["flag-team", "Team"],
  gap: ["flag-team", "Gap"],
  new: ["flag-new", "New source"],
  added: ["flag-new", "Added"],
};

function editorNotes(md) {
  md.inline.ruler.before("emphasis", "ednote", (state, silent) => {
    const { src } = state;
    const start = state.pos;
    if (src.charCodeAt(start) !== 0x7b /* { */) return false;
    const m = /^\{([a-z]+):[ ]?/.exec(src.slice(start, start + 24));
    if (!m) return false;
    if (!(m[1] in NOTE_KINDS)) {
      fail(`Unknown editor note "{${m[1]}: …}". Use one of: ${Object.keys(NOTE_KINDS).map((k) => `{${k}: …}`).join(" ")}`);
    }
    let depth = 0,
      end = -1;
    for (let i = start; i < state.posMax; i++) {
      const c = src[i];
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}" && --depth === 0) {
        end = i;
        break;
      }
    }
    if (end < 0) fail(`Editor note "{${m[1]}: …" is missing its closing "}" near: ${src.slice(start, start + 60)}`);
    if (!silent) {
      const last = state.tokens[state.tokens.length - 1];
      if (state.pending.endsWith(" ")) {
        state.pending = state.pending.replace(/ +$/, "");
        state.push("ed_space", "", 0);
      } else if (!state.pending && last && last.type === "softbreak") {
        last.type = "ed_space";
      }
      state.push("ed_open", "span", 1).meta = m[1];
      const oldMax = state.posMax;
      state.pos = start + m[0].length;
      state.posMax = end;
      state.md.inline.tokenize(state);
      state.posMax = oldMax;
      state.push("ed_close", "span", -1);
    }
    state.pos = end + 1;
    return true;
  });
  md.renderer.rules.ed_space = () => '<span class="edw"> </span>';
  md.renderer.rules.ed_open = () => '<span class="ed">';
  md.renderer.rules.ed_close = () => "</span>";
}

// ---------- Block containers: ::: name … ::: ----------
const CONTAINERS = ["keypoints", "coming-soon", "lead", "lead-strong", "sources", "wide", "cards", "timeline", "figure", "home-note"];

const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
md.use(deflist).use(editorNotes);
for (const name of CONTAINERS) {
  md.use(container, name, {
    render: (tokens, idx) => (tokens[idx].nesting === 1 ? `<div data-c="${name}">\n` : "</div>\n"),
  });
}

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
const pageHref = (id) => (id === "home" ? ROUTE_BASE : `${ROUTE_BASE}/${id}`);

/** Placeholder for an image; the Vite plugin swaps it for the asset URL. */
export const imageToken = (i) => `__LC_IMAGE_${i}__`;

function createCompiler(contentDir, { hideSections = [], sectionOrder = null } = {}) {
  const PAGES_DIR = path.join(contentDir, "pages");
  const PARTIALS_DIR = path.join(contentDir, "partials");
  const files = new Set(); // everything read, so dev mode can watch it
  const images = []; // absolute paths, index = token number
  let publicIds = new Set();

  const read = (file) => {
    files.add(file);
    return fs.readFileSync(file, "utf8");
  };

  function partial(name) {
    const file = path.join(PARTIALS_DIR, name + ".html");
    if (!fs.existsSync(file)) fail(`Missing partial "{{> ${name}}}" (expected content/partials/${name}.html)`);
    return read(file).trim();
  }

  function transform(html) {
    const $ = cheerio.load(html, null, false);
    const PARTIAL_RE = /^\{\{>\s*([\w-]+)\s*\}\}$/;

    $("p").each((_, p) => {
      const m = PARTIAL_RE.exec($(p).text().trim());
      if (m && $(p).children().length === 0) $(p).replaceWith(partial(m[1]));
    });

    $("img").each((_, img) => {
      const src = $(img).attr("src") || "";
      if (/^(data:|https?:)/.test(src)) return;
      const file = path.resolve(PAGES_DIR, decodeURI(src));
      if (!fs.existsSync(file)) fail(`Missing image "${src}" (looked for ${path.relative(contentDir, file)})`);
      if (!IMAGE_EXT.has(path.extname(file).toLowerCase())) fail(`Unsupported image type: ${src}`);
      files.add(file);
      let i = images.indexOf(file);
      if (i < 0) i = images.push(file) - 1;
      $(img).attr("src", imageToken(i)).attr("loading", "lazy");
    });

    // Strip editor notes: a paragraph holding only a note goes entirely.
    $("p").each((_, p) => {
      const kids = $(p).contents().toArray().filter((n) => !(n.type === "text" && !n.data.trim()));
      if (kids.length === 1 && $(kids[0]).is("span.ed")) $(p).remove();
    });
    $(".ed, .edw").remove();

    $("dl").addClass("facts");
    $("thead th").attr("scope", "col");

    $('div[data-c="wide"]').each((_, d) => {
      $(d).find("table").wrap('<div class="table-wrap wide-table"></div>');
      $(d).replaceWith($(d).contents());
    });
    $("table").each((_, t) => {
      if (!$(t).parent().hasClass("table-wrap")) $(t).wrap('<div class="table-wrap"></div>');
    });

    for (const cls of ["lead", "lead-strong", "sources"]) {
      $(`div[data-c="${cls}"]`).each((_, d) => {
        $(d).children("p").addClass(cls);
        $(d).replaceWith($(d).contents());
      });
    }

    $('div[data-c="keypoints"]').each((_, d) => {
      $(d).replaceWith(`<section class="keypoints" aria-label="Key points"><h2>Key points</h2>${$(d).html().trim()}</section>`);
    });

    $('div[data-c="coming-soon"]').each((_, d) => {
      $(d).replaceWith(`<div class="soon-card"><p class="soon-title">Coming soon</p>${$(d).html().trim()}</div>`);
    });

    $('div[data-c="cards"]').each((_, d) => {
      const cards = $(d)
        .find("li")
        .map((_, li) => {
          const a = $(li).children("a").first();
          if (!a.length) fail(`Each item inside "::: cards" must start with a link, like: - [Title](#page-id) — description`);
          const title = a.html();
          const href = a.attr("href");
          a.remove();
          const desc = ($(li).html() || "").trim().replace(/^(—|–|-|:)\s*/, "");
          return `<a class="case-card" href="${href}"><span class="cc-title">${title}</span><span class="cc-desc">${desc}</span></a>`;
        })
        .get();
      $(d).replaceWith(`<div class="case-cards">${cards.join("")}</div>`);
    });

    $('div[data-c="timeline"]').each((_, d) => {
      const list = $(d).children("ol, ul").first();
      list.children("li").each((_, li) => {
        const first = $(li).children().first();
        if (first.is("strong") && li.children[0] === first[0]) {
          first.replaceWith(`<span class="when">${first.html()}</span>`);
          const next = $(li).find("span.when")[0].nextSibling;
          if (next && next.type === "text") next.data = next.data.replace(/^\s+/, "");
        }
      });
      $(d).replaceWith(`<ol class="tl">${list.html()}</ol>`);
    });

    $('div[data-c="figure"]').each((_, d) => {
      const $d = $(d);
      $d.children("p").each((_, p) => {
        const only = $(p).children();
        if (only.length === 1 && only.is("img") && !$(p).text().trim()) $(p).replaceWith(`<div class="figure-img">${$.html(only)}</div>`);
      });
      const cap = $d.children("p").last();
      if (cap.length) cap.replaceWith(`<figcaption>${cap.html()}</figcaption>`);
      $d.replaceWith(`<figure>${$d.html().trim()}</figure>`);
    });

    // Links: "#page-id" -> route; links to non-public pages are unwrapped;
    // external links open in a new tab.
    $("a[href]").each((_, a) => {
      const href = $(a).attr("href");
      if (href.startsWith("#")) {
        const id = href.slice(1) || "home";
        if (id === "home" || publicIds.has(id)) $(a).attr("href", pageHref(id)).attr("data-lc-link", "");
        else $(a).replaceWith($(a).html());
      } else if (/^https?:/.test(href)) {
        $(a).attr("target", "_blank").attr("rel", "noopener noreferrer");
      }
    });

    const leftover = $('div[data-c]:not([data-c="home-note"])').first();
    if (leftover.length) fail(`"::: ${leftover.attr("data-c")}" is not allowed here`);
    return $;
  }

  function loadPage(id) {
    const file = path.join(PAGES_DIR, id + ".md");
    if (!fs.existsSync(file)) fail(`Page "${id}" is listed in content/site.yml but content/pages/${id}.md does not exist`);
    const { data, content } = matter(read(file));
    if (!data.title) fail(`content/pages/${id}.md needs a "title:" at the top`);
    return { id, data, content };
  }

  function render(page) {
    try {
      return transform(md.render(page.content));
    } catch (e) {
      if (e instanceof BuildError) fail(`content/pages/${page.id}.md: ${e.message}`);
      throw e;
    }
  }

  function minutesFor($) {
    const c = cheerio.load($.html(), null, false);
    c("figure").remove();
    const words = c.root().text().trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }

  function compile() {
    const site = yaml.load(read(path.join(contentDir, "site.yml")));
    const sections = site.sections || fail("content/site.yml needs a sections: list");
    const unlisted = new Set(site.unlisted || []);

    const seen = new Set(["home"]);
    const SECTIONS = sections.map((s, i) => {
      if (!s.title || !Array.isArray(s.pages) || !s.pages.length) fail(`content/site.yml: section ${i + 1} needs a title and at least one page`);
      return {
        num: i + 1,
        title: s.title,
        single: !!s.single,
        pages: s.pages.map((p) => {
          if (!p.id || !p.nav) fail(`content/site.yml: every page needs an id and a nav label (section "${s.title}")`);
          if (seen.has(p.id)) fail(`content/site.yml: page "${p.id}" is listed twice`);
          seen.add(p.id);
          return { id: p.id, nav: p.nav, sub: !!p.sub };
        }),
      };
    });
    unlisted.forEach((id) => seen.add(id));

    const onDisk = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
    const stray = onDisk.filter((id) => !seen.has(id));
    if (stray.length) fail(`These pages aren't listed in content/site.yml: ${stray.map((id) => `content/pages/${id}.md`).join(", ")}`);

    // Sections hidden on this site (see vite.config.js). Their pages aren't
    // published, and links to them elsewhere are unwrapped to plain text.
    const unknown = hideSections.filter((t) => !SECTIONS.some((s) => s.title === t));
    if (unknown.length) fail(`hideSections: no section titled ${unknown.map((t) => `"${t}"`).join(", ")} in content/site.yml`);
    let visible = SECTIONS.filter((s) => !hideSections.includes(s.title));

    // Optional site-side section order. It must name every visible section,
    // so a section newly added in the wiki can't land somewhere by accident.
    if (sectionOrder) {
      const titles = visible.map((s) => s.title);
      const missing = titles.filter((t) => !sectionOrder.includes(t));
      const extra = sectionOrder.filter((t) => !titles.includes(t));
      if (missing.length || extra.length || new Set(sectionOrder).size !== sectionOrder.length) {
        fail(
          "sectionOrder must list each visible section exactly once." +
            (missing.length ? ` Missing: ${missing.map((t) => `"${t}"`).join(", ")}.` : "") +
            (extra.length ? ` Not a visible section: ${extra.map((t) => `"${t}"`).join(", ")}.` : ""),
        );
      }
      visible = sectionOrder.map((t) => visible.find((s) => s.title === t));
    }
    const PUBLIC = visible.map((s, i) => ({ ...s, num: i + 1 }));

    publicIds = new Set(PUBLIC.flatMap((s) => s.pages.map((p) => p.id)));

    const pages = {};
    const order = [];
    for (const s of PUBLIC) {
      for (const p of s.pages) {
        const page = loadPage(p.id);
        const status = page.data.status || "draft";
        if (!["draft", "soon"].includes(status)) fail(`content/pages/${p.id}.md: status must be draft or soon (got "${status}")`);
        const $ = render(page);
        if ($('div[data-c="home-note"]').length) fail(`content/pages/${p.id}.md: "::: home-note" only works on the home page`);
        pages[p.id] = {
          id: p.id,
          title: page.data.title,
          status,
          minutes: status === "draft" ? minutesFor($) : null,
          section: s.num,
          html: $.html().trim(),
        };
        order.push(p.id);
      }
    }

    // Home: title, subtitle, intro paragraphs. The home-note is about the
    // editor-notes switch, which the public site doesn't have, so it's dropped.
    const homeSrc = loadPage("home");
    const $home = render(homeSrc);
    $home('div[data-c="home-note"]').remove();
    const home = {
      title: homeSrc.data.title,
      subtitle: homeSrc.data.subtitle || null,
      html: $home.html().trim(),
    };

    return { sections: PUBLIC, pages, order, home, images: [...images], files: [...files] };
  }

  return { compile };
}

export function compileLearning(contentDir, options) {
  return createCompiler(contentDir, options).compile();
}
