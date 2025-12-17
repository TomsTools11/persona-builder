/**
 * File processors for extracting text from uploaded documents
 * Supports PDF and DOCX files
 */

import pdf from "pdf-parse";
import mammoth from "mammoth";

export interface ProcessedFile {
  name: string;
  type: string;
  content: string;
}

/**
 * Process a PDF file and extract text content
 */
export async function processPDF(buffer: Buffer, filename: string): Promise<ProcessedFile> {
  try {
    const data = await pdf(buffer);
    return {
      name: filename,
      type: "pdf",
      content: data.text,
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error(`Failed to process PDF: ${filename}`);
  }
}

/**
 * Process a DOCX file and extract text content
 */
export async function processDOCX(buffer: Buffer, filename: string): Promise<ProcessedFile> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return {
      name: filename,
      type: "docx",
      content: result.value,
    };
  } catch (error) {
    console.error("Error processing DOCX:", error);
    throw new Error(`Failed to process DOCX: ${filename}`);
  }
}

/**
 * Process any supported file type
 */
export async function processFile(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ProcessedFile> {
  if (mimeType === "application/pdf" || filename.endsWith(".pdf")) {
    return processPDF(buffer, filename);
  } else if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.endsWith(".docx")
  ) {
    return processDOCX(buffer, filename);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

/**
 * Process multiple files
 */
export async function processFiles(
  files: { buffer: Buffer; name: string; type: string }[]
): Promise<ProcessedFile[]> {
  const results = await Promise.allSettled(
    files.map((file) => processFile(file.buffer, file.name, file.type))
  );

  return results
    .filter(
      (result): result is PromiseFulfilledResult<ProcessedFile> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
}

/**
 * Format processed files for inclusion in prompt
 */
export function formatFilesForPrompt(files: ProcessedFile[]): string {
  if (files.length === 0) return "";

  return files
    .map(
      (file) => `
## Research Document: ${file.name}
${file.content.substring(0, 5000)}${file.content.length > 5000 ? "..." : ""}
`
    )
    .join("\n\n");
}
