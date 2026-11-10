import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import learning from "virtual:learning";
import "./learning.css";

const BASE = "/learning";
const SITE_TITLE = "Learning Center | Central Oregon Civic Assembly on AI";
const hrefFor = (id) => (id === "home" ? BASE : `${BASE}/${id}`);

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.5 7.2 8 2.5l5.5 4.7V13a.8.8 0 0 1-.8.8H9.8V10H6.2v3.8H3.3a.8.8 0 0 1-.8-.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusPill({ page }) {
  return page.status === "draft" ? (
    <span className="lc-pill draft">Draft</span>
  ) : (
    <span className="lc-pill soon">Coming soon</span>
  );
}

/** Rendered page HTML. Internal links route client-side. */
function Html({ html, className }) {
  const navigate = useNavigate();
  const onClick = (e) => {
    const a = e.target.closest("a[data-lc-link]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    // hrefs carry the deploy base (e.g. /cocap-forum/); the router adds its own
    const href = a.getAttribute("href");
    const base = import.meta.env.BASE_URL;
    navigate(href.startsWith(base) ? "/" + href.slice(base.length) : href);
  };
  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Sidebar({ sections, pages, currentId, currentSection }) {
  return (
    <>
      <Link className="lc-brand" to={BASE}>
        <span className="lc-brand-title">Learning Center</span>
        <span className="lc-brand-sub">Central Oregon Civic Assembly on AI</span>
      </Link>
      <nav aria-label="Learning Center pages">
        <ul className="lc-nav">
          <li>
            <Link
              className="lc-nav-link"
              to={BASE}
              aria-current={currentId === "home" ? "page" : undefined}
            >
              <span className="lc-home-icon">
                <HomeIcon />
              </span>
              Home
            </Link>
          </li>
          {sections.map((s) => {
            const first = s.pages[0].id;
            const isCurrent = s.num === currentSection;
            return (
              <li key={s.num} className={`lc-nav-section${isCurrent ? " current" : ""}`}>
                <Link
                  className="lc-nav-link"
                  to={hrefFor(first)}
                  aria-current={s.single && currentId === first ? "page" : undefined}
                >
                  <span className="num" aria-hidden="true">
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                </Link>
                {!s.single && (
                  <ul className="lc-nav-pages">
                    {s.pages.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={hrefFor(p.id)}
                          className={p.sub ? "sub" : undefined}
                          aria-current={currentId === p.id ? "page" : undefined}
                        >
                          <span>{p.nav}</span>
                          {pages[p.id].status === "soon" && <span className="lc-soon-tag">Soon</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function Pager({ prev, next }) {
  return (
    <nav className="lc-pager" aria-label="Previous and next page">
      {prev && (
        <Link className="prev" to={hrefFor(prev.id)}>
          <span className="dir">
            <span aria-hidden="true">←</span> Previous
          </span>
          <span className="ttl">{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link className="next" to={hrefFor(next.id)}>
          <span className="dir">
            Next <span aria-hidden="true">→</span>
          </span>
          <span className="ttl">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}

function Home({ data }) {
  const { home, sections, pages, order } = data;
  const drafts = order.filter((id) => pages[id].status === "draft");
  const minutes = drafts.reduce((n, id) => n + pages[id].minutes, 0);
  const start = drafts[0] ?? order[0];
  return (
    <article>
      <h1 className="lc-home-title">{home.title}</h1>
      {home.subtitle && <p className="lc-home-sub">{home.subtitle}</p>}
      <Html className="lc-body lc-home-desc" html={home.html} />
      <div className="lc-home-actions">
        <Link className="lc-btn" to={hrefFor(start)}>
          Start reading <span aria-hidden="true">→</span>
        </Link>
        <span className="lc-home-progress">
          {drafts.length} of {order.length} pages available, about {minutes} minutes of reading
        </span>
      </div>
      <div className="lc-outline">
        {sections.map((s) => (
          <section key={s.num} className="lc-outline-section">
            <h2 className="lc-outline-head">
              <span className="num" aria-hidden="true">
                {s.num}
              </span>
              {s.title}
            </h2>
            <ul className="lc-outline-list">
              {s.pages.map((p) => {
                const page = pages[p.id];
                return (
                  <li key={p.id} className={p.sub ? "sub" : undefined}>
                    <div className="lc-outline-row">
                      <Link to={hrefFor(p.id)}>{page.title}</Link>
                      <StatusPill page={page} />
                      <span className="time">{page.minutes ? `${page.minutes} min read` : "—"}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <Pager next={pages[order[0]]} />
    </article>
  );
}

function Article({ data, page }) {
  const { sections, pages, order } = data;
  const section = sections.find((s) => s.num === page.section);
  const i = order.indexOf(page.id);
  const prev = i === 0 ? { id: "home", title: "Home" } : pages[order[i - 1]];
  const next = pages[order[i + 1]];
  return (
    <article>
      {!section.single && (
        <p className="lc-crumb">
          <Link to={hrefFor(section.pages[0].id)}>{section.title}</Link>
        </p>
      )}
      <h1 tabIndex={-1}>{page.title}</h1>
      <p className="lc-meta">
        <StatusPill page={page} />
        {page.minutes && <span>{page.minutes} min read</span>}
      </p>
      <Html className="lc-body" html={page.html} />
      <Pager prev={prev} next={next} />
    </article>
  );
}

export default function LearningCenter() {
  const { pageId } = useParams();
  const [navOpen, setNavOpen] = useState(false);
  const contentRef = useRef(null);
  const data = learning;

  const id = pageId ?? "home";
  const page = data.pages?.[id];

  // Title + focus the heading on page change (skip the first render).
  const first = useRef(true);
  useEffect(() => {
    setNavOpen(false);
    document.title = page ? `${page.title} | ${SITE_TITLE}` : SITE_TITLE;
    if (first.current) {
      first.current = false;
      return;
    }
    contentRef.current?.querySelector("h1")?.focus({ preventScroll: true });
  }, [id, page]);

  useEffect(() => {
    const prev = document.title;
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const body = useMemo(() => {
    if (data.error) {
      return (
        <article>
          <h1>Build error</h1>
          <pre className="lc-error">{data.error}</pre>
        </article>
      );
    }
    if (id === "home") return <Home data={data} />;
    if (!page) {
      return (
        <article>
          <h1 tabIndex={-1}>Page not found</h1>
          <p className="lc-meta">
            <Link to={BASE}>Back to the Learning Center</Link>
          </p>
        </article>
      );
    }
    return <Article data={data} page={page} />;
  }, [data, id, page]);

  return (
    <div className={`lc${navOpen ? " nav-open" : ""}`}>
      <header className="lc-topbar">
        <button
          className="lc-menu-btn"
          type="button"
          aria-controls="lc-sidebar"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((o) => !o)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Contents
        </button>
        <Link className="lc-topbar-brand" to={BASE}>
          Learning Center
        </Link>
      </header>
      <div className="lc-backdrop" onClick={() => setNavOpen(false)} />

      <div className="lc-layout">
        <aside
          className="lc-sidebar"
          id="lc-sidebar"
          aria-label="Contents"
          onClick={(e) => e.target.closest("a") && setNavOpen(false)}
        >
          {data.sections && (
            <Sidebar
              sections={data.sections}
              pages={data.pages}
              currentId={id}
              currentSection={page?.section}
            />
          )}
        </aside>
        <main className="lc-main">
          <div className="lc-content" ref={contentRef}>
            {body}
          </div>
        </main>
      </div>
    </div>
  );
}
