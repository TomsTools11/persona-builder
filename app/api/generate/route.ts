import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  fetchWebsiteContent,
  fetchMultipleWebsites,
  summarizeWebsiteContent,
} from "@/lib/websiteFetcher";
import { processFile, formatFilesForPrompt } from "@/lib/fileProcessors";
import { buildPersonaPrompt } from "@/lib/personaPrompt";
import type { PersonaFormData } from "@/types";

// Configure for longer running requests
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes

export async function POST(request: NextRequest) {
  // Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse form data
    const formData = await request.formData();
    const formDataJson = formData.get("formData");

    if (!formDataJson || typeof formDataJson !== "string") {
      return new Response(JSON.stringify({ error: "Missing form data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const personaFormData: PersonaFormData = JSON.parse(formDataJson);

    // Validate required fields (websiteUrl is now optional)
    if (!personaFormData.productName || !personaFormData.targetAudience) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create SSE response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: object) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // Step 1: Fetch primary website content (if provided)
          sendEvent({ type: "progress", step: "fetching", progress: 10 });

          let websiteContent = "";
          if (personaFormData.websiteUrl) {
            try {
              const primaryWebsite = await fetchWebsiteContent(
                personaFormData.websiteUrl
              );
              websiteContent = summarizeWebsiteContent(primaryWebsite);
            } catch (error) {
              console.error("Error fetching primary website:", error);
              websiteContent = `Website URL: ${personaFormData.websiteUrl}\n(Content could not be fetched automatically)`;
            }
          }

          // Step 2: Fetch competitor websites if provided
          sendEvent({ type: "progress", step: "fetching", progress: 25 });

          let competitorContent = "";
          if (personaFormData.competitorUrls.length > 0) {
            const competitorWebsites = await fetchMultipleWebsites(
              personaFormData.competitorUrls
            );
            competitorContent = competitorWebsites
              .map((site) => summarizeWebsiteContent(site))
              .join("\n\n---\n\n");
          }

          // Step 3: Process uploaded files
          sendEvent({ type: "progress", step: "analyzing", progress: 35 });

          const files = formData.getAll("files") as File[];
          let fileContent = "";

          if (files.length > 0) {
            const processedFiles = [];
            for (const file of files) {
              try {
                const buffer = Buffer.from(await file.arrayBuffer());
                const processed = await processFile(buffer, file.name, file.type);
                processedFiles.push(processed);
              } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
              }
            }
            fileContent = formatFilesForPrompt(processedFiles);
          }

          // Step 4: Build the prompt
          sendEvent({ type: "progress", step: "analyzing", progress: 45 });

          const prompt = buildPersonaPrompt({
            formData: personaFormData,
            websiteContent,
            competitorContent,
            fileContent,
          });

          // Step 5: Call Claude API with streaming
          sendEvent({ type: "progress", step: "generating", progress: 50 });

          const anthropic = new Anthropic({ apiKey });

          let fullResponse = "";

          const stream = anthropic.messages.stream({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 8000,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          });

          // Process streaming response
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullResponse += text;

              // Send content chunk
              sendEvent({ type: "content", data: text });

              // Update progress based on response length
              const estimatedProgress = Math.min(
                95,
                50 + (fullResponse.length / 20000) * 45
              );
              sendEvent({
                type: "progress",
                step: "generating",
                progress: estimatedProgress,
              });
            }
          }

          // Step 6: Parse and validate the response
          sendEvent({ type: "progress", step: "formatting", progress: 95 });

          // Extract JSON from the response
          let result;

          // First try to parse as raw JSON
          try {
            result = JSON.parse(fullResponse.trim());
          } catch {
            // Try to extract from markdown code block
            const jsonMatch = fullResponse.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            if (jsonMatch) {
              try {
                result = JSON.parse(jsonMatch[1].trim());
              } catch {
                throw new Error("Failed to parse generated personas");
              }
            } else {
              // Try to find JSON object in response
              const jsonStart = fullResponse.indexOf('{');
              const jsonEnd = fullResponse.lastIndexOf('}');
              if (jsonStart !== -1 && jsonEnd !== -1) {
                try {
                  result = JSON.parse(fullResponse.slice(jsonStart, jsonEnd + 1));
                } catch {
                  throw new Error("No valid JSON found in response");
                }
              } else {
                throw new Error("No valid JSON found in response");
              }
            }
          }

          // Add metadata
          result.generatedAt = new Date().toISOString();
          result.productName = personaFormData.productName;

          // Send completion event
          sendEvent({
            type: "complete",
            result,
          });

          controller.close();
        } catch (error) {
          console.error("Generation error:", error);
          sendEvent({
            type: "error",
            message:
              error instanceof Error ? error.message : "Generation failed",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Request failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
