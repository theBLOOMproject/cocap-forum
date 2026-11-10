import Rings from "../components/Rings.jsx";
import { ACCESS_MATERIALS } from "../data.js";

function SourceCard({ item, primary }) {
  const isFile = Boolean(item.file);
  return (
    <a
      className={`ucg-source${primary ? " ucg-source-primary" : ""}`}
      href={isFile ? item.file : item.url}
      {...(isFile ? { download: item.download ?? "" } : {})}
    >
      <h3>{item.title}</h3>
      <p>From {item.source}</p>
      {isFile && <span className="ucg-source-file">↓ Download{item.kind ? ` ${item.kind}` : ""}</span>}
    </a>
  );
}

// Interim page — the Learning Center is being rebuilt around the BLOOM wiki
// (theBLOOMproject/wiki-playground).
export default function LearningPage() {
  return (
    <div className="ucg-page">
      <Rings style={{ top: -380, right: -340 }} />
      <div className="ucg-page-inner">
        <h1 className="ucg-display" style={{ maxWidth: "18ch" }}>
          Learning <span className="o">center.</span>
        </h1>

        <section className="ucg-lm-section ucg-lm-section-lead">
          <p className="ucg-lm-sub ucg-lm-lead">
            Background materials on AI in Central Oregon, prepared for Civic Assembly
            delegates and anyone following along.
          </p>
          {ACCESS_MATERIALS.length > 0 ? (
            <div className="ucg-grid">
              {ACCESS_MATERIALS.map((item) => (
                <SourceCard item={item} primary key={item.title} />
              ))}
            </div>
          ) : (
            <p className="ucg-lm-sub">Coming soon.</p>
          )}
        </section>
      </div>
    </div>
  );
}
