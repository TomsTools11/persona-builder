import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  fetchWebsiteContent,
  summarizeWebsiteContent,
} from "@/lib/websiteFetcher";
import { buildPersonaPrompt } from "@/lib/personaPrompt";
import type { PersonaFormData } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  let personaFormData: PersonaFormData;
  try {
    personaFormData = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !personaFormData?.description?.trim() ||
    !personaFormData?.websiteUrl?.trim()
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    let websiteContent = "";
    try {
      const primaryWebsite = await fetchWebsiteContent(
        personaFormData.websiteUrl
      );
      websiteContent = summarizeWebsiteContent(primaryWebsite);
    } catch (error) {
      console.error("Error fetching website:", error);
      websiteContent = `Website: ${personaFormData.websiteUrl} (could not fetch)`;
    }

    const prompt = buildPersonaPrompt({
      description: personaFormData.description,
      websiteUrl: personaFormData.websiteUrl,
      websiteContent,
    });

    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let jsonString = textContent.text.trim();

    if (jsonString.includes("```")) {
      const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonString = match[1].trim();
      }
    }

    const jsonStart = jsonString.indexOf("{");
    const jsonEnd = jsonString.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON in response");
    }
    jsonString = jsonString.slice(jsonStart, jsonEnd + 1);

    let result;
    try {
      result = JSON.parse(jsonString);
    } catch {
      console.error("JSON parse error, response:", jsonString.substring(0, 500));
      throw new Error("Failed to parse personas - invalid JSON");
    }

    result.generatedAt = new Date().toISOString();
    if (!result.productName || typeof result.productName !== "string") {
      result.productName = deriveProductNameFromUrl(personaFormData.websiteUrl);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}

function deriveProductNameFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.split(".")[0] || "User Personas";
  } catch {
    return "User Personas";
  }
}
