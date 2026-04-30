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
- `pdf-parse` (PDF) and `mammoth` (DOCX) for uploaded research file processing

## Architecture: Background Job + Polling

**This is the most important pattern in the codebase** — generation does NOT use SSE streaming. Long-running Claude calls (often 30–60s) would be killed by serverless function timeouts (Netlify ~26s, Vercel similar), so the app deploys to Railway (Docker container, no timeout) and uses a fire-and-forget background job pattern:

1. `POST /api/generate` (`app/api/generate/route.ts`) — parses `multipart/form-data` (form JSON + uploaded files), reads file buffers synchronously, creates a job via `lib/job-store.ts`, kicks off `processPersonaGeneration()` without awaiting it, and immediately returns `{ jobId, status: "pending" }`.
2. `GET /api/status/[id]` (`app/api/status/[id]/route.ts`) — client polls every ~1s for `{ status, progress, result, error }`. The frontend transitions to the `complete` state when status is `"completed"`.
3. `POST /api/download` (`app/api/download/route.ts`) — client POSTs the `GenerationResult` JSON; server renders the React-PDF document via `renderToBuffer` and streams back a PDF.

`lib/job-store.ts` is an in-memory `Map<string, Job>` attached to `globalThis` (so it survives Next.js dev hot reloads). **Consequences for any future work:**
- Jobs are lost on server restart and not shared across instances. If you scale Railway beyond one container, swap to Redis/DB before doing anything else.
- Old jobs are reaped opportunistically on each `createJob` call (>1h old).
- Status enum: `pending | fetching | analyzing | generating | formatting | completed | error`. The frontend, `GenerationProgress.tsx`, and the route all need to agree on these strings.

The progress values written by `processPersonaGeneration` (10/25/35/45/50/85/90/100) are hard-coded checkpoints, not real progress — adjust them together with any step changes.

## Frontend State Machine

`app/page.tsx` has four states (`AppState` in `types/index.ts`): `landing` → `form` → `generating` → `complete`. `landing` renders `LandingPage.tsx` (marketing); `form` renders `InputForm.tsx`; `generating` renders `GenerationProgress.tsx` (which owns the polling loop and cancel button); `complete` renders `OutputScreen.tsx`.

Form contract (`PersonaFormData` in `types/index.ts`):
- **Required:** `productName`, `targetAudience` (note: `websiteUrl` is now **optional** despite the type being `string` — the route treats empty string as "skip fetch")
- **Optional:** `competitorUrls[]`, `jobToBeDone`, file uploads
- The route currently ignores `competitorUrls` (`competitorContent: ""` is hardcoded) for speed — restore by mapping over them with `fetchWebsiteContent` if you need richer prompts.

## Persona Output Shape

`Persona` in `types/index.ts` is large and most subfields are optional in practice — Claude Haiku with the simplified `lib/personaPrompt.ts` does NOT reliably produce every field. **Both `OutputScreen.tsx` and `lib/pdfGenerator.tsx` rely on defensive null checks throughout.** When adding a field to the type or prompt, update the renderer and PDF generator with the same null-safe pattern (`?.`, `?? []`, fallback strings) — missing fields should never throw.

The Claude response is parsed by stripping ```json fences and slicing between the first `{` and last `}` before `JSON.parse`. If you change the prompt, keep the model's output JSON-only or update this parser.

## Deployment

- **Active:** Railway via `Dockerfile` + `railway.json` (Docker builder, `node:20-alpine`, `npm start` on port 3000). Auto-deploys from `main`.
- `netlify.toml` is still present but **not the active deployment** — Netlify's serverless timeouts are why we moved off it. Don't reintroduce streaming/long-running patterns assuming Netlify will work.
- `next.config.js` sets a CSP that allow-lists `api.anthropic.com` and `r.jina.ai` for `connect-src`. Any new external API call needs a CSP update there.
- `pdf-parse` is in `serverExternalPackages` because it bundles weirdly otherwise.

## Environment

```
ANTHROPIC_API_KEY=sk-ant-xxx    # Required
JINA_API_KEY=jina_xxx           # Optional, raises Jina rate limits
```

## Design System

Custom palette in `tailwind.config.ts` (dark surfaces `#1F1F1F`/`#191919`/`#2A2A2A`, accent `#2383E2`). The repo includes `style-guide.pdf` (21pp), `Persona Builder High-Level Overview.md`, and `example-*.png` mockups — consult these before changing visual design rather than improvising.
