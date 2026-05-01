"use client";

import { useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { I } from "./Icons";

interface Props {
  onSubmit: (data: { url: string; audience: string }) => void;
}

const TRY_URLS = ["stripe.com", "linear.app", "notion.so", "vercel.com"];

const FEATURES = [
  {
    icon: <I.Users size={14} />,
    title: "Persona profiles",
    meta: "archetype · tagline",
    desc: "Detected user segments with archetype names, taglines, demographics and role context — no clip art, no stock photos.",
  },
  {
    icon: <I.Target size={14} />,
    title: "Goals & JTBD",
    meta: "primary · secondary",
    desc: "Primary and supporting jobs-to-be-done with success criteria. What 'good' looks like in the user's own words.",
  },
  {
    icon: <I.Wand size={14} />,
    title: "Pain points & barriers",
    meta: "risk · severity",
    desc: "Frustrations, blockers, and adoption barriers — each tagged with severity so the team can triage.",
  },
  {
    icon: <I.Quote size={14} />,
    title: "Voice-of-user quotes",
    meta: "goal · frustration",
    desc: "Representative quotes synthesized from your site copy and any uploaded research, attributed to each persona.",
  },
  {
    icon: <I.Document size={14} />,
    title: "Interview guide",
    meta: "12–18 questions",
    desc: "A ready-to-use research script with warm-up, core, and closing questions. Drop into a Doc and run it.",
  },
  {
    icon: <I.Layers size={14} />,
    title: "Print-ready PDF",
    meta: "≈ 19 pages",
    desc: "Cover, contents, persona spreads, journey snapshot, design implications. Stable share link, no install.",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "Paste a URL",
    meta: "GET /analyze → 200",
    desc: "Drop in any public site. We crawl the homepage and one level deep, render with a real engine, and read your copy in context.",
  },
  {
    step: "02",
    title: "We synthesize",
    meta: "segments: 4 · roles: 7",
    desc: "Audience cues get clustered into segments. JTBDs are extracted. Pain points are scored. Each persona gets a coherent profile.",
  },
  {
    step: "03",
    title: "Download a PDF",
    meta: "/r/9kR2vH.pdf",
    desc: "A print-ready PDF you can hand off, share, or print. Re-runs produce a fresh file you can download again.",
  },
];

const PDF_BULLETS = [
  "Cover, table of contents, and section dividers",
  "One detailed spread per persona (≈4 pages)",
  "Goals, JTBDs, pain points, and quotes",
  "Behaviors, channels, and tools profile",
  "Journey snapshot per persona",
  "Interview guide with 12–18 questions",
  "Design implications and next research",
  "Assumptions & open questions called out explicitly",
];

const FAQS: [string, string][] = [
  [
    "Is it really free?",
    "Yes. There is no payment, no subscription. S3 Labs apps are one-time tools or quietly free; this one is free.",
  ],
  [
    "What sites can I analyze?",
    "Any public website. Heavier sites (Notion, Linear) take ~30–60 seconds because we render the full page in a real browser before reading the copy.",
  ],
  [
    "How long does generation take?",
    "Most runs finish in 30 to 60 seconds. We tell you what step you're on while you wait.",
  ],
  [
    "Can I edit the PDF afterwards?",
    "The download is a flat PDF. Re-running the analysis produces a fresh file.",
  ],
  [
    "Do you store my data?",
    "Your generation lives only in this tab — close it and it's gone. Nothing is persisted server-side.",
  ],
  [
    "What else is like this?",
    "DropDoc, our companion app, does the same trick for any HTML report you have lying around.",
  ],
];

export default function LandingPage({ onSubmit }: Props) {
  const [url, setUrl] = useState("");
  const [audience, setAudience] = useState("");

  const submit = () => {
    const u = url.trim();
    const a = audience.trim();
    if (!u || !a) return;
    onSubmit({ url: u, audience: a });
  };

  const canSubmit = url.trim().length > 0 && audience.trim().length > 0;

  return (
    <>
      <AppHeader mode="landing" />

      <section style={{ position: "relative", padding: "64px 0 48px", textAlign: "center" }}>
        <div className="grain" />
        <div className="ss-container" style={{ position: "relative" }}>
          <span className="eyebrow">
            <span className="dot" />a tiny utility from s3 labs
          </span>

          <h1 className="h-display" style={{ marginTop: 18 }}>
            Generate professional personas. <span className="brand">In just minutes.</span>
          </h1>

          <p className="lead" style={{ marginTop: 18 }}>
            Enter a website URL and a target audience. Get a comprehensive, beautifully formatted PDF
            documenting goals, behaviors, pain points, and jobs-to-be-done — for every persona in your product.
          </p>

          <div className="url-row">
            <span className="scheme">https://</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yoursite.com"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={!canSubmit}
              style={{ gap: 8 }}
            >
              Generate <I.Arrow size={14} />
            </button>
          </div>

          <div className="audience-row">
            <span className="label">Audience</span>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. solo founders shipping side projects"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <div className="try-row">
            <span className="label">try:</span>
            {TRY_URLS.map((u) => (
              <button key={u} className="try-chip" onClick={() => setUrl(u)}>
                {u}
              </button>
            ))}
          </div>

          <div className="stat-row">
            <div className="stat">
              <div className="stat-value">≈ 38s</div>
              <div className="stat-label">average run</div>
            </div>
            <div className="stat">
              <div className="stat-value">3</div>
              <div className="stat-label">personas</div>
            </div>
            <div className="stat">
              <div className="stat-value">0</div>
              <div className="stat-label">accounts to create</div>
            </div>
            <div className="stat">
              <div className="stat-value">∞</div>
              <div className="stat-label">re-runs</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="ss-container">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="eyebrow">
              <span className="dot" />features
            </span>
            <h2 className="h-section">
              Everything a research deck needs.{" "}
              <span className="muted">Nothing it doesn&apos;t.</span>
            </h2>
            <p className="lead" style={{ margin: "6px 0 0", textAlign: "left" }}>
              Six things, done well. Built for the product team&apos;s first-week kickoff, not the demo
              reel.
            </p>
          </div>

          <div className="feature-grid">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} meta={f.meta} desc={f.desc} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-band" id="how">
        <div className="ss-container">
          <span className="eyebrow">
            <span className="dot" />how it works
          </span>
          <h2 className="h-section" style={{ marginTop: 6 }}>
            Three steps. <span className="muted">One minute.</span>
          </h2>

          <div className="feature-grid" style={{ marginTop: 28 }}>
            {HOW_STEPS.map((s) => (
              <FeatureCard
                key={s.step}
                step={s.step}
                title={s.title}
                meta={s.meta}
                desc={s.desc}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div
          className="ss-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <span className="eyebrow">
              <span className="dot" />output
            </span>
            <h2 className="h-section" style={{ marginTop: 6 }}>
              A PDF you&apos;d hand to a director. <span className="muted">Properly typeset.</span>
            </h2>
            <p
              className="lead"
              style={{ margin: "14px 0 0", textAlign: "left", maxWidth: "none" }}
            >
              The output is a print-ready PDF designed for the workshop wall and the Notion handoff.
              No marketing fluff — just the persona work, indexed and findable.
            </p>
            <ul className="bullet-list" style={{ marginTop: 24 }}>
              {PDF_BULLETS.map((t, i) => (
                <li key={i}>
                  <I.Check size={13} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <PdfPeek />
        </div>
      </section>

      <section className="section" id="faq">
        <div className="ss-container-narrow">
          <span className="eyebrow">
            <span className="dot" />FAQ
          </span>
          <h2 className="h-section" style={{ marginTop: 6, textAlign: "left" }}>
            Things worth asking.
          </h2>
          <div style={{ marginTop: 22, borderTop: "1px solid var(--surface-border)" }}>
            {FAQS.map(([q, a], i) => (
              <FaqRow key={i} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      <AppFooter />
    </>
  );
}

function FeatureCard({
  icon,
  step,
  title,
  desc,
  meta,
}: {
  icon?: React.ReactNode;
  step?: string;
  title: string;
  desc: string;
  meta?: string;
}) {
  return (
    <div className="feature-card">
      <span className="feature-icon">
        {step ? (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: 12,
              color: "var(--brand)",
            }}
          >
            {step}
          </span>
        ) : (
          icon
        )}
      </span>
      <div className="feature-title">{title}</div>
      <div className="feature-desc">{desc}</div>
      {meta && <div className="feature-meta">{meta}</div>}
    </div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-row${open ? " is-open" : ""}`}>
      <button onClick={() => setOpen((o) => !o)}>
        {q}
        <I.Plus size={14} />
      </button>
      {open && <p>{a}</p>}
    </div>
  );
}

function PdfPeek() {
  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 480,
        marginLeft: "auto",
        maxWidth: "100%",
      }}
    >
      <div
        className="deck-page behind1"
        style={{
          position: "absolute",
          inset: 0,
          transform: "translate(-22px, 14px) rotate(-3deg)",
        }}
      >
        <div style={{ height: 8, width: 60, background: "#e7e7eb", borderRadius: 2 }} />
      </div>
      <div
        className="deck-page front"
        style={{ position: "absolute", inset: 0, padding: "26px 28px" }}
      >
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 900,
            fontSize: 22,
            color: "#0a0a0a",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Stripe
          <br />
          User personas
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: "#6b7280" }}>Research deck · v1.0</div>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          <span style={{ width: 28, height: 28, borderRadius: 6, background: "#635bff" }} />
          <span style={{ width: 28, height: 28, borderRadius: 6, background: "#0a2540" }} />
          <span style={{ width: 28, height: 28, borderRadius: 6, background: "#00d4ff" }} />
          <span style={{ width: 28, height: 28, borderRadius: 6, background: "#ffb74d" }} />
        </div>
        <div style={{ marginTop: 22 }}>
          <div style={{ fontWeight: 900, fontSize: 14, color: "#0a0a0a" }}>
            The Embedding Engineer
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
            Builder · Late-stage SaaS
          </div>
          <div style={{ marginTop: 14, height: 6, width: "82%", background: "#eee", borderRadius: 2 }} />
          <div style={{ marginTop: 6, height: 6, width: "70%", background: "#eee", borderRadius: 2 }} />
          <div style={{ marginTop: 6, height: 6, width: "78%", background: "#eee", borderRadius: 2 }} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 28,
            right: 28,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#a1a1aa",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>personas · v1.0</span>
          <span>p.1</span>
        </div>
      </div>
    </div>
  );
}
