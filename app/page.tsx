"use client";

import { useEffect, useRef, useState } from "react";
import GenerationProgress from "@/components/GenerationProgress";
import OutputScreen from "@/components/OutputScreen";
import LandingPage from "@/components/LandingPage";
import type { AppState, GenerationResult } from "@/types";

interface FormParams {
  url: string;
  audience: string;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [params, setParams] = useState<FormParams>({ url: "", audience: "" });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (appState === "generating") {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appState]);

  const submit = async ({ url, audience }: FormParams) => {
    setParams({ url, audience });
    setIsFinishing(false);
    setError(null);
    setAppState("generating");

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: audience, websiteUrl: url }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Generation failed: ${response.statusText}`);
      }

      const result: GenerationResult = await response.json();
      setIsFinishing(true);
      // Brief pause so the progress bar visibly hits 100% before the page swap.
      setTimeout(() => {
        setGenerationResult(result);
        setAppState("complete");
      }, 600);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setAppState("landing");
      } else {
        const errorMessage = err instanceof Error ? err.message : "Generation failed";
        const finalMessage =
          errorMessage.includes("fetch") || errorMessage.includes("network")
            ? "Network error — please check your connection and try again."
            : errorMessage;
        setError(finalMessage);
        setAppState("landing");
      }
    }
  };

  const handleCancel = () => {
    abortControllerRef.current?.abort();
    setAppState("landing");
  };

  const handleGenerateNew = () => {
    setGenerationResult(null);
    setError(null);
    setAppState("landing");
  };

  const handleDownloadPDF = async () => {
    if (!generationResult || isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generationResult),
      });
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${generationResult.productName.replace(/[^a-zA-Z0-9]/g, "-")}-personas.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  if (appState === "generating") {
    return (
      <GenerationProgress
        url={params.url}
        audience={params.audience}
        elapsedTime={elapsedTime}
        isFinishing={isFinishing}
        onCancel={handleCancel}
      />
    );
  }

  if (appState === "complete" && generationResult) {
    return (
      <OutputScreen
        result={generationResult}
        sourceUrl={params.url}
        audience={params.audience}
        isDownloading={isDownloading}
        onGenerateNew={handleGenerateNew}
        onDownloadPDF={handleDownloadPDF}
      />
    );
  }

  return (
    <>
      {error && (
        <div style={{ padding: "16px 24px 0" }}>
          <div className="error-toast">{error}</div>
        </div>
      )}
      <LandingPage onSubmit={submit} />
    </>
  );
}
