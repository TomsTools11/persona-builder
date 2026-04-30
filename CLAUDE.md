# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start dev server (Next.js with Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (eslint-config-next)
```

There is no test runner configured in `package.json`. `@playwright/test` is installed but no Playwright config or test directory currently exists.

## Tech Stack

- Next.js 15 (App Router) + React 19, TypeScript
- Tailwind CSS with custom design tokens in `tailwind.config.ts`
- Anthropic SDK (`@anthropic-ai/sdk`) — model is `claude-haiku-4-5-20251001` (chosen for generation speed)
- `@react-pdf/renderer` for PDF output
- Jina AI Reader (https://r.jina.ai) for website-to-markdown scraping

## Architecture: Synchronous Generation

`/api/generate` is a single synchronous request. The client POSTs the `PersonaFormData` JSON, the route fetches the website via Jina, calls Claude, parses the JSON, and returns the full `GenerationResult` in the response body. There is no job store, no `/api/status/[id]` polling endpoint, and no fire-and-forget background work — the architecture intentionally fits inside a single serverless invocation so it works on Vercel.

1. `POST /api/generate` (`app/api/generate/route.ts`) — validates `{ description, websiteUrl }`, fetches website content (with a graceful fallback if the fetch fails), calls Claude Haiku, parses the response, and returns the `GenerationResult` JSON. `export const maxDuration = 60` gives it the full Vercel timeout budget. Generation typically takes 30–60s.
2. `POST /api/download` (`app/api/download/route.ts`) — client POSTs the `GenerationResult` JSON; server renders the React-PDF document via `renderToBuffer` and streams back a PDF.

If Claude generation ever exceeds 60s in practice, switch the platform plan (Pro raises `maxDuration`) or move generation behind a queue with a shared store (Vercel KV / Upstash Redis). Don't reintroduce the in-memory `Map` job store — that pattern only works on a long-lived Node process and is the reason the previous Railway-era code couldn't run on Vercel.

## Frontend State Machine

`app/page.tsx` has four states (`AppState` in `types/index.ts`): `landing` → `form` → `generating` → `complete`. `landing` renders `LandingPage.tsx` (marketing); `form` renders `InputForm.tsx`; `generating` renders `GenerationProgress.tsx` (an indeterminate spinner with elapsed-time counter and cancel button); `complete` renders `OutputScreen.tsx`. Submission `await`s the `/api/generate` response in `handleSubmit` and transitions directly to `complete`.

Form contract (`PersonaFormData` in `types/index.ts`):
- **Required:** `description`, `websiteUrl` — both are validated in `/api/generate`.
- The prompt template (`lib/personaPrompt.ts`) hardcodes 3 personas, the interview guide section, and age + location demographics. Claude is asked to infer a `productName` from the description/website and return it on the result; the route falls back to the URL hostname if it's missing.

## Persona Output Shape

`Persona` in `types/index.ts` is large and most subfields are optional in practice — Claude Haiku with the simplified `lib/personaPrompt.ts` does NOT reliably produce every field. **Both `OutputScreen.tsx` and `lib/pdfGenerator.tsx` rely on defensive null checks throughout.** When adding a field to the type or prompt, update the renderer and PDF generator with the same null-safe pattern (`?.`, `?? []`, fallback strings) — missing fields should never throw.

The Claude response is parsed by stripping ```json fences and slicing between the first `{` and last `}` before `JSON.parse`. If you change the prompt, keep the model's output JSON-only or update this parser.

## Deployment

- **Target:** Vercel — connect the GitHub repo and Vercel will auto-detect the Next.js app. No `vercel.json` is required; the API route sets `export const maxDuration = 60` directly so generation runs up to 60s (Vercel Hobby ceiling; Pro/Enterprise allow more).
- Set `ANTHROPIC_API_KEY` (required) and `JINA_API_KEY` (optional) in the Vercel project settings.
- `next.config.js` sets a CSP that allow-lists `api.anthropic.com` and `r.jina.ai` for `connect-src`. Any new external API call needs a CSP update there.

## Environment

```
ANTHROPIC_API_KEY=sk-ant-xxx    # Required
JINA_API_KEY=jina_xxx           # Optional, raises Jina rate limits
```

## Design System

Custom palette in `tailwind.config.ts` (dark surfaces `#1F1F1F`/`#191919`/`#2A2A2A`, accent `#2383E2`). The repo includes `style-guide.pdf` (21pp), `Persona Builder High-Level Overview.md`, and `example-*.png` mockups — consult these before changing visual design rather than improvising.
