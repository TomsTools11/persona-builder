"use client";

import { Loader2 } from "lucide-react";

interface GenerationProgressProps {
  elapsedTime: number;
  onCancel: () => void;
}

export default function GenerationProgress({
  elapsedTime,
  onCancel,
}: GenerationProgressProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center">
      <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
        <Loader2 className="h-20 w-20 animate-spin text-accent" />
        <div className="absolute -bottom-2 left-0 right-0 text-sm text-text-secondary">
          {formatTime(elapsedTime)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-lg font-medium text-white">
          Generating your personas
        </div>
        <p className="text-sm text-text-secondary">
          This usually takes 30-60 seconds. Hang tight.
        </p>
      </div>

      <button
        onClick={onCancel}
        className="rounded-lg border border-surface-light px-6 py-2 text-sm text-text-secondary transition-colors hover:border-error hover:text-error"
      >
        Cancel Generation
      </button>
    </div>
  );
}
