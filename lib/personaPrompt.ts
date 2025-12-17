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

Structure your response as valid JSON with the following format:

\`\`\`json
{
  "personas": [
    {
      "id": "persona-1",
      "type": "The [Descriptive Name]",
      "tagline": "Short archetype description",
      "background": {
        "summary": "2-3 sentence overview",
        "workContext": "Their professional environment",
        "domainFamiliarity": "Their familiarity with the product domain"
      },
      ${formData.includeDemographics.age || formData.includeDemographics.location || formData.includeDemographics.gender || formData.includeDemographics.incomeRange ? `"demographics": {
        ${formData.includeDemographics.age ? '"ageRange": "e.g., 28-35",' : ""}
        ${formData.includeDemographics.location ? '"location": "e.g., Urban areas, US/Europe",' : ""}
        ${formData.includeDemographics.gender ? '"gender": "e.g., Any",' : ""}
        ${formData.includeDemographics.incomeRange ? '"incomeRange": "e.g., $60k-$90k",' : ""}
        "education": "Highest education level"
      },` : ""}
      "role": {
        "title": "Job title or role",
        "responsibilities": ["Key responsibility 1", "Key responsibility 2"],
        "teamStructure": "How they fit in their team/organization",
        "decisionAuthority": "Their decision-making power"
      },
      "goals": {
        "primary": ["Primary goal 1", "Primary goal 2"],
        "successDefinition": "What success looks like for them"
      },
      "motivations": {
        "intrinsic": ["Internal motivator 1", "Internal motivator 2"],
        "extrinsic": ["External motivator 1"],
        "values": ["Core value 1", "Core value 2"]
      },
      "needs": {
        "core": ["Must-have need 1", "Must-have need 2"],
        "mustHaves": ["Critical requirement 1"],
        "niceToHaves": ["Optional preference 1"]
      },
      "behaviors": {
        "routines": ["Typical behavior 1", "Typical behavior 2"],
        "frequency": "How often they would use the product",
        "preferredChannels": ["Desktop", "Mobile", etc.]
      },
      "painPoints": {
        "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"],
        "triggers": ["What triggers frustration"],
        "concerns": ["Risk or concern they have"]
      },
      "tasks": {
        "primary": ["Main task 1", "Main task 2"],
        "secondary": ["Secondary task 1"],
        "highValueScenarios": ["Critical scenario 1"]
      },
      ${formData.includeSections.journeyMap ? `"journeySnapshot": {
        "discover": "How they find solutions",
        "evaluate": "How they evaluate options",
        "adopt": "What drives adoption",
        "use": "How they use the product",
        "advocate": "What makes them recommend"
      },` : ""}
      "context": {
        "environment": "Where they use the product",
        "timing": "When they use it",
        "constraints": ["Time pressure", "Budget limits", etc.]
      },
      "technology": {
        "devices": ["Device 1", "Device 2"],
        "tools": ["Tool they currently use"],
        "techComfort": "Their comfort level with technology"
      },
      "communication": {
        "preferredTone": "Formal/Casual/Direct",
        "terminologyLevel": "Novice/Intermediate/Expert"
      },
      "objections": {
        "barriers": ["Why they might not adopt"],
        "switchingCosts": ["What they'd give up"],
        "requirements": ["What they need to proceed"]
      },
      "quotes": [
        "Representative quote expressing their goals",
        "Representative quote expressing their frustration"
      ],
      "scenarios": [
        "Brief narrative scenario showing them using the product"
      ],
      "insights": {
        "keyTakeaways": ["Key insight for the team 1", "Key insight 2"],
        "designImplications": ["How this affects design decisions"],
        "opportunities": ["Opportunity to serve them better"]
      },
      "assumptions": {
        "validated": ["What we're confident about"],
        "toResearch": ["What needs further validation"]
      }
    }
  ]${formData.includeSections.interviewGuide ? `,
  "interviewGuide": {
    "introduction": "Script for introducing the interview",
    "warmupQuestions": ["Easy opening question 1", "Opening question 2"],
    "coreQuestions": [
      {
        "category": "Goals & Motivations",
        "questions": ["Question 1", "Question 2"]
      },
      {
        "category": "Current Behaviors",
        "questions": ["Question 1", "Question 2"]
      },
      {
        "category": "Pain Points",
        "questions": ["Question 1", "Question 2"]
      }
    ],
    "closingQuestions": ["Closing question 1", "Any final thoughts?"]
  }` : ""}${formData.includeSections.survey ? `,
  "surveyGuide": {
    "title": "User Research Survey",
    "sections": [
      {
        "name": "Demographics",
        "questions": [
          {
            "question": "What is your role?",
            "type": "multiple_choice",
            "options": ["Option 1", "Option 2", "Other"]
          }
        ]
      },
      {
        "name": "Current Behaviors",
        "questions": [
          {
            "question": "How often do you...?",
            "type": "scale"
          }
        ]
      }
    ]
  }` : ""}
}
\`\`\`

Important guidelines:
1. Make each persona distinctly different - vary their goals, pain points, and behaviors
2. Ground all details in the provided source material when possible
3. Use realistic, specific details rather than generic descriptions
4. Include actionable insights that product teams can use
5. Write quotes that sound natural and authentic
6. Ensure the JSON is valid and properly formatted

Begin generating the personas now.`;
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
