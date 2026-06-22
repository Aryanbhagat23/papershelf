# 📚 PaperShelf — Research Paper Tracker

A full-stack web app for researchers and students to track, organize, and annotate academic papers they are reading.

**Live URL:** https://papershelf.netlify.app

---

## Project Overview

PaperShelf solves a real problem: researchers accumulate dozens of papers across browser tabs, email threads, and downloads with no central place to track reading progress or notes. PaperShelf provides a simple, authenticated CRUD app where each user manages their own personal reading list.

### Features
- Register and login with email/password
- Add papers with title, authors, year, DOI, tags, status, notes, and star rating
- Update reading status: Unread → Reading → Done
- Edit paper details and notes
- Delete papers
- Filter by status (All / Unread / Reading / Done)
- Row-level security: users can only see their own papers

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth + Row Level Security) |
| Hosting | Netlify (auto-deploy on push to main) |
| Auth | Supabase Auth (email/password + JWT) |

---

## Data Model

### Table: `papers`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `user_id` | uuid | FK → auth.users.id, set on insert |
| `title` | text | Required |
| `authors` | text | Comma-separated |
| `year` | integer | Publication year |
| `doi` | text | DOI or URL |
| `tags` | text | Comma-separated tags |
| `status` | text | 'unread' \| 'reading' \| 'done' |
| `notes` | text | Personal notes |
| `rating` | integer | 1–5 stars |
| `created_at` | timestamptz | Auto-set |

### ERD

```
auth.users
  └── id (PK)

papers
  ├── id (PK, uuid)
  ├── user_id (FK → auth.users.id)
  ├── title (text, NOT NULL)
  ├── authors (text)
  ├── year (integer)
  ├── doi (text)
  ├── tags (text)
  ├── status (text: unread|reading|done)
  ├── notes (text)
  ├── rating (integer 1-5)
  └── created_at (timestamptz)
```

**Relationship:** One user → many papers (one-to-many). RLS enforces user_id = auth.uid() on all operations.

---

## Architecture

```
Browser (React + Vite + Tailwind)
         │
         │ Supabase JS Client (REST API calls)
         │
    ┌────▼────────────────────────────┐
    │         Supabase                │
    │  ┌──────────┐  ┌─────────────┐ │
    │  │   Auth   │  │ PostgreSQL  │ │
    │  │ (JWT)    │  │ (papers     │ │
    │  │          │  │  table RLS) │ │
    │  └──────────┘  └─────────────┘ │
    └─────────────────────────────────┘
         │
    Netlify (static hosting + redirects)
```

- Frontend is a React SPA deployed as static files on Netlify
- All data operations go through the Supabase JS client directly (no custom backend needed)
- Supabase Auth issues JWTs stored in localStorage for session persistence
- Row Level Security policies on the `papers` table ensure users only access their own data

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm
- A free [Supabase](https://supabase.com) account

### 1. Clone the repository
```bash
git clone https://github.com/FAU-AI-HootCamp-Summer-2026/week2-Aryanbhagat23.git
cd week2-Aryanbhagat23
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `schema.sql`
3. Go to **Settings → API** and copy your Project URL and anon key

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## Usage Guide

1. **Register** — click Register on the login page, enter your email and password
2. **Confirm email** — check your email and click the confirmation link
3. **Login** — sign in with your credentials
4. **Add a paper** — click **+ Add Paper**, fill in the title and any other fields
5. **Update status** — click **Edit** on any paper card and change the status dropdown
6. **Add notes** — click **Edit** and type your notes in the Notes field
7. **Rate a paper** — select 1–5 stars in the Edit modal
8. **Filter** — click the filter tabs (All / Unread / Reading / Done) to narrow the list
9. **Delete** — hover over a paper card and click **Delete**, then confirm

---

## Deployment

The app is deployed on Netlify with auto-deploy on push to `main`.

### To deploy your own instance:
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → New site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify → Site settings → Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Trigger deploy

The `netlify.toml` file handles SPA routing redirects automatically.

---

## Security Notes

- `.env` is in `.gitignore` — keys are never committed
- Supabase Row Level Security ensures users can only read/write their own rows
- Passwords are handled entirely by Supabase Auth (bcrypt hashed, never stored in our database)
- The Supabase anon key is safe to expose in the frontend — RLS policies enforce access control at the database level
