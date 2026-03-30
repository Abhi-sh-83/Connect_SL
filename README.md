# ConnectSL - Smart Transit Desk

Hackathon-ready Next.js application for an AI-powered smart service request platform focused on Sri Lankan public transit support.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS + shadcn-style UI components
- Firebase Firestore for realtime ticket tracking
- OpenAI API for ticket classification and mock-RAG travel advice

## Features

- Commuter portal with a polished chat/form-style submission experience
- Admin dashboard with live ticket queue and status transitions
- `POST /api/ai/classify` for category and priority prediction
- `POST /api/ai/advice` for mock-RAG suggested resolution steps
- `POST /api/tickets` to classify, generate advice, and create a ticket
- Mock transit knowledge base in `data/transit-kb.json`
- Fallback heuristics if OpenAI or Firebase credentials are not configured

## Project Structure

```text
.
|-- app/
|   |-- admin/page.tsx
|   |-- api/
|   |   |-- ai/
|   |   |   |-- advice/route.ts
|   |   |   `-- classify/route.ts
|   |   |-- tickets/
|   |   |   |-- [ticketId]/route.ts
|   |   |   `-- route.ts
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- admin-dashboard.tsx
|   |-- commuter-portal.tsx
|   |-- status-badges.tsx
|   `-- ui/
|       |-- badge.tsx
|       |-- button.tsx
|       |-- card.tsx
|       |-- input.tsx
|       `-- textarea.tsx
|-- data/
|   `-- transit-kb.json
|-- lib/
|   |-- ai/
|   |   |-- openai.ts
|   |   `-- ticket-intelligence.ts
|   |-- firebase/
|   |   |-- admin.ts
|   |   `-- client.ts
|   |-- demo-tickets.ts
|   |-- knowledge-base.ts
|   `-- utils.ts
|-- types/
|   `-- ticket.ts
|-- .env.example
|-- components.json
|-- package.json
|-- tailwind.config.ts
`-- tsconfig.json
```

## Required Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4o-mini

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Run

```bash
npm install
npm run dev
```

Open `/` for the commuter portal and `/admin` for the operations dashboard.

## Judging Notes

- The RAG workflow is intentionally simplified for the 4-hour hackathon: the backend injects the mock JSON knowledge base into the LLM prompt instead of using a vector database.
- If credentials are missing, the app still demonstrates the complete UX using deterministic fallback AI logic and demo dashboard data.
