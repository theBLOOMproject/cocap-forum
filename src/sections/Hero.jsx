import { useEffect, useState } from "react";
import Rings from "../components/Rings.jsx";
import { SUPPORTERS } from "../data.js";
import { IMAGES } from "../images.js";
import { useSite } from "../lib/navigation.js";
import { usePrefersReducedMotion } from "../lib/hooks.js";

const FRAME_MS = 5500;

/** Rounded frame that cross-fades through the hero photos. */
function HeroFrame() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const photos = IMAGES.hero;

  useEffect(() => {
    if (reduced || photos.length < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % photos.length), FRAME_MS);
    return () => clearInterval(id);
  }, [reduced, photos.length]);

  return (
    <div className="ucg-hero-frame">
      {photos.map((p, i) => (
        <img
          key={p.src}
          src={p.src}
          alt={i === active ? p.alt : ""}
          aria-hidden={i !== active}
          className={i === active ? "is-on" : ""}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="ucg-hero-frame-dots" role="group" aria-label="Choose photo">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className={i === active ? "is-on" : ""}
            aria-label={`Photo ${i + 1} of ${photos.length}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { go } = useSite();

  return (
    <section className="ucg-section ucg-hero" id="hero">
      <Rings
        style={{ top: -330, left: -300 }}
        stroke="rgba(255,255,255,0.07)"
      />

      <div className="ucg-inner">
        <div className="ucg-split ucg-hero-split">
          <div className="ucg-hero-copy">
            <h1 className="ucg-display">
              What role should the public have in shaping decisions related to AI?
            </h1>
            <p className="ucg-sub">
              A <span className="o">Civic Assembly,</span> hosted by the Central Oregon Civic
              Action Project
            </p>

            <div style={{ marginTop: 56 }}>
              <p className="ucg-eyebrow">Supported by</p>
              <div className="ucg-marquee">
                <div className="ucg-marquee-track">
                  {[...SUPPORTERS, ...SUPPORTERS].map((s, i) => {
                    const dupe = i >= SUPPORTERS.length;
                    return (
                      <div className="ucg-logo" key={i} aria-hidden={dupe || s.placeholder}>
                        {s.placeholder ? (
                          <span className="ucg-logo-ph">Logo</span>
                        ) : s.logo ? (
                          <img src={s.logo} alt={dupe ? "" : s.name} loading="lazy" />
                        ) : (
                          s.name
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* hidden on narrow screens (see styles.css) */}
          <div className="ucg-hero-media">
            <HeroFrame />
          </div>
        </div>
      </div>

      {/* mobile-only: jump to the first content section */}
      <button
        className="ucg-hero-cta"
        onClick={() => go({ kind: "anchor", target: "process" })}
      >
        Learn more
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
