import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PersonaDocument } from "@/lib/pdfGenerator";
import type { GenerationResult } from "@/types";
import React from "react";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const result: GenerationResult = await request.json();

    if (!result || !result.personas || result.personas.length === 0) {
      return NextResponse.json(
        { error: "Invalid result data" },
        { status: 400 }
      );
    }

    // Generate PDF buffer
    const document = React.createElement(PersonaDocument, { result });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(document as any);

    // Return PDF as downloadable file
    const filename = `${result.productName.replace(/[^a-zA-Z0-9]/g, "-")}-personas.pdf`;

    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF generation failed" },
      { status: 500 }
    );
  }
}
