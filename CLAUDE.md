# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Overview

Persona Builder is a Next.js 15 web application that converts website URLs and research materials into actionable user personas using Claude AI. It outputs a professionally formatted PDF.

**Deployment:** Netlify

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (custom design system)
- **AI:** Anthropic Claude API (Sonnet 4.5)
- **PDF:** react-pdf-renderer
- **Website Scraping:** Jina AI Reader
- **File Processing:** pdf-parse, mammoth

## Project Structure

```
app/
├── page.tsx              # Main page (3-state: landing/generating/complete)
├── layout.tsx            # Root layout
├── globals.css           # Global styles
└── api/
    ├── generate/route.ts # Claude API + SSE streaming
    └── download/route.ts # PDF generation endpoint

components/
├── Header.tsx            # App header
├── InputForm.tsx         # Main form with all inputs/toggles
├── GenerationProgress.tsx # Progress UI
└── OutputScreen.tsx      # Results display

lib/
├── websiteFetcher.ts     # Jina AI Reader integration
├── fileProcessors.ts     # PDF/DOCX parsing
├── personaPrompt.ts      # Claude prompt template
└── pdfGenerator.tsx      # react-pdf document template

types/
└── index.ts              # TypeScript interfaces
```

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-xxx    # Required
JINA_API_KEY=jina_xxx           # Optional (for higher rate limits)
```

## Key Patterns

### SSE Streaming
The `/api/generate` endpoint uses Server-Sent Events for real-time progress updates:
```typescript
sendEvent({ type: "progress", step: "fetching", progress: 10 });
sendEvent({ type: "content", data: text });
sendEvent({ type: "complete", result });
```

### Application State
Three states managed in `page.tsx`:
- `landing` - Input form
- `generating` - Progress UI with real-time updates
- `complete` - Results with PDF download

### Form Inputs
- **Required:** productName, websiteUrl, targetAudience
- **Optional:** competitorUrls[], jobToBeDone
- **Toggles:** personaCount, includeSections, includeDemographics

## Design System

Colors defined in `tailwind.config.ts`:
- Primary: #1F1F1F, #191919 (dark backgrounds)
- Accent: #2383E2 (teal)
- Surface: #2A2A2A, #3A3A3A (cards)
- Text: #2F2F2F (primary), #A0A0A0 (secondary)

## Design Documents

- `Persona Builder High-Level Overview.md` - Product requirements
- `style-guide.pdf` - Complete design system (21 pages)
- `example-*.png` - UI mockups
