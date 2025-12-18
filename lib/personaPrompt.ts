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

  // Truncate website content to avoid huge prompts
  const truncatedWebsite = websiteContent.substring(0, 3000);
  const truncatedCompetitor = competitorContent.substring(0, 1500);
  const truncatedFiles = fileContent.substring(0, 1500);

  return `Generate ${formData.personaCount} user personas for "${formData.productName}".

Target: ${formData.targetAudience}
${formData.jobToBeDone ? `Job: ${formData.jobToBeDone}` : ""}

Context:
${truncatedWebsite || "No website provided"}
${truncatedCompetitor ? `\nCompetitors:\n${truncatedCompetitor}` : ""}
${truncatedFiles ? `\nResearch:\n${truncatedFiles}` : ""}

Return JSON only:
{"personas":[{"id":"persona-1","type":"The [Name]","tagline":"One line","background":{"summary":"2 sentences","workContext":"Environment","domainFamiliarity":"Low/Med/High"}${formData.includeDemographics.age || formData.includeDemographics.location ? `,"demographics":{"ageRange":"25-34","location":"Urban"}` : ""},"goals":{"primary":["Goal 1","Goal 2"],"successDefinition":"Success metric"},"painPoints":{"challenges":["Challenge 1","Challenge 2"],"triggers":["Trigger"]},"behaviors":{"routines":["Behavior 1"],"frequency":"Daily/Weekly"},"needs":{"core":["Need 1"],"mustHaves":["Must have"]},"technology":{"devices":["Device"],"techComfort":"Medium"},"quotes":["Quote"],"insights":{"keyTakeaways":["Insight 1"],"opportunities":["Opportunity"]}}]${formData.includeSections.interviewGuide ? `,"interviewGuide":{"introduction":"Intro","warmupQuestions":["Q1"],"coreQuestions":[{"category":"Goals","questions":["Q1","Q2"]}],"closingQuestions":["Final"]}` : ""}}

Rules: Be specific, not generic. Each persona must be different. Valid JSON only.`;
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
