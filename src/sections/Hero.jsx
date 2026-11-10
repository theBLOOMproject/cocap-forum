import Rings from "../components/Rings.jsx";
import { REPORT, SUPPORTERS } from "../data.js";
import { IMAGES } from "../images.js";
import { useSite } from "../lib/navigation.js";

export default function Hero() {
  const { go } = useSite();

  return (
    <section className="ucg-section ucg-hero" id="hero">
      <Rings style={{ top: -330, left: -300 }} />

      {/* Large cut-out photo: vertically centred, bleeding past the right edge,
          sitting behind the copy. Hidden on narrow screens (see styles.css). */}
      <div className="ucg-hero-media">
        <img src={IMAGES.hero.src} alt={IMAGES.hero.alt} />
      </div>

      <div className="ucg-inner">
        <div className="ucg-hero-copy">
          <h1 className="ucg-display">
            What role should the public have in shaping decisions related to AI?
          </h1>
          <p className="ucg-sub">
            A <span className="o">Solutions Forum,</span> hosted by Utah Common Ground
          </p>
          <a className="ucg-hero-report" href={REPORT.file} download={REPORT.download}>
            Read the Recommendations
          </a>

          <div style={{ marginTop: 56 }}>
            <p className="ucg-eyebrow">Supported by</p>
            <div className="ucg-marquee">
              <div className="ucg-marquee-track">
                {[...SUPPORTERS, ...SUPPORTERS].map((s, i) => {
                  const dupe = i >= SUPPORTERS.length;
                  const label = s.name.replace(/\n/g, " ");
                  return (
                    <div className="ucg-logo" key={i} aria-hidden={dupe}>
                      {s.logo ? (
                        <img src={s.logo} alt={dupe ? "" : label} loading="lazy" />
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
