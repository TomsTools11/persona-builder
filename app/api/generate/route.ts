import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  fetchWebsiteContent,
  summarizeWebsiteContent,
} from "@/lib/websiteFetcher";
import { buildPersonaPrompt } from "@/lib/personaPrompt";
import { createJob, updateJob, generateJobId } from "@/lib/job-store";
import type { PersonaFormData } from "@/types";

// Configure for longer running requests
export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds max

export async function POST(request: NextRequest) {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const personaFormData: PersonaFormData = await request.json();

    // Validate required fields
    if (
      !personaFormData?.description?.trim() ||
      !personaFormData?.websiteUrl?.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create job and return ID immediately
    const jobId = generateJobId();
    createJob(jobId);

    // Start background processing (fire-and-forget)
    processPersonaGeneration(jobId, personaFormData, apiKey).catch((error) => {
      console.error("Background processing error:", error);
      updateJob(jobId, {
        status: "error",
        error: error instanceof Error ? error.message : "Generation failed",
      });
    });

    // Return job ID immediately
    return NextResponse.json({ jobId, status: "pending" });
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}

async function processPersonaGeneration(
  jobId: string,
  personaFormData: PersonaFormData,
  apiKey: string
) {
  try {
    // Step 1: Fetch website content
    updateJob(jobId, { status: "fetching", progress: 10 });

    let websiteContent = "";
    if (personaFormData.websiteUrl) {
      try {
        const primaryWebsite = await fetchWebsiteContent(
          personaFormData.websiteUrl
        );
        websiteContent = summarizeWebsiteContent(primaryWebsite);
      } catch (error) {
        console.error("Error fetching website:", error);
        websiteContent = `Website: ${personaFormData.websiteUrl} (could not fetch)`;
      }
    }

    // Step 2: Build prompt
    updateJob(jobId, { status: "analyzing", progress: 45 });

    const prompt = buildPersonaPrompt({
      description: personaFormData.description,
      websiteUrl: personaFormData.websiteUrl,
      websiteContent,
    });

    // Step 3: Call Claude API (non-streaming for speed)
    updateJob(jobId, { status: "generating", progress: 50 });

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    updateJob(jobId, { status: "generating", progress: 85 });

    // Step 4: Parse response
    updateJob(jobId, { status: "formatting", progress: 90 });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let jsonString = textContent.text.trim();

    // Remove markdown code blocks if present
    if (jsonString.includes("```")) {
      const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonString = match[1].trim();
      }
    }

    // Find JSON boundaries
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

    // Add metadata; fall back to URL host if Claude didn't include a name
    result.generatedAt = new Date().toISOString();
    if (!result.productName || typeof result.productName !== "string") {
      result.productName = deriveProductNameFromUrl(personaFormData.websiteUrl);
    }

    // Complete!
    updateJob(jobId, {
      status: "completed",
      progress: 100,
      result,
    });

    console.log(`Job ${jobId} completed with ${result.personas?.length} personas`);
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    updateJob(jobId, {
      status: "error",
      error: error instanceof Error ? error.message : "Generation failed",
    });
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
