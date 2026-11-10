import { useMemo } from "react";
import Rings from "../components/Rings.jsx";
import { layoutDelegates } from "../lib/delegates.js";

export default function ForumSection() {
  const nodes = useMemo(layoutDelegates, []);

  return (
    <section className="ucg-section ucg-forum" id="forum">
      <Rings
        style={{ top: "50%", right: -460, transform: "translateY(-50%)" }}
        stroke="rgba(255,255,255,0.12)"
        width={42}
        radii={[200, 285, 370, 455]}
      />
      <div className="ucg-inner">
        <h2 className="ucg-forum-lead">
          Next, we will convene a Civic Assembly to develop broadly supported
          recommendations that ensure the public has a meaningful role in AI-related
          decision making.
        </h2>

        <div className="ucg-split ucg-forum-split">
          <div className="ucg-forum-viz">
            <div className="ucg-cluster">
              <svg
                viewBox="0 0 200 200"
                role="img"
                aria-label="A cluster of dots representing the Civic Assembly's delegate seats"
              >
                {nodes.map((n) => (
                  <circle key={n.id} className="ucg-node" cx={n.cx} cy={n.cy} r="10.5" />
                ))}
              </svg>
            </div>
          </div>

          <div className="ucg-forum-copy">
            <h3 className="ucg-forum-subhead">About the Civic Assembly</h3>
            <p className="ucg-forum-body">
              30&ndash;40 Central Oregonians, randomly selected to reflect the region&rsquo;s
              demographics &mdash; age, geography, political views, income, and more &mdash;
              will convene in December to listen, talk and learn. Together they will develop
              recommendations to make sure the public has a meaningful role in AI-related
              decisions, and those recommendations will go directly to local institutions,
              city and county officials, and state representatives.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
