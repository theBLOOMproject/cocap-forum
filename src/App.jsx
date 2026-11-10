import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import DelegatesPage from "./pages/DelegatesPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import { SiteContext } from "./lib/navigation.js";
import { usePrefersReducedMotion } from "./lib/hooks.js";

// Split out: the Learning Center carries the whole reading library.
const LearningCenter = lazy(() => import("./pages/learning/LearningCenter.jsx"));

/** pathname -> NAV target, for highlighting the current nav item. */
const CURRENT_BY_PATH = {
  "/news": "news",
  "/delegates": "delegates",
};
const currentFor = (pathname) =>
  pathname === "/learning" || pathname.startsWith("/learning/")
    ? "learning"
    : CURRENT_BY_PATH[pathname] ?? null;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [invert, setInvert] = useState(false);

  const scrollToId = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    [reduced],
  );

  const go = useCallback(
    (item) => {
      if (item.kind === "anchor") {
        if (location.pathname === "/") {
          scrollToId(item.target);
          navigate(`/#${item.target}`, { replace: true });
        } else {
          navigate(`/#${item.target}`);
        }
        return;
      }
      // route
      navigate(item.target === "home" ? "/" : `/${item.target}`);
    },
    [location.pathname, navigate, scrollToId],
  );

  // Light nav treatment while any dark-background section is >55% on screen.
  // One observer over all of them, recomputing from the full picture, so the
  // hero/forum/signup hand-offs can't race.
  useEffect(() => {
    setInvert(false);
    const els = document.querySelectorAll(".ucg-hero, .ucg-forum, .ucg-signup");
    if (!els.length) return;
    const ratios = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio);
        setInvert([...ratios.values()].some((r) => r > 0.55));
      },
      { threshold: [0, 0.55, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location.pathname]);

  // Scroll behaviour on navigation: honour a hash, otherwise go to the top.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // wait a frame so the target section is mounted
      requestAnimationFrame(() => scrollToId(id));
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, location.hash, scrollToId]);

  const current = currentFor(location.pathname);
  const ctx = useMemo(() => ({ go }), [go]);

  return (
    <SiteContext.Provider value={ctx}>
      <div className="ucg">
        <Nav invert={invert} current={current} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/learning/:pageId?"
            element={
              <Suspense fallback={<div className="ucg-page" />}>
                <LearningCenter />
              </Suspense>
            }
          />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/delegates" element={<DelegatesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </SiteContext.Provider>
  );
}
