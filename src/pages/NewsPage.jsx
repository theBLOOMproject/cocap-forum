import Rings from "../components/Rings.jsx";
import Arrow from "../components/Arrow.jsx";
import { NEWS } from "../data.js";

export default function NewsPage() {
  return (
    <div className="ucg-page">
      <Rings style={{ top: -380, right: -340 }} />
      <div className="ucg-page-inner">
        <h1 className="ucg-display" style={{ maxWidth: "18ch" }}>
          <span className="o">News.</span>
        </h1>

        <section className="ucg-lm-section ucg-lm-section-lead">
          <p className="ucg-lm-sub ucg-lm-lead">
            Coverage of the Utah Solutions Forum process and outcomes.
          </p>
          <div className="ucg-grid ucg-grid-2">
            {NEWS.map((item) => (
              <a
                key={item.url}
                className="ucg-source ucg-source-news"
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <div className="ucg-source-row">
                  <h3>{item.title}</h3>
                  <span className="ucg-source-arrow">
                    <Arrow size={22} color="var(--orange)" />
                  </span>
                </div>
                <p>{item.source}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
