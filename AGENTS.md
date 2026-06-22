# AGENTS.md — PaperShelf

## Project Overview
PaperShelf is a full-stack research paper tracking app built with React + Vite + Supabase + Claude AI.

## Stack
- Frontend: React 18 + Vite + Tailwind CSS
- Backend/DB: Supabase (PostgreSQL + Auth + RLS)
- AI: Anthropic Claude API (claude-sonnet-4-6)
- Deployment: Netlify

## Project Structure
```
src/
  components/
    PaperCard.jsx       — Paper display card with hover actions
    AddPaperModal.jsx   — Form to add a new paper
    EditPaperModal.jsx  — Form to edit an existing paper
    AISummaryModal.jsx  — AI-powered paper summary using Claude
  context/
    AuthContext.jsx     — Supabase auth state management
  lib/
    supabase.js         — Supabase client
    ai.js               — Claude API integration
  pages/
    Dashboard.jsx       — Main app page (protected)
    Login.jsx           — Login page
    Register.jsx        — Register page
  App.jsx               — Router + route protection
  main.jsx              — Entry point
```

## Key Conventions
- All Supabase queries use RLS — always filter by user_id
- Environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ANTHROPIC_API_KEY
- Never hardcode credentials — all secrets in .env
- Components use Tailwind utility classes only — no custom CSS files
- AI calls go through src/lib/ai.js — keep API logic out of components

## AI Feature
The AI Summary feature (AISummaryModal.jsx) calls the Anthropic Claude API to generate:
1. A 2-3 sentence summary of the paper
2. 3 key topics
3. Why the paper is important

Prompt returns structured JSON. Parsing is handled in src/lib/ai.js.

## Database Schema
Table: papers
- id, user_id, title, authors, year, doi, tags, status, notes, rating, created_at
- RLS enabled: users can only read/write their own rows

## When Adding Features
- New DB columns: update schema.sql and add migration note
- New AI features: add to src/lib/ai.js, not inline in components
- Protected routes: wrap in PrivateRoute in App.jsx
- New modals: follow AddPaperModal pattern (controlled by parent state)