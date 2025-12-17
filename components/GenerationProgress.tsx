"use client";

import { Loader2, CheckCircle } from "lucide-react";

interface GenerationProgressProps {
  progress: number;
  currentStep: string;
  elapsedTime: number;
  onCancel: () => void;
}

const steps = [
  { id: "fetching", label: "Fetching website content" },
  { id: "analyzing", label: "Analyzing target audience" },
  { id: "generating", label: "Generating personas" },
  { id: "formatting", label: "Formatting output" },
];

export default function GenerationProgress({
  progress,
  currentStep,
  elapsedTime,
  onCancel,
}: GenerationProgressProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      {/* Main Progress Circle */}
      <div className="relative mx-auto h-40 w-40">
        <svg className="h-40 w-40 -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-surface-light"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="text-accent transition-all duration-500"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {Math.round(progress)}%
          </span>
          <span className="text-sm text-text-secondary">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Current Step Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-accent">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">
            {steps.find((s) => s.id === currentStep)?.label || "Processing..."}
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          This usually takes 30-60 seconds
        </p>
      </div>

      {/* Step Progress */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isComplete = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
                isCurrent
                  ? "bg-surface text-white"
                  : isComplete
                  ? "text-success"
                  : "text-text-secondary"
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-surface-light" />
                )}
              </div>
              <span className="text-sm">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="rounded-lg border border-surface-light px-6 py-2 text-sm text-text-secondary transition-colors hover:border-error hover:text-error"
      >
        Cancel Generation
      </button>
    </div>
  );
}
