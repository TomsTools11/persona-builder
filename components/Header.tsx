"use client";

import { Users } from "lucide-react";

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Header({ showBackButton, onBack }: HeaderProps) {
  return (
    <header className="w-full border-b border-surface-light bg-primary/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="mr-2 rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface hover:text-white"
              aria-label="Go back"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Persona Builder</h1>
            <p className="text-xs text-text-secondary">
              AI-powered user research
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
