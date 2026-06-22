# PaperShelf — PLAN.md

## Concept
PaperShelf is a personal research paper tracking app for students and researchers. Users can save, organize, rate, and take notes on academic papers they are reading or plan to read.

## Problem It Solves
Researchers accumulate dozens of papers across browser tabs, downloads, and email threads with no central place to track what they have read, what they found useful, or what their notes were. PaperShelf solves this with a simple, authenticated CRUD app that keeps everything in one place.

## Target User
Graduate students and researchers managing a reading list of academic papers.

## Scope (Week 2)
- User registration and login via Supabase Auth
- Add papers (title, authors, year, DOI, tags, status, notes, rating)
- Update paper status: Unread → Reading → Done
- Edit notes and rating
- Delete papers
- Filter papers by status
- Row-level security: users can only see and edit their own papers

## Out of Scope (future)
- Sharing papers with other users
- PDF upload and annotation
- Citation export
- DOI auto-fetch metadata

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| Hosting | Netlify (auto-deploy from GitHub) |
| Version Control | GitHub (GitHub Classroom repo) |

## Data Model

### Table: papers
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key, auto-generated |
| user_id | uuid | Foreign key → auth.users.id |
| title | text | Required |
| authors | text | Comma-separated author names |
| year | integer | Publication year |
| doi | text | Optional DOI or URL |
| tags | text | Comma-separated tags |
| status | text | 'unread', 'reading', 'done' |
| notes | text | Personal notes |
| rating | integer | 1–5 stars, nullable |
| created_at | timestamptz | Auto-set by Supabase |

## Architecture
```
Browser (React/Vite)
    ↓ Supabase JS Client
Supabase Auth  →  JWT token in localStorage
    ↓
Supabase PostgREST API
    ↓
PostgreSQL (papers table with RLS)
```

Row-Level Security ensures each user can only read/write their own rows.
