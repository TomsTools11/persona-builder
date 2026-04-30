/**
 * Claude prompt template for generating user personas
 */

interface PromptContext {
  description: string;
  websiteUrl: string;
  websiteContent: string;
}

export function buildPersonaPrompt(context: PromptContext): string {
  const { description, websiteUrl, websiteContent } = context;

  // Truncate website content to avoid huge prompts
  const truncatedWebsite = websiteContent.substring(0, 3000);

  return `Generate 3 user personas for the following product.

Description: ${description}
Website: ${websiteUrl}

Context from website:
${truncatedWebsite || "No website content available"}

Infer a concise product name (1-3 words) from the description and website. Return JSON only:
{"productName":"Short Product Name","personas":[{"id":"persona-1","type":"The [Name]","tagline":"One line","background":{"summary":"2 sentences","workContext":"Environment","domainFamiliarity":"Low/Med/High"},"demographics":{"ageRange":"25-34","location":"Urban"},"goals":{"primary":["Goal 1","Goal 2"],"successDefinition":"Success metric"},"painPoints":{"challenges":["Challenge 1","Challenge 2"],"triggers":["Trigger"]},"behaviors":{"routines":["Behavior 1"],"frequency":"Daily/Weekly"},"needs":{"core":["Need 1"],"mustHaves":["Must have"]},"technology":{"devices":["Device"],"techComfort":"Medium"},"quotes":["Quote"],"insights":{"keyTakeaways":["Insight 1"],"opportunities":["Opportunity"]}}],"interviewGuide":{"introduction":"Intro","warmupQuestions":["Q1"],"coreQuestions":[{"category":"Goals","questions":["Q1","Q2"]}],"closingQuestions":["Final"]}}

Rules: Be specific, not generic. Each persona must be different. Valid JSON only.`;
}
