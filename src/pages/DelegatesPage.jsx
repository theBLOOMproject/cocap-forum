import { useState } from "react";
import Rings from "../components/Rings.jsx";
import { PORTAL_CODE, PORTAL_DOC, PORTAL_CONTACT_EMAIL, SCHEDULE } from "../data.js";

const TABS = ["Basic Information", "Schedule"];

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
                    {s.facts && (
                      <dl className="ucg-facts">
                        {s.facts.map((f) => (
                          <div className="ucg-fact" key={f.label}>
                            <dt>{f.label}</dt>
                            <dd>
                              {f.lines.map((l) => (
                                <span key={l}>{l}</span>
                              ))}
                              {f.link && (
                                <a href={f.link.href} target="_blank" rel="noreferrer noopener">
                                  {f.link.label} <span aria-hidden="true">&#8599;</span>
                                </a>
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {s.p?.map((t, i) => (
                      <p key={i}>{t}</p>
                    ))}
                    {s.ul && (
                      <ul>
                        {s.ul.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                    {s.youtube && (
                      <div className="ucg-doc-video">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${s.youtube.id}`}
                          title={s.youtube.title}
                          loading="lazy"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </section>
                ))}

              {tab === "Schedule" && !SCHEDULE && (
                <section>
                  <h2>Schedule</h2>
                  <p>Coming soon.</p>
                </section>
              )}

              {tab === "Schedule" && SCHEDULE && (
                <section>
                  <h2>Schedule</h2>
                  <p className="ucg-doc-wide ucg-sched-day">
                    {SCHEDULE.day}: {SCHEDULE.title}
                  </p>
                  <div className="ucg-sched">
                    {SCHEDULE.items.map((it) => (
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
