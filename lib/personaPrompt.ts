/**
 * Claude prompt template for generating user personas
 */

import type { PersonaFormData } from "@/types";

interface PromptContext {
  formData: PersonaFormData;
  websiteContent: string;
  competitorContent: string;
  fileContent: string;
}

export function buildPersonaPrompt(context: PromptContext): string {
  const { formData, websiteContent, competitorContent, fileContent } = context;

  // Build the list of sections to include
  const sectionsToInclude = buildSectionsList(formData);

  // Build demographics instruction
  const demographicsInstruction = buildDemographicsInstruction(formData);

  return `You are an expert user researcher with deep experience in creating actionable user personas for product teams. Your task is to analyze the provided information and generate ${formData.personaCount} distinct, realistic user personas.

## Context

**Product/Feature:** ${formData.productName}

**Target Audience Description:** ${formData.targetAudience}

${formData.jobToBeDone ? `**Job to be Done:** ${formData.jobToBeDone}` : ""}

## Source Information

### Primary Website
${websiteContent}

${competitorContent ? `### Competitor Analysis\n${competitorContent}` : ""}

${fileContent ? `### Additional Research Materials\n${fileContent}` : ""}

## Instructions

Generate ${formData.personaCount} distinct user personas that represent different segments of the target audience. Each persona should be realistic, actionable, and grounded in the provided information.

For each persona, provide the following sections:

${sectionsToInclude}

${demographicsInstruction}

## Output Format

Return ONLY valid JSON (no markdown code blocks). Use this exact structure:

{
  "personas": [
    {
      "id": "persona-1",
      "type": "The [Descriptive Name]",
      "tagline": "One sentence archetype",
      "background": {
        "summary": "2 sentence overview",
        "workContext": "Their work environment",
        "domainFamiliarity": "Low/Medium/High"
      },
      ${formData.includeDemographics.age || formData.includeDemographics.location || formData.includeDemographics.gender || formData.includeDemographics.incomeRange ? `"demographics": {
        ${formData.includeDemographics.age ? '"ageRange": "e.g., 28-35",' : ""}
        ${formData.includeDemographics.location ? '"location": "e.g., Urban, US",' : ""}
        ${formData.includeDemographics.gender ? '"gender": "e.g., Any",' : ""}
        ${formData.includeDemographics.incomeRange ? '"incomeRange": "e.g., $60k-$90k",' : ""}
        "education": "Education level"
      },` : ""}
      "goals": {
        "primary": ["Goal 1", "Goal 2"],
        "successDefinition": "What success looks like"
      },
      "motivations": {
        "intrinsic": ["Motivator 1"],
        "extrinsic": ["Motivator 1"],
        "values": ["Value 1", "Value 2"]
      },
      "behaviors": {
        "routines": ["Behavior 1", "Behavior 2"],
        "frequency": "Daily/Weekly/Monthly",
        "preferredChannels": ["Desktop", "Mobile"]
      },
      "painPoints": {
        "challenges": ["Challenge 1", "Challenge 2"],
        "triggers": ["Trigger 1"],
        "concerns": ["Concern 1"]
      },
      "needs": {
        "core": ["Need 1", "Need 2"],
        "mustHaves": ["Must-have 1"],
        "niceToHaves": ["Nice-to-have 1"]
      },
      "tasks": {
        "primary": ["Task 1", "Task 2"],
        "secondary": ["Task 1"],
        "highValueScenarios": ["Scenario 1"]
      },
      "technology": {
        "devices": ["Device 1"],
        "tools": ["Tool 1"],
        "techComfort": "Low/Medium/High"
      },
      "quotes": ["Quote expressing their main goal or frustration"],
      "insights": {
        "keyTakeaways": ["Insight 1", "Insight 2"],
        "designImplications": ["Implication 1"],
        "opportunities": ["Opportunity 1"]
      }
    }
  ]${formData.includeSections.interviewGuide ? `,
  "interviewGuide": {
    "introduction": "Brief intro script",
    "warmupQuestions": ["Question 1", "Question 2"],
    "coreQuestions": [
      {"category": "Goals", "questions": ["Q1", "Q2"]},
      {"category": "Pain Points", "questions": ["Q1", "Q2"]}
    ],
    "closingQuestions": ["Final question"]
  }` : ""}
}

Guidelines:
1. Make each persona distinctly different
2. Be specific and actionable, not generic
3. Return ONLY the JSON, no explanations
4. Ensure valid JSON format`;
}

function buildSectionsList(formData: PersonaFormData): string {
  const sections = [
    "1. **Persona Header** - Type, tagline/archetype label",
    "2. **Background & Context** - Summary, work context, domain familiarity",
  ];

  if (
    formData.includeDemographics.age ||
    formData.includeDemographics.location ||
    formData.includeDemographics.gender ||
    formData.includeDemographics.incomeRange
  ) {
    sections.push("3. **Demographics** - As specified in configuration");
  }

  sections.push(
    "4. **Role & Responsibilities** - Job title, key responsibilities, team structure",
    "5. **Goals & Desired Outcomes** - Primary goals, success definition",
    "6. **Motivations & Drivers** - Intrinsic/extrinsic motivators, values",
    "7. **Needs & Expectations** - Core needs, must-haves, nice-to-haves",
    "8. **Behaviors & Habits** - Routines, frequency, preferred channels",
    "9. **Pain Points & Frustrations** - Challenges, triggers, concerns",
    "10. **Tasks & Key Use Cases** - Primary/secondary tasks, high-value scenarios"
  );

  if (formData.includeSections.journeyMap) {
    sections.push(
      "11. **User Journey Snapshot** - Discover, evaluate, adopt, use, advocate stages"
    );
  }

  sections.push(
    "12. **Context of Use** - Environment, timing, constraints",
    "13. **Technology Profile** - Devices, tools, tech comfort level",
    "14. **Communication Style** - Preferred tone, terminology level",
    "15. **Objections & Barriers** - Adoption barriers, switching costs",
    "16. **Representative Quotes** - Voice of user quotes",
    "17. **Scenarios** - Mini-story narratives",
    "18. **Key Insights** - Takeaways, design implications, opportunities",
    "19. **Assumptions** - Validated vs. needs research"
  );

  if (formData.includeSections.interviewGuide) {
    sections.push(
      "20. **Interview Guide** - Introduction, warmup, core, and closing questions"
    );
  }

  if (formData.includeSections.survey) {
    sections.push("21. **Survey Template** - Questions organized by section");
  }

  return sections.join("\n");
}

function buildDemographicsInstruction(formData: PersonaFormData): string {
  const includedDemographics = [];

  if (formData.includeDemographics.age) includedDemographics.push("age range");
  if (formData.includeDemographics.location)
    includedDemographics.push("location/region");
  if (formData.includeDemographics.gender) includedDemographics.push("gender");
  if (formData.includeDemographics.incomeRange)
    includedDemographics.push("income range");

  if (includedDemographics.length === 0) {
    return "**Demographics:** Not required for this output.";
  }

  return `**Demographics to include:** ${includedDemographics.join(", ")}`;
}
