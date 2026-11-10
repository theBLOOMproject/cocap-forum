import { Link } from "react-router-dom";
import Rings from "../components/Rings.jsx";

export default function NotFound() {
  return (
    <div className="ucg-page">
      <Rings style={{ top: -380, right: -340 }} />
      <div className="ucg-page-inner">
        <h1 className="ucg-display" style={{ maxWidth: "16ch" }}>
          Page <span className="o">not found.</span>
        </h1>
        <p className="ucg-body" style={{ maxWidth: "48ch" }}>
          That address doesn&rsquo;t lead anywhere on this site.
        </p>
        <Link className="ucg-link" to="/">
          Back to the Forum{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
