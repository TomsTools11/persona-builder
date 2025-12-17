/**
 * Website content fetcher using Jina AI Reader API
 * Converts URLs to LLM-friendly markdown
 */

interface WebsiteContent {
  title: string;
  description: string;
  content: string;
  url: string;
}

interface JinaResponse {
  code: number;
  status: number;
  data: {
    title: string;
    description: string;
    url: string;
    content: string;
    usage: {
      tokens: number;
    };
  };
}

export async function fetchWebsiteContent(url: string): Promise<WebsiteContent> {
  const jinaApiKey = process.env.JINA_API_KEY;

  // Construct the Jina Reader URL
  const jinaUrl = `https://r.jina.ai/${url}`;

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  // Add API key if available (for higher rate limits)
  if (jinaApiKey) {
    headers["Authorization"] = `Bearer ${jinaApiKey}`;
  }

  try {
    const response = await fetch(jinaUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const data: JinaResponse = await response.json();

    return {
      title: data.data.title || "Unknown",
      description: data.data.description || "",
      content: data.data.content || "",
      url: data.data.url || url,
    };
  } catch (error) {
    console.error("Error fetching website content:", error);
    throw new Error(
      `Failed to fetch content from ${url}. The website may be blocking automated access.`
    );
  }
}

export async function fetchMultipleWebsites(
  urls: string[]
): Promise<WebsiteContent[]> {
  const results = await Promise.allSettled(
    urls.map((url) => fetchWebsiteContent(url))
  );

  return results
    .filter(
      (result): result is PromiseFulfilledResult<WebsiteContent> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
}

/**
 * Extract key information from website content for persona generation
 */
export function summarizeWebsiteContent(content: WebsiteContent): string {
  // Truncate content if too long (Claude has context limits)
  const maxContentLength = 8000;
  const truncatedContent =
    content.content.length > maxContentLength
      ? content.content.substring(0, maxContentLength) + "..."
      : content.content;

  return `
## Website: ${content.title}
URL: ${content.url}
Description: ${content.description}

### Content:
${truncatedContent}
`.trim();
}
