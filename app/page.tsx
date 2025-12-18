"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import GenerationProgress from "@/components/GenerationProgress";
import OutputScreen from "@/components/OutputScreen";
import LandingPage from "@/components/LandingPage";
import type { AppState, PersonaFormData, GenerationResult } from "@/types";

// Expected character count for progress estimation
const EXPECTED_CHARACTERS = 25000;

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

      const response = await fetch("/api/generate", {
        method: "POST",
        body: apiFormData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `Generation failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Use default error message
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let contentBuffer = "";
      let receivedComplete = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "progress") {
                setCurrentStep(data.step);
                setProgress(data.progress);
              } else if (data.type === "content") {
                contentBuffer += data.data;
                // Update progress based on content length
                const estimatedProgress = Math.min(
                  95,
                  (contentBuffer.length / EXPECTED_CHARACTERS) * 100
                );
                setProgress(Math.max(progress, estimatedProgress));
              } else if (data.type === "complete") {
                setProgress(100);
                setGenerationResult(data.result);
                setAppState("complete");
                receivedComplete = true;
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (e) {
              // Only throw if it's an actual Error we created
              if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
                throw e;
              }
              // Otherwise skip invalid JSON lines
            }
          }
        }
      }

      // If stream ended without complete event, something went wrong
      if (!receivedComplete && appState === "generating") {
        throw new Error("Generation incomplete - the request may have timed out. Please try again.");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled - reset to form
        setAppState("form");
      } else {
        const errorMessage = err instanceof Error ? err.message : "Generation failed";
        // Provide more helpful error for network issues
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
