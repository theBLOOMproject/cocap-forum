import { useCallback, useEffect, useRef, useState } from "react";
import Rings from "../components/Rings.jsx";
import { STEPS, STEP_MS } from "../data.js";
import { usePrefersReducedMotion, useIsNarrow } from "../lib/hooks.js";

function CardImage({ image, style }) {
  if (!image) return null;
  return (
    <div className="ucg-card-img" style={style}>
      {image.placeholder ? (
        <span className="ucg-card-img-ph">{image.label} &middot; coming soon</span>
      ) : (
        <img src={image.src} alt={image.alt} />
      )}
    </div>
  );
}

function StepLink({ link, tabIndex }) {
  if (!link) return null;
  return (
    <a
      className="ucg-card-link"
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      tabIndex={tabIndex}
    >
      {link.label}
      <span aria-hidden="true">&#8599;</span>
    </a>
  );
}

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
      <div className="ucg-card-headrow">
        <button className="ucg-card-head" onClick={onClick} aria-expanded={open} disabled={open}>
          <h3 className="ucg-card-title">{step.title}</h3>
        </button>
        <StepLink link={step.link} />
      </div>
      <div className="ucg-card-reveal">
        <div>
          <div className="ucg-card-inner">
            <p className="ucg-card-blurb">{step.blurb}</p>
            <CardImage image={step.image} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ step, active }) {
  return (
    <div className="ucg-card is-open">
      <div className="ucg-card-pad">
        <div className="ucg-card-mhead">
          <h3 className="ucg-card-title">{step.title}</h3>
          <StepLink link={step.link} tabIndex={active ? 0 : -1} />
        </div>
        <CardImage image={step.image} style={{ marginTop: 16 }} />
        <p className="ucg-card-blurb" style={{ marginTop: 18 }}>
          {step.blurb}
        </p>
      </div>
    </div>
  );
}

export default function ProcessSection() {
  const reduced = usePrefersReducedMotion();
  const narrow = useIsNarrow(900);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const touchX = useRef(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Only run the per-frame progress loop while the section is on screen, so
  // it never competes with the user's scroll elsewhere on the page.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "0px 0px -20% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cycling = !reduced && !paused && !stopped && inView;

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

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
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
    <section className="ucg-section" id="process" ref={sectionRef}>
      <Rings
        style={{ top: "50%", left: -430, transform: "translateY(-50%)" }}
        radii={[180, 250, 320, 390, 460]}
      />
      <div className="ucg-inner">
        <div className="ucg-split">
          <div>
            <h2 className="ucg-display">
              AI has huge implications for{" "}
              <span className="o">Central Oregon&rsquo;s future&hellip;</span>
            </h2>
            <p className="ucg-body">
              &hellip;so starting in April 2026, we engaged Central Oregonians in dialogue
              about how AI is affecting people&rsquo;s lives, and how best to influence what
              happens next.
            </p>
          </div>

          {narrow ? (
            <div>
              <div className="ucg-carousel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div
                  className="ucg-carousel-track"
                  style={{ transform: `translateX(-${active * 100}%)` }}
                >
                  {STEPS.map((s, i) => (
                    <div className="ucg-carousel-cell" key={s.id}>
                      <MobileCard step={s} active={i === active} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="ucg-dots">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    className={i === active ? "is-on" : ""}
                    aria-label={s.title}
                    aria-current={i === active}
                    onClick={() => {
                      setStopped(true);
                      jump(i);
                    }}
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
                  key={s.id}
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
