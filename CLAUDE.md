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

## Architecture: Background Job + Polling

**This is the most important pattern in the codebase** — generation does NOT use SSE streaming. Long-running Claude calls (often 30–60s) historically would be killed by serverless function timeouts, so the app uses a fire-and-forget background job pattern:

1. `POST /api/generate` (`app/api/generate/route.ts`) — parses JSON body, creates a job via `lib/job-store.ts`, kicks off `processPersonaGeneration()` without awaiting it, and immediately returns `{ jobId, status: "pending" }`.
2. `GET /api/status/[id]` (`app/api/status/[id]/route.ts`) — client polls every ~1s for `{ status, progress, result, error }`. The frontend transitions to the `complete` state when status is `"completed"`.
3. `POST /api/download` (`app/api/download/route.ts`) — client POSTs the `GenerationResult` JSON; server renders the React-PDF document via `renderToBuffer` and streams back a PDF.

`lib/job-store.ts` is an in-memory `Map<string, Job>` attached to `globalThis` (so it survives Next.js dev hot reloads). **Consequences for any future work:**
- Jobs are lost on server restart and not shared across instances. The store assumes a single long-lived Node process — it does NOT work on serverless platforms (Vercel, Netlify) where the function instance handling the polling request can differ from the one that created the job, and where the fire-and-forget Promise is suspended after the response is sent. To run on Vercel, switch the architecture to either a synchronous response (drop polling, `await` Claude inline) or back the job store with Vercel KV / Upstash Redis.
- Old jobs are reaped opportunistically on each `createJob` call (>1h old).
- Status enum: `pending | fetching | analyzing | generating | formatting | completed | error`. The frontend, `GenerationProgress.tsx`, and the route all need to agree on these strings.

The progress values written by `processPersonaGeneration` (10/25/35/45/50/85/90/100) are hard-coded checkpoints, not real progress — adjust them together with any step changes.

## Frontend State Machine

`app/page.tsx` has four states (`AppState` in `types/index.ts`): `landing` → `form` → `generating` → `complete`. `landing` renders `LandingPage.tsx` (marketing); `form` renders `InputForm.tsx`; `generating` renders `GenerationProgress.tsx` (which owns the polling loop and cancel button); `complete` renders `OutputScreen.tsx`.

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
- **Architecture caveat:** the in-memory job store described above is incompatible with serverless deployment. Before shipping to Vercel, either switch `/api/generate` to await Claude synchronously and return the result inline (and drop the polling), or replace `lib/job-store.ts` with a shared store such as Vercel KV / Upstash Redis.

## Environment

```
ANTHROPIC_API_KEY=sk-ant-xxx    # Required
JINA_API_KEY=jina_xxx           # Optional, raises Jina rate limits
```

## Design System

Custom palette in `tailwind.config.ts` (dark surfaces `#1F1F1F`/`#191919`/`#2A2A2A`, accent `#2383E2`). The repo includes `style-guide.pdf` (21pp), `Persona Builder High-Level Overview.md`, and `example-*.png` mockups — consult these before changing visual design rather than improvising.
