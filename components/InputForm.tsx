"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import type { PersonaFormData } from "@/types";

interface InputFormProps {
  onSubmit: (data: PersonaFormData) => void;
  isGenerating: boolean;
}

export default function InputForm({ onSubmit, isGenerating }: InputFormProps) {
  const [formData, setFormData] = useState<PersonaFormData>({
    description: "",
    websiteUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.websiteUrl.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Description <span className="text-error">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe your product or app — what it does, who it's for, what problem it solves."
          className="w-full rounded-lg border border-surface-light bg-surface px-4 py-3 text-white placeholder-text-secondary transition-colors focus:border-accent focus:outline-none"
          rows={5}
          disabled={isGenerating}
          required
        />
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <label htmlFor="websiteUrl" className="block text-sm font-medium text-white">
          Website URL <span className="text-error">*</span>
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
          <input
            id="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={(e) =>
              setFormData({ ...formData, websiteUrl: e.target.value })
            }
            placeholder="https://example.com"
            className="w-full rounded-lg border border-surface-light bg-surface py-3 pl-10 pr-4 text-white placeholder-text-secondary transition-colors focus:border-accent focus:outline-none"
            disabled={isGenerating}
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full rounded-lg bg-accent py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? "Generating..." : "Generate Personas"}
      </button>
    </form>
  );
}
