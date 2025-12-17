// Form Data Types
export interface PersonaFormData {
  // Required inputs
  productName: string;
  websiteUrl: string;
  targetAudience: string;

  // Optional inputs
  competitorUrls: string[];
  jobToBeDone: string;

  // Toggle options
  personaCount: number;
  includeSections: {
    interviewGuide: boolean;
    survey: boolean;
    journeyMap: boolean;
  };
  includeDemographics: {
    age: boolean;
    location: boolean;
    gender: boolean;
    incomeRange: boolean;
  };
}

// Application State
export type AppState = "landing" | "generating" | "complete";

// Persona Output Types
export interface Persona {
  id: string;
  type: string;
  tagline: string;
  background: {
    summary: string;
    workContext: string;
    domainFamiliarity: string;
  };
  demographics?: {
    ageRange?: string;
    location?: string;
    gender?: string;
    education?: string;
    incomeRange?: string;
  };
  role?: {
    title: string;
    responsibilities: string[];
    teamStructure: string;
    decisionAuthority: string;
  };
  goals: {
    primary: string[];
    successDefinition: string;
  };
  motivations: {
    intrinsic: string[];
    extrinsic: string[];
    values: string[];
  };
  needs: {
    core: string[];
    mustHaves: string[];
    niceToHaves: string[];
  };
  behaviors: {
    routines: string[];
    frequency: string;
    preferredChannels: string[];
  };
  painPoints: {
    challenges: string[];
    triggers: string[];
    concerns: string[];
  };
  tasks: {
    primary: string[];
    secondary: string[];
    highValueScenarios: string[];
  };
  journeySnapshot?: {
    discover: string;
    evaluate: string;
    adopt: string;
    use: string;
    advocate: string;
  };
  context: {
    environment: string;
    timing: string;
    constraints: string[];
  };
  technology: {
    devices: string[];
    tools: string[];
    techComfort: string;
  };
  accessibility?: {
    considerations: string[];
    assistiveTech?: string[];
  };
  communication: {
    preferredTone: string;
    terminologyLevel: string;
  };
  objections: {
    barriers: string[];
    switchingCosts: string[];
    requirements?: string[];
  };
  quotes: string[];
  scenarios: string[];
  insights: {
    keyTakeaways: string[];
    designImplications: string[];
    opportunities: string[];
  };
  assumptions: {
    validated: string[];
    toResearch: string[];
  };
}

export interface GenerationResult {
  personas: Persona[];
  interviewGuide?: InterviewGuide;
  surveyGuide?: SurveyGuide;
  generatedAt: string;
  productName: string;
}

export interface InterviewGuide {
  introduction: string;
  warmupQuestions: string[];
  coreQuestions: {
    category: string;
    questions: string[];
  }[];
  closingQuestions: string[];
}

export interface SurveyGuide {
  title: string;
  sections: {
    name: string;
    questions: {
      question: string;
      type: "multiple_choice" | "scale" | "open_ended";
      options?: string[];
    }[];
  }[];
}

// File Upload Types
export interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string;
}

// API Response Types
export interface GenerateStreamEvent {
  type: "progress" | "content" | "complete" | "error";
  data: string;
  progress?: number;
}
