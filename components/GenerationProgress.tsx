"use client";

import { useEffect, useRef, useState } from "react";
import AppHeader from "./AppHeader";
import { I } from "./Icons";

interface Props {
  url: string;
  audience: string;
  elapsedTime: number;
  isFinishing: boolean;
  onCancel: () => void;
}

const STEPS = [
  { id: "fetch", label: "Fetching website", icon: <I.Globe size={13} /> },
  { id: "audience", label: "Reading audience cues", icon: <I.Search size={13} /> },
  { id: "segments", label: "Clustering segments", icon: <I.Layers size={13} /> },
  { id: "personas", label: "Drafting personas", icon: <I.Users size={13} /> },
  { id: "format", label: "Formatting PDF", icon: <I.Document size={13} /> },
];

const LOG_LINES = [
  "fetch · /pricing · 200",
  "fetch · /customers · 200",
  "tokens: copy=4,212 · headings=38",
  "audience cues: 19 phrases extracted",
  "clustering · 4 candidate segments",
  "merge: 'devs (early)' + 'devs (mature)' → 1",
  "scoring pain points · n=27",
  "persona drafted · #1",
  "persona drafted · #2",
  "persona drafted · #3",
  "JTBD extraction · 12 statements",
  "interview guide · 16 questions",
  "typeset · cover · TOC · 19 pages",
];

const PREVIEW_NAMES = [
  "The Embedding Engineer",
  "The Platform PM",
  "The Indie Founder",
];

const fmtElapsed = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return (m > 0 ? `${m}m ` : "") + `${r}s`;
};

export default function GenerationProgress({
  url,
  audience,
  elapsedTime,
  isFinishing,
  onCancel,
}: Props) {
  // Progress ramps from 8 → 90 over the elapsed seconds, then jumps to 100 when isFinishing.
  // 90 / ~50s ≈ 1.6%/s; we randomize a touch so the bar feels alive.
  const [progress, setProgress] = useState(8);
  const [logs, setLogs] = useState<{ t: string; msg: string }[]>([
    { t: "00:00", msg: `GET /analyze?url=${url}` },
    { t: "00:01", msg: "200 OK · render started" },
  ]);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) return;
    if (isFinishing) {
      finishedRef.current = true;
      setProgress(100);
      return;
    }
    const id = setTimeout(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        const bump = p < 80 ? 1.6 + Math.random() * 1.4 : 0.4 + Math.random() * 0.6;
        return Math.min(92, p + bump);
      });
    }, 600);
    return () => clearTimeout(id);
  }, [progress, isFinishing]);

  useEffect(() => {
    if (isFinishing) return;
    const id = setInterval(() => {
      setLogs((l) => {
        const next = LOG_LINES[l.length % LOG_LINES.length];
        const t =
          String(Math.floor((l.length * 2.4) / 60)).padStart(2, "0") +
          ":" +
          String(Math.floor((l.length * 2.4) % 60)).padStart(2, "0");
        return [...l.slice(-7), { t, msg: next }];
      });
    }, 900);
    return () => clearInterval(id);
  }, [isFinishing]);

  const stepIdx = Math.min(STEPS.length - 1, Math.floor(progress / 20));

  return (
    <>
      <AppHeader mode="process" onCancel={onCancel} />

      <section style={{ padding: "64px 0 48px", textAlign: "center", position: "relative" }}>
        <div className="grain" />
        <div className="ss-container" style={{ position: "relative" }}>
          <span className="eyebrow">
            <span className="dot" style={{ animation: "ticker 1.4s ease-in-out infinite" }} />
            analyzing
          </span>

          <h1
            className="h-display"
            style={{ marginTop: 18, fontSize: "clamp(36px, 4.4vw, 52px)" }}
          >
            Reading the site. <span className="brand">Drafting personas.</span>
          </h1>

          <p className="lead" style={{ marginTop: 16 }}>
            We render the page in a real browser, then synthesize segments, JTBDs, and pain points.
            This usually takes 30 to 60 seconds.
          </p>

          <div className="pill" style={{ marginTop: 22 }}>
            <I.Globe size={12} />
            <code>https://{url}</code>
            <span className="dot-sep" style={{ color: "var(--text-tertiary)" }}>
              {audience || "general audience"}
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 80px" }}>
        <div className="ss-container" style={{ maxWidth: 760 }}>
          <div className="process-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Overall progress</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                  }}
                >
                  {fmtElapsed(elapsedTime)}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--brand)",
                    fontWeight: 700,
                  }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            <div className="progress-bar" style={{ marginBottom: 22 }}>
              <div className="fill" style={{ width: progress + "%" }} />
              <div className="shimmer" style={{ width: progress + "%" }} />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              {STEPS.map((s, i) => {
                const finished = progress >= 100;
                const done = i < stepIdx;
                const active = i === stepIdx && !finished;
                return (
                  <div
                    key={s.id}
                    className={
                      "step " + (finished ? "is-done" : active ? "is-active" : done ? "is-done" : "")
                    }
                  >
                    <span className="indicator">
                      {done || finished ? (
                        <I.Check size={13} sw={2} />
                      ) : active ? (
                        <I.Spinner size={13} />
                      ) : (
                        <I.Circle size={13} />
                      )}
                    </span>
                    <span className="label">
                      <span className="glyph">{s.icon}</span>
                      {s.label}
                    </span>
                    <span className="status">
                      {done || finished ? "Done" : active ? "Processing…" : "Queued"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 22,
                background: "#06080b",
                border: "1px solid var(--surface-border)",
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                minHeight: 156,
                maxHeight: 156,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "var(--text-tertiary)",
                  fontSize: 10,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                <span>live log</span>
                <span>{logs.length} events</span>
              </div>
              {logs.slice(-7).map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "var(--text-tertiary)" }}>{l.t}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{l.msg}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, color: "var(--brand)" }}>
                <span style={{ color: "var(--text-tertiary)" }}>
                  {String(Math.floor(elapsedTime / 60)).padStart(2, "0")}:
                  {String(elapsedTime % 60).padStart(2, "0")}
                </span>
                <span style={{ animation: "ticker 1s ease-in-out infinite" }}>▌</span>
              </div>
            </div>

            <div className="tip">
              <b>Tip:</b> Heavier sites (Notion, Linear) take ~30–60 seconds because we render the
              full page in a real browser before reading the copy.
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {PREVIEW_NAMES.map((name, i) => (
              <div
                key={name}
                style={{
                  background: "var(--surface-1)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  opacity: progress > i * 25 + 25 ? 1 : 0.4,
                  transition: "opacity 600ms var(--ease-out)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    className="persona-avatar"
                    style={{ width: 28, height: 28, fontSize: 12 }}
                  >
                    {name.split(" ").slice(-1)[0][0]}
                  </span>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}
                  >
                    {name}
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "grid", gap: 5 }}>
                  <span
                    style={{
                      height: 5,
                      width: "78%",
                      background: "var(--surface-3)",
                      borderRadius: 2,
                    }}
                  />
                  <span
                    style={{
                      height: 5,
                      width: "62%",
                      background: "var(--surface-3)",
                      borderRadius: 2,
                    }}
                  />
                  <span
                    style={{
                      height: 5,
                      width: "70%",
                      background: "var(--surface-3)",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={onCancel}>
              <I.X size={13} /> Cancel generation
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
