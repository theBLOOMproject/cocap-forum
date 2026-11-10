import { useMemo, useState } from "react";
import Rings from "../components/Rings.jsx";
import { layoutDelegates } from "../lib/delegates.js";

const SAMPLE_IDS = [18];

export default function ForumSection() {
  const nodes = useMemo(layoutDelegates, []);
  const [hovered, setHovered] = useState(null);
  const [showSamples, setShowSamples] = useState(true);

  const touch = () => {
    if (showSamples) setShowSamples(false);
  };

  const visible = hovered != null ? [hovered] : showSamples ? SAMPLE_IDS : [];

  return (
    <section className="ucg-section ucg-forum" id="forum">
      <Rings
        style={{ top: "50%", right: -460, transform: "translateY(-50%)" }}
        stroke="rgba(255,255,255,0.09)"
        width={42}
        radii={[200, 285, 370, 455]}
      />
      <div className="ucg-inner">
        <h2 className="ucg-forum-lead">
          Next, we organized a Two-Day Solutions Forum to develop broadly
          supported recommendations that could ensure the public has a meaningful
          role in AI-related decision making.
        </h2>

        <div className="ucg-split ucg-forum-split">
          <div className="ucg-forum-viz">
            <div className="ucg-cluster">
              <svg
                viewBox="0 0 200 200"
                role="group"
                aria-label="Forty delegates, who were selected to reflect Utah, Salt Lake and Cache Counties"
              >
                {nodes.map((n) => (
                  <circle
                    key={n.id}
                    className={`ucg-node${visible.includes(n.id) ? " is-on" : ""}`}
                    cx={n.cx}
                    cy={n.cy}
                    r="10.5"
                    tabIndex={0}
                    role="img"
                    aria-label={`Delegate from ${n.county} County, age ${n.age}, ${n.perspective}, ${n.race}`}
                    onMouseEnter={() => {
                      touch();
                      setHovered(n.id);
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => {
                      touch();
                      setHovered(n.id);
                    }}
                    onBlur={() => setHovered(null)}
                  />
                ))}
              </svg>

              {visible.map((id) => {
                const n = nodes[id];
                const low = n.cy < 46;
                const flip = n.cx > 100; // right half -> open the tip leftwards
                return (
                  <div
                    key={id}
                    className={`ucg-tip${low ? " ucg-tip-lo" : ""}${flip ? " ucg-tip-flip" : ""}`}
                    style={{ left: `${(n.cx / 200) * 100}%`, top: `${(n.cy / 200) * 100}%` }}
                  >
                    {n.county} County
                    <br />
                    {n.perspective}
                    <br />
                    {n.race}
                    <br />
                    Age {n.age}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ucg-forum-copy">
            <h3 className="ucg-forum-subhead">About the Solutions Forum</h3>
            <p className="ucg-forum-body">
              40 people, selected to reflect the demographics of Utah, Salt Lake and
              Cache Counties, convened for two full days in September to listen, talk
              and learn, and then developed policy recommendations that can help ensure the
              public has ample opportunity to play a positive role in AI policy decisions
              affecting the state going forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
