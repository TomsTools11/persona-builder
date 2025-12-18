"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import GenerationProgress from "@/components/GenerationProgress";
import OutputScreen from "@/components/OutputScreen";
import LandingPage from "@/components/LandingPage";
import type { AppState, PersonaFormData, GenerationResult } from "@/types";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("fetching");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleGetStarted = () => {
    setAppState("form");
  };

  const handleBackToLanding = () => {
    setAppState("landing");
  };

  // Timer for elapsed time
  useEffect(() => {
    if (appState === "generating") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [appState]);

  const handleSubmit = async (formData: PersonaFormData, files: File[]) => {
    setAppState("generating");
    setProgress(0);
    setCurrentStep("fetching");
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      // Create FormData for the API request
      const apiFormData = new FormData();
      apiFormData.append("formData", JSON.stringify(formData));

      // Append files
      files.forEach((file) => {
        apiFormData.append("files", file);
      });

      // Start generation - returns immediately with job ID
      const response = await fetch("/api/generate", {
        method: "POST",
        body: apiFormData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Generation failed: ${response.statusText}`);
      }

      const { jobId } = await response.json();

      if (!jobId) {
        throw new Error("No job ID returned");
      }

      // Poll for status
      const pollInterval = 1000; // 1 second
      const maxPolls = 120; // 2 minutes max
      let polls = 0;

      const poll = async (): Promise<void> => {
        if (abortControllerRef.current?.signal.aborted) {
          setAppState("form");
          return;
        }

        polls++;
        if (polls > maxPolls) {
          throw new Error("Generation timed out. Please try again.");
        }

        const statusResponse = await fetch(`/api/status/${jobId}`);

        if (!statusResponse.ok) {
          throw new Error("Failed to check generation status");
        }

        const status = await statusResponse.json();

        // Update progress UI
        setProgress(status.progress || 0);
        if (status.status) {
          setCurrentStep(status.status);
        }

        if (status.status === "completed" && status.result) {
          setProgress(100);
          setGenerationResult(status.result);
          setAppState("complete");
          return;
        }

        if (status.status === "error") {
          throw new Error(status.error || "Generation failed");
        }

        // Continue polling
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        return poll();
      };

      await poll();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setAppState("form");
      } else {
        const errorMessage = err instanceof Error ? err.message : "Generation failed";
        const finalMessage = errorMessage.includes("fetch") || errorMessage.includes("network")
          ? "Network error - please check your connection and try again."
          : errorMessage;
        setError(finalMessage);
        setAppState("form");
      }
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setAppState("landing");
  };

  const handleGenerateNew = () => {
    setGenerationResult(null);
    setAppState("landing");
  };

  const handleDownloadPDF = async () => {
    if (!generationResult) return;

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generationResult),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create download link
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
    }
  };

  // Determine back button behavior based on state
  const getBackHandler = () => {
    switch (appState) {
      case "form":
        return handleBackToLanding;
      case "generating":
        return handleCancel;
      case "complete":
        return handleGenerateNew;
      default:
        return undefined;
    }
  };

  // Landing page has its own layout
  if (appState === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="min-h-screen bg-primary-dark">
      <Header
        showBackButton={true}
        onBack={getBackHandler()}
      />

      <main className="mx-auto max-w-container px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-lg border border-error bg-error/10 px-4 py-3 text-error">
            {error}
          </div>
        )}

        {/* Form State */}
        {appState === "form" && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-display text-white">
                Build User Personas in Minutes
              </h1>
              <p className="mt-4 text-lg text-text-secondary">
                Transform website URLs and research materials into actionable user
                personas with AI-powered analysis.
              </p>
            </div>
            <div className="rounded-xl border border-surface-light bg-primary p-6 md:p-8">
              <InputForm onSubmit={handleSubmit} isGenerating={false} />
            </div>
          </div>
        )}

        {/* Generating State */}
        {appState === "generating" && (
          <div className="py-12">
            <GenerationProgress
              progress={progress}
              currentStep={currentStep}
              elapsedTime={elapsedTime}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Complete State */}
        {appState === "complete" && generationResult && (
          <OutputScreen
            result={generationResult}
            onGenerateNew={handleGenerateNew}
            onDownloadPDF={handleDownloadPDF}
          />
        )}
      </main>
    </div>
  );
}
