# Persona Builder

A Next.js web application that transforms website URLs and research materials into actionable user personas using Claude AI. Generate professionally formatted PDF reports with personas, JTBD statements, interview guides, and more.

## Features

- **AI-Powered Analysis** - Uses Claude AI to extract user segments, goals, pain points, and behaviors from your inputs
- **Website Scraping** - Automatically fetches and analyzes website content via Jina AI Reader
- **File Upload Support** - Upload PDF and DOCX research documents for additional context
- **Competitor Analysis** - Include competitor URLs to enrich persona insights
- **Customizable Output** - Toggle persona count, demographics, and optional sections
- **Real-time Progress** - SSE streaming shows generation progress as it happens
- **PDF Export** - Download polished, professionally formatted persona documents

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Anthropic Claude API
- **PDF Generation:** react-pdf-renderer
- **Website Scraping:** Jina AI Reader
- **File Processing:** pdf-parse, mammoth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd persona-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your API keys to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   JINA_API_KEY=your-jina-api-key-here  # Optional, for higher rate limits
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Product Details**
   - Product/feature name (required)
   - Website URL (required)
   - Target audience description (required)

2. **Add Optional Context**
   - Competitor URLs (up to 5)
   - Job to be done statement
   - Upload research documents (PDF/DOCX)

3. **Configure Output**
   - Select persona count (2-5)
   - Toggle demographic sections
   - Include/exclude interview guide, survey, or journey map

4. **Generate & Download**
   - Click "Generate Personas" and watch real-time progress
   - Review generated personas on screen
   - Download as a formatted PDF

## Project Structure

```
app/
├── page.tsx              # Main page (landing/generating/complete states)
├── layout.tsx            # Root layout
├── globals.css           # Global styles
└── api/
    ├── generate/route.ts # Claude API + SSE streaming
    └── download/route.ts # PDF generation endpoint

components/
├── Header.tsx            # App header with navigation
├── InputForm.tsx         # Main form with inputs and toggles
├── GenerationProgress.tsx # Real-time progress UI
└── OutputScreen.tsx      # Results display

lib/
├── websiteFetcher.ts     # Jina AI Reader integration
├── fileProcessors.ts     # PDF/DOCX parsing utilities
├── personaPrompt.ts      # Claude prompt template
└── pdfGenerator.tsx      # react-pdf document template

types/
└── index.ts              # TypeScript interfaces
```

## API Endpoints

### POST `/api/generate`
Generates personas from provided inputs. Uses SSE for real-time progress updates.

**Request:** `multipart/form-data`
- `formData` - JSON string with form inputs
- `files` - Optional research documents

**Response:** Server-Sent Events stream
- `progress` - Step and percentage updates
- `content` - Generated content chunks
- `complete` - Final result with personas
- `error` - Error messages

### POST `/api/download`
Generates a PDF from persona data.

**Request:** JSON body with `GenerationResult`

**Response:** PDF file download

## Scripts

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary build settings.

1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard:
   - `ANTHROPIC_API_KEY`
   - `JINA_API_KEY` (optional)
3. Deploy

## License

MIT
