"use client";

import { useState } from "react";
import { Plus, X, Upload, Globe, Users, Briefcase } from "lucide-react";
import type { PersonaFormData, UploadedFile } from "@/types";

interface InputFormProps {
  onSubmit: (data: PersonaFormData, files: File[]) => void;
  isGenerating: boolean;
}

export default function InputForm({ onSubmit, isGenerating }: InputFormProps) {
  const [formData, setFormData] = useState<PersonaFormData>({
    productName: "",
    websiteUrl: "",
    targetAudience: "",
    competitorUrls: [],
    jobToBeDone: "",
    personaCount: 3,
    includeSections: {
      interviewGuide: true,
      survey: false,
      journeyMap: true,
    },
    includeDemographics: {
      age: true,
      location: true,
      gender: false,
      incomeRange: false,
    },
  });

  const [newCompetitorUrl, setNewCompetitorUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.targetAudience) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData, uploadedFiles);
  };

  const addCompetitorUrl = () => {
    if (newCompetitorUrl && formData.competitorUrls.length < 5) {
      setFormData({
        ...formData,
        competitorUrls: [...formData.competitorUrls, newCompetitorUrl],
      });
      setNewCompetitorUrl("");
    }
  };

  const removeCompetitorUrl = (index: number) => {
    setFormData({
      ...formData,
      competitorUrls: formData.competitorUrls.filter((_, i) => i !== index),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Required Inputs Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-accent">
          <Briefcase className="h-5 w-5" />
          <h2 className="text-h2 font-semibold">Required Information</h2>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label htmlFor="productName" className="block text-sm font-medium text-white">
            Product/Feature Name <span className="text-error">*</span>
          </label>
          <input
            id="productName"
            type="text"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
            placeholder="e.g., Persona Builder, Slack, Notion"
            className="w-full rounded-lg border border-surface-light bg-surface px-4 py-3 text-white placeholder-text-secondary transition-colors focus:border-accent focus:outline-none"
            disabled={isGenerating}
            required
          />
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-white">
            Website URL <span className="text-text-secondary text-xs">(optional)</span>
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
            />
          </div>
        </div>

        {/* Target Audience */}
        <div className="space-y-2">
          <label htmlFor="targetAudience" className="block text-sm font-medium text-white">
            Who is it for? <span className="text-error">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-text-secondary" />
            <textarea
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) =>
                setFormData({ ...formData, targetAudience: e.target.value })
              }
              placeholder="e.g., freelance designers, ops managers, small business owners"
              className="w-full rounded-lg border border-surface-light bg-surface py-3 pl-10 pr-4 text-white placeholder-text-secondary transition-colors focus:border-accent focus:outline-none"
              rows={2}
              disabled={isGenerating}
              required
            />
          </div>
        </div>
      </div>

      {/* Optional Inputs Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-text-secondary">
          <h2 className="text-h2 font-semibold">Optional (Recommended)</h2>
        </div>

        {/* Competitor URLs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            Competitor URLs (up to 5)
          </label>
          <div className="space-y-2">
            {formData.competitorUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-surface-light bg-surface px-3 py-2"
              >
                <Globe className="h-4 w-4 text-text-secondary" />
                <span className="flex-1 truncate text-sm text-white">{url}</span>
                <button
                  type="button"
                  onClick={() => removeCompetitorUrl(index)}
                  className="rounded p-1 text-text-secondary hover:bg-surface-light hover:text-error"
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {formData.competitorUrls.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newCompetitorUrl}
                  onChange={(e) => setNewCompetitorUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCompetitorUrl();
                    }
                  }}
                  placeholder="https://competitor.com"
                  className="flex-1 rounded-lg border border-surface-light bg-surface px-4 py-2 text-sm text-white placeholder-text-secondary transition-colors focus:border-accent focus:outline-none"
                  disabled={isGenerating}
                />
                <button
                  type="button"
                  onClick={addCompetitorUrl}
                  className="rounded-lg bg-surface-light px-3 py-2 text-text-secondary transition-colors hover:bg-accent hover:text-white"
                  disabled={isGenerating || !newCompetitorUrl}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Job to be Done */}
        <div className="space-y-2">
          <label htmlFor="jobToBeDone" className="block text-sm font-medium text-white">
            What job are they trying to do?
          </label>
          <textarea
            id="jobToBeDone"
            value={formData.jobToBeDone}
            onChange={(e) =>
              setFormData({ ...formData, jobToBeDone: e.target.value })
            }
            placeholder="e.g., Quickly create professional user personas without hiring a research agency"
            className="w-full rounded-lg border border-surface-light bg-surface px-4 py-3 text-white placeholder-text-secondary transition-colors focus:border-accent focus:outline-none"
            rows={2}
            disabled={isGenerating}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">
            Additional Research Materials (PDF, DOCX)
          </label>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border border-surface-light bg-surface px-3 py-2"
              >
                <Upload className="h-4 w-4 text-accent" />
                <span className="flex-1 truncate text-sm text-white">
                  {file.name}
                </span>
                <span className="text-xs text-text-secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded p-1 text-text-secondary hover:bg-surface-light hover:text-error"
                  disabled={isGenerating}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-surface-light bg-surface/50 px-4 py-6 text-text-secondary transition-colors hover:border-accent hover:text-accent">
              <Upload className="h-5 w-5" />
              <span className="text-sm">Click to upload files</span>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={isGenerating}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-6">
        <h2 className="text-h2 font-semibold text-text-secondary">
          Configuration
        </h2>

        {/* Persona Count */}
        <div className="space-y-2">
          <label htmlFor="personaCount" className="block text-sm font-medium text-white">
            Number of Personas
          </label>
          <select
            id="personaCount"
            value={formData.personaCount}
            onChange={(e) =>
              setFormData({ ...formData, personaCount: parseInt(e.target.value) })
            }
            className="w-full rounded-lg border border-surface-light bg-surface px-4 py-3 text-white transition-colors focus:border-accent focus:outline-none"
            disabled={isGenerating}
          >
            {[2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count} personas
              </option>
            ))}
          </select>
        </div>

        {/* Section Toggles */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-white">Include Sections</p>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "interviewGuide", label: "Interview Guide" },
              { key: "survey", label: "Survey" },
              { key: "journeyMap", label: "Journey Map" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={
                    formData.includeSections[
                      key as keyof typeof formData.includeSections
                    ]
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      includeSections: {
                        ...formData.includeSections,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-surface-light bg-surface text-accent focus:ring-accent"
                  disabled={isGenerating}
                />
                <span className="text-sm text-white">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Demographics Toggles */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-white">Include Demographics</p>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "age", label: "Age" },
              { key: "location", label: "Location" },
              { key: "gender", label: "Gender" },
              { key: "incomeRange", label: "Income Range" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={
                    formData.includeDemographics[
                      key as keyof typeof formData.includeDemographics
                    ]
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      includeDemographics: {
                        ...formData.includeDemographics,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-surface-light bg-surface text-accent focus:ring-accent"
                  disabled={isGenerating}
                />
                <span className="text-sm text-white">{label}</span>
              </label>
            ))}
          </div>
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
