"use client";

import { useState } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { I } from "./Icons";
import type { GenerationResult, Persona } from "@/types";

interface Props {
  result: GenerationResult;
  sourceUrl: string;
  description: string;
  isDownloading: boolean;
  onGenerateNew: () => void;
  onDownloadPDF: () => void;
}

export default function OutputScreen({
  result,
  sourceUrl,
  description,
  isDownloading,
  onGenerateNew,
  onDownloadPDF,
}: Props) {
  const [active, setActive] = useState(0);
  const personas = result.personas;
  const p = personas[active];

  const totalGoals = personas.reduce(
    (sum, x) => sum + (x.goals?.primary?.length ?? 0),
    0
  );
  const totalPains = personas.reduce(
    (sum, x) => sum + (x.painPoints?.challenges?.length ?? 0),
    0
  );
  const pdfPages = personas.length * 4 + 7;

  const generatedAt = new Date(result.generatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <>
      <AppHeader mode="output" onNew={onGenerateNew} />

      <section style={{ position: "relative", padding: "56px 0 36px", textAlign: "center" }}>
        <div className="grain" />
        <div className="ss-container" style={{ position: "relative" }}>
          <span className="success-mark">
            <I.Check size={26} sw={2.4} />
          </span>
          <h1
            className="h-display"
            style={{ fontSize: "clamp(36px, 4.6vw, 54px)" }}
          >
            Your personas have been <span className="brand">completed.</span>
          </h1>
          <p className="lead" style={{ marginTop: 16 }}>
            We read the page, clustered the audience cues, and drafted{" "}
            {personas.length} coherent{" "}
            {personas.length === 1 ? "persona" : "personas"} with goals, JTBDs, pain
            points, and an interview guide. Open one to inspect, or download the PDF.
          </p>

          <div className="metrics-row">
            <Metric icon={<I.Users size={14} />} num={personas.length} lab="personas" />
            <Metric icon={<I.Target size={14} />} num={totalGoals} lab="goals" />
            <Metric icon={<I.Wand size={14} />} num={totalPains} lab="pain points" />
            <Metric icon={<I.Document size={14} />} num={pdfPages} lab="pdf pages" />
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 24px" }}>
        <div className="ss-container">
          <div className="layout-twocol">
            <div className="panel">
              <div className="panel-head">
                <h3>PDF preview</h3>
                <span className="meta">
                  {pdfPages} pages · v1.0
                </span>
              </div>
              <div
                className="panel-body"
                style={{
                  padding: "32px 22px 36px",
                  background:
                    "radial-gradient(420px 240px at 50% 30%, rgba(46,157,241,.06), transparent 70%)",
                }}
              >
                <DeckPreview persona={p} productName={result.productName} pageNum={active + 4} />
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                  }}
                >
                  generated {generatedAt} · source {sourceUrl}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--surface-border)" }}>
                <div className="persona-list">
                  {personas.map((pp, i) => (
                    <button
                      key={pp.id ?? i}
                      type="button"
                      className={"persona-card" + (i === active ? " is-active" : "")}
                      onClick={() => setActive(i)}
                    >
                      <span className="persona-avatar">
                        {(pp.type ?? "P").charAt(0).toUpperCase()}
                      </span>
                      <div className="name">{pp.type ?? "Persona"}</div>
                      <div className="arch">{pp.tagline ?? ""}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="side-stack">
              <div className="side-card">
                <h4>Download deck</h4>
                <p>
                  Print-ready PDF, ≈{pdfPages} pages. Re-runs produce a fresh file you can download
                  again.
                </p>
                <button className="download" onClick={onDownloadPDF} disabled={isDownloading}>
                  <I.Download size={14} sw={2} />
                  {isDownloading ? "Preparing PDF…" : "Download PDF"}
                </button>
                <button className="secondary" onClick={onGenerateNew}>
                  <I.Refresh size={13} /> Run another analysis
                </button>
              </div>

              <div className="side-card">
                <h4>What&apos;s in the deck</h4>
                <ul className="bullet-list">
                  {[
                    "Cover & table of contents",
                    "Executive summary",
                    `${personas.length} persona ${personas.length === 1 ? "spread" : "spreads"}`,
                    "Behaviors, channels, and tools profile",
                    "Pain points",
                    "Journey snapshot",
                    "Interview guide",
                    "Design implications",
                    "Assumptions & open questions",
                  ].map((t, i) => (
                    <li key={i}>
                      <I.Check size={13} /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="side-card">
                <h4>Source</h4>
                <p
                  style={{
                    marginTop: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--brand)",
                  }}
                >
                  <I.External size={12} /> {sourceUrl}
                </p>
                {description && (
                  <p
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    Description:{" "}
                    <span style={{ color: "var(--text-secondary)" }}>
                      &ldquo;{description}&rdquo;
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 0 8px" }}>
        <div className="ss-container">
          <div className="panel">
            <div className="panel-head">
              <h3>
                Persona · {String(active + 1).padStart(2, "0")} of{" "}
                {String(personas.length).padStart(2, "0")}
              </h3>
              <span className="meta">
                {(p?.type ?? "persona").toLowerCase().replace(/\s+/g, "-")}.json
              </span>
            </div>
            <div className="panel-body" style={{ padding: "26px 26px 22px" }}>
              <PersonaDetail persona={p} />
            </div>
          </div>
        </div>
      </section>

      {result.interviewGuide && (
        <section style={{ padding: "16px 0 8px" }}>
          <div className="ss-container">
            <div className="panel">
              <div className="panel-head">
                <h3>Interview guide</h3>
                <span className="meta">
                  {result.interviewGuide.coreQuestions?.length ?? 0} categories
                </span>
              </div>
              <div className="panel-body">
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {result.interviewGuide.introduction}
                </p>
                <p
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--brand)",
                  }}
                >
                  {(result.interviewGuide.warmupQuestions?.length ?? 0) +
                    (result.interviewGuide.coreQuestions?.reduce(
                      (s, c) => s + (c.questions?.length ?? 0),
                      0
                    ) ?? 0) +
                    (result.interviewGuide.closingQuestions?.length ?? 0)}{" "}
                  questions included in the PDF
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "16px 0 80px" }}>
        <div className="ss-container">
          <div className="panel">
            <div className="panel-head">
              <h3>Deck structure</h3>
              <span className="meta">{pdfPages} pages · pdf</span>
            </div>
            <div className="section-list">
              {buildDeckStructure(personas, pdfPages).map(([n, pg]) => (
                <div key={n} className="row">
                  <span className="name">{n}</span>
                  <span className="pages">{pg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </>
  );
}

function Metric({
  icon,
  num,
  lab,
}: {
  icon: React.ReactNode;
  num: number;
  lab: string;
}) {
  return (
    <div className="metric">
      <span className="glyph">{icon}</span>
      <div className="num">{num}</div>
      <div className="lab">{lab}</div>
    </div>
  );
}

function PersonaDetail({ persona }: { persona: Persona | undefined }) {
  if (!persona) return null;
  const goals = persona.goals?.primary ?? [];
  const pains = persona.painPoints?.challenges ?? [];
  const jtbd =
    persona.goals?.successDefinition ??
    persona.scenarios?.[0] ??
    persona.background?.summary ??
    "";
  const quote = persona.quotes?.[0];
  const demo = persona.demographics;
  const role = persona.role?.title ?? "—";

  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
        <span
          className="persona-avatar"
          style={{ width: 56, height: 56, fontSize: 22, color: "#fff", background: "var(--brand)" }}
        >
          {(persona.type ?? "P").charAt(0).toUpperCase()}
        </span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--brand)",
            }}
          >
            {persona.background?.workContext ?? persona.role?.title ?? "persona"}
          </div>
          <h2
            style={{
              margin: "4px 0 0",
              fontFamily: "var(--font-sans)",
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            {persona.type}
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 15,
              maxWidth: "60ch",
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            {persona.tagline}
          </p>
        </div>
        <div
          style={{
            textAlign: "right",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-tertiary)",
            lineHeight: 1.7,
            minWidth: 160,
          }}
        >
          <DemoLine label="age" value={demo?.ageRange} />
          <DemoLine label="role" value={role} />
          <DemoLine label="region" value={demo?.location} />
          <DemoLine label="tech" value={persona.technology?.techComfort} />
        </div>
      </div>

      <div
        style={{
          marginTop: 26,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
        }}
      >
        <DetailBlock
          title="Primary goals"
          items={goals.length > 0 ? goals : ["—"]}
          variant="brand"
        />
        <DetailBlock
          title="Pain points"
          items={pains.length > 0 ? pains : ["—"]}
          variant="danger"
        />
      </div>

      {jtbd && (
        <div
          style={{
            marginTop: 22,
            background: "rgba(46,157,241,.05)",
            border: "1px solid rgba(46,157,241,.18)",
            borderRadius: 10,
            padding: "16px 20px",
          }}
        >
          <div className="eyebrow">
            <span className="dot" />
            job-to-be-done
          </div>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 15,
              color: "var(--text-primary)",
              lineHeight: 1.55,
              fontStyle: "italic",
            }}
          >
            &ldquo;{jtbd}&rdquo;
          </p>
        </div>
      )}

      {quote && (
        <div
          style={{
            marginTop: 18,
            padding: "16px 20px",
            borderLeft: "2px solid var(--brand)",
            background: "var(--surface-2)",
            borderRadius: "0 10px 10px 0",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--brand)",
            }}
          >
            voice of user
          </div>
          <blockquote
            style={{
              margin: "6px 0 0",
              fontSize: 18,
              color: "var(--text-primary)",
              fontWeight: 700,
              lineHeight: 1.4,
              letterSpacing: "-0.005em",
            }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
        </div>
      )}
    </>
  );
}

function DemoLine({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ color: "var(--brand)" }}>
      {label}{" "}
      <span style={{ color: "var(--text-secondary)" }}>{value ?? "—"}</span>
    </div>
  );
}

function DetailBlock({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "brand" | "danger";
}) {
  const dot = variant === "danger" ? "var(--danger)" : "var(--brand)";
  return (
    <div>
      <div className="eyebrow">
        <span className="dot" style={{ background: dot }} />
        {title}
      </div>
      <ul className="bullet-list" style={{ marginTop: 10 }}>
        {items.map((it, i) => (
          <li key={i}>
            <I.Check size={13} style={{ color: dot }} />
            <span style={{ color: "var(--text-primary)" }}>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeckPreview({
  persona,
  productName,
  pageNum,
}: {
  persona: Persona | undefined;
  productName: string;
  pageNum: number;
}) {
  const title = (productName ?? "User personas").trim();
  return (
    <div className="deck">
      <div className="deck-page behind2">
        <div style={{ height: 8, width: 80, background: "#e7e7eb", borderRadius: 2 }} />
      </div>
      <div className="deck-page behind1">
        <div style={{ height: 8, width: 60, background: "#e7e7eb", borderRadius: 2 }} />
      </div>
      <div className="deck-page front">
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
          {title}
          <br />
          User personas
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: "#6b7280" }}>Research deck · v1.0</div>
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          <span style={{ width: 22, height: 22, borderRadius: 5, background: "#635bff" }} />
          <span style={{ width: 22, height: 22, borderRadius: 5, background: "#0a2540" }} />
          <span style={{ width: 22, height: 22, borderRadius: 5, background: "#00d4ff" }} />
          <span style={{ width: 22, height: 22, borderRadius: 5, background: "#ffb74d" }} />
        </div>
        {persona && (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: "#0a0a0a" }}>{persona.type}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
              {persona.background?.workContext ?? persona.role?.title ?? ""}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 10,
                color: "#6b7280",
                lineHeight: 1.5,
              }}
            >
              &ldquo;{persona.tagline}&rdquo;
            </div>
            <div style={{ marginTop: 14, height: 5, width: "82%", background: "#eee", borderRadius: 2 }} />
            <div style={{ marginTop: 5, height: 5, width: "70%", background: "#eee", borderRadius: 2 }} />
            <div style={{ marginTop: 5, height: 5, width: "78%", background: "#eee", borderRadius: 2 }} />
            <div style={{ marginTop: 5, height: 5, width: "62%", background: "#eee", borderRadius: 2 }} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 26,
            right: 26,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "#a1a1aa",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>personas · v1.0</span>
          <span>p.{pageNum}</span>
        </div>
      </div>
    </div>
  );
}

function buildDeckStructure(personas: Persona[], totalPages: number): [string, string][] {
  const rows: [string, string][] = [
    ["01 Cover", "p.1"],
    ["02 Table of contents", "p.2"],
    ["03 Executive summary", "p.3"],
  ];
  let pageCursor = 4;
  personas.forEach((p, i) => {
    const start = pageCursor;
    const end = pageCursor + 3;
    rows.push([
      `0${i + 4} Persona · ${p.type ?? `Persona ${i + 1}`}`,
      `p.${start}–${end}`,
    ]);
    pageCursor = end + 1;
  });
  rows.push([`${String(rows.length + 1).padStart(2, "0")} Interview guide`, `p.${pageCursor}–${pageCursor + 1}`]);
  rows.push([`${String(rows.length + 1).padStart(2, "0")} Open questions`, `p.${totalPages}`]);
  return rows;
}
