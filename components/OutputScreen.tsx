"use client";

import { useState } from "react";
import { Download, RefreshCw, Users, FileText, ClipboardList } from "lucide-react";
import type { GenerationResult, Persona } from "@/types";

interface OutputScreenProps {
  result: GenerationResult;
  onGenerateNew: () => void;
  onDownloadPDF: () => void;
}

export default function OutputScreen({
  result,
  onGenerateNew,
  onDownloadPDF,
}: OutputScreenProps) {
  const [selectedPersonaIndex, setSelectedPersonaIndex] = useState(0);
  const selectedPersona = result.personas[selectedPersonaIndex];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Personas"
          value={result.personas.length}
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Sections"
          value={Object.keys(selectedPersona).length}
        />
        <StatCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="Insights"
          value={selectedPersona.insights.keyTakeaways.length}
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Pain Points"
          value={selectedPersona.painPoints.challenges.length}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onDownloadPDF}
          className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Download className="h-5 w-5" />
          Download PDF
        </button>
        <button
          onClick={onGenerateNew}
          className="flex items-center gap-2 rounded-lg border border-surface-light px-6 py-3 font-medium text-white transition-colors hover:bg-surface"
        >
          <RefreshCw className="h-5 w-5" />
          Generate New
        </button>
      </div>

      {/* Persona Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {result.personas.map((persona, index) => (
          <button
            key={persona.id}
            onClick={() => setSelectedPersonaIndex(index)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedPersonaIndex === index
                ? "bg-accent text-white"
                : "bg-surface text-text-secondary hover:text-white"
            }`}
          >
            {persona.type}
          </button>
        ))}
      </div>

      {/* Persona Detail Card */}
      <div className="rounded-xl border border-surface-light bg-surface p-6">
        {/* Persona Header */}
        <div className="mb-6 border-b border-surface-light pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
              {selectedPersona.type.charAt(0)}
            </div>
            <div>
              <h2 className="text-h1 font-bold text-white">
                {selectedPersona.type}
              </h2>
              <p className="text-text-secondary">{selectedPersona.tagline}</p>
            </div>
          </div>
        </div>

        {/* Persona Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Background */}
          <Section title="Background">
            <p className="text-sm text-text-secondary">
              {selectedPersona.background.summary}
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              <strong className="text-white">Work Context:</strong>{" "}
              {selectedPersona.background.workContext}
            </p>
          </Section>

          {/* Demographics */}
          {selectedPersona.demographics && (
            <Section title="Demographics">
              <div className="space-y-1 text-sm">
                {selectedPersona.demographics.ageRange && (
                  <p>
                    <strong className="text-white">Age:</strong>{" "}
                    <span className="text-text-secondary">
                      {selectedPersona.demographics.ageRange}
                    </span>
                  </p>
                )}
                {selectedPersona.demographics.location && (
                  <p>
                    <strong className="text-white">Location:</strong>{" "}
                    <span className="text-text-secondary">
                      {selectedPersona.demographics.location}
                    </span>
                  </p>
                )}
                {selectedPersona.demographics.education && (
                  <p>
                    <strong className="text-white">Education:</strong>{" "}
                    <span className="text-text-secondary">
                      {selectedPersona.demographics.education}
                    </span>
                  </p>
                )}
              </div>
            </Section>
          )}

          {/* Goals */}
          <Section title="Goals & Desired Outcomes">
            <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
              {selectedPersona.goals.primary.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              <strong className="text-white">Success looks like:</strong>{" "}
              <span className="text-text-secondary">
                {selectedPersona.goals.successDefinition}
              </span>
            </p>
          </Section>

          {/* Pain Points */}
          <Section title="Pain Points & Frustrations">
            <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
              {selectedPersona.painPoints.challenges.map((pain, i) => (
                <li key={i}>{pain}</li>
              ))}
            </ul>
          </Section>

          {/* Motivations */}
          <Section title="Motivations & Drivers">
            <div className="space-y-2 text-sm">
              <div>
                <strong className="text-white">Intrinsic:</strong>
                <p className="text-text-secondary">
                  {selectedPersona.motivations.intrinsic.join(", ")}
                </p>
              </div>
              <div>
                <strong className="text-white">Values:</strong>
                <p className="text-text-secondary">
                  {selectedPersona.motivations.values.join(", ")}
                </p>
              </div>
            </div>
          </Section>

          {/* Behaviors */}
          <Section title="Behaviors & Habits">
            <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
              {selectedPersona.behaviors.routines.map((behavior, i) => (
                <li key={i}>{behavior}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm">
              <strong className="text-white">Preferred channels:</strong>{" "}
              <span className="text-text-secondary">
                {selectedPersona.behaviors.preferredChannels.join(", ")}
              </span>
            </p>
          </Section>

          {/* Quotes */}
          <Section title="Representative Quotes" className="md:col-span-2">
            <div className="space-y-3">
              {selectedPersona.quotes.map((quote, i) => (
                <blockquote
                  key={i}
                  className="border-l-2 border-accent pl-4 text-sm italic text-text-secondary"
                >
                  &ldquo;{quote}&rdquo;
                </blockquote>
              ))}
            </div>
          </Section>

          {/* Key Insights */}
          <Section title="Key Insights & Design Implications" className="md:col-span-2">
            <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
              {selectedPersona.insights.keyTakeaways.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
            <div className="mt-4">
              <strong className="text-white">Opportunities:</strong>
              <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-text-secondary">
                {selectedPersona.insights.opportunities.map((opp, i) => (
                  <li key={i}>{opp}</li>
                ))}
              </ul>
            </div>
          </Section>
        </div>
      </div>

      {/* Interview Guide Preview (if included) */}
      {result.interviewGuide && (
        <div className="rounded-xl border border-surface-light bg-surface p-6">
          <h3 className="mb-4 text-h2 font-semibold text-white">
            Interview Guide Preview
          </h3>
          <p className="text-sm text-text-secondary">
            {result.interviewGuide.introduction}
          </p>
          <p className="mt-2 text-sm text-accent">
            {result.interviewGuide.coreQuestions.length} question categories
            included in PDF
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-surface-light bg-surface p-4">
      <div className="flex items-center gap-2 text-accent">{icon}</div>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="mb-2 text-h3 font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}
