import { useState } from "react";
import Rings from "../components/Rings.jsx";
import Arrow from "../components/Arrow.jsx";
import {
  PORTAL_CODE,
  PORTAL_DOC,
  PORTAL_CONTACT_EMAIL,
  BREAKOUT_DOCS,
  DAY1_SCHEDULE,
} from "../data.js";

const TABS = ["Basic Information", "Day 1", "Day 2"];

export default function DelegatesPage() {
  const [pass, setPass] = useState("");
  const [bad, setBad] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(TABS[0]);

  const submit = () => {
    if (pass.trim().toLowerCase() === PORTAL_CODE) {
      setOpen(true);
      setBad(false);
    } else {
      setBad(true);
    }
  };

  return (
    <div className="ucg-page">
      <Rings style={{ top: -380, left: -340 }} />
      <div className="ucg-page-inner">
        <h1 className="ucg-display" style={{ maxWidth: "20ch" }}>
          Delegate <span className="o">portal.</span>
        </h1>

        {!open ? (
          <div className="ucg-gate">
            <h2>Enter your access code</h2>
            <p>
              Delegates received a code by email with their confirmation. Lost it? Contact the
              coordination team.
            </p>
            <input
              type="password"
              value={pass}
              className={bad ? "is-bad" : ""}
              placeholder="Access code"
              aria-label="Access code"
              aria-invalid={bad}
              onChange={(e) => {
                setPass(e.target.value);
                setBad(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
            {bad && (
              <p style={{ color: "#B4441C", fontSize: 14, fontWeight: 600, margin: "12px 0 0" }}>
                That code doesn&rsquo;t match. Check the email, or request a new code.
              </p>
            )}
            <button className="ucg-btn" onClick={submit}>
              Unlock the portal
            </button>
            <p className="ucg-gate-note">
              Prototype: the code is <strong>{PORTAL_CODE}</strong>. Not real authentication.
            </p>
          </div>
        ) : (
          <>
            <div className="ucg-tabs" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  className={`ucg-tab${tab === t ? " is-active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="ucg-doc">
              {tab === "Basic Information" &&
                PORTAL_DOC.map((s) => (
                  <section key={s.h}>
                    <h2>{s.h}</h2>
                    {s.p.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                    {s.ul && (
                      <ul>
                        {s.ul.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}

              {tab === "Day 1" && (
                <section>
                  <h2>Breakout Documents</h2>
                  <p className="ucg-doc-wide">
                    Access the documents for your breakout groups here, including notes, feedback,
                    and more.
                  </p>
                  <div className="ucg-grid">
                    {BREAKOUT_DOCS.map((d) => (
                      <a
                        key={d.title}
                        className="ucg-source"
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="ucg-source-row">
                          <h3>{d.title}</h3>
                          <span className="ucg-source-arrow">
                            <Arrow size={22} color="var(--orange)" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {tab === "Day 1" && (
                <section>
                  <h2>Schedule</h2>
                  <p className="ucg-doc-wide ucg-sched-day">
                    {DAY1_SCHEDULE.day}: {DAY1_SCHEDULE.title}
                  </p>
                  <div className="ucg-sched">
                    {DAY1_SCHEDULE.items.map((it) => (
                      <div className="ucg-sched-row" key={it.time + it.label}>
                        <span className="ucg-sched-time">{it.time}</span>
                        <span className="ucg-sched-label">
                          {it.label}
                          {it.note && <span className="ucg-sched-note">{it.note}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tab === "Day 2" && (
                <section>
                  <p>Coming Soon</p>
                </section>
              )}

              <p className="ucg-doc-contact">
                Contact{" "}
                <a href={`mailto:${PORTAL_CONTACT_EMAIL}`}>{PORTAL_CONTACT_EMAIL}</a> with any
                questions.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
