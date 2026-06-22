# PaperShelf — BUILD_STEPS.md

Each step ends with a Verify checkpoint before moving to the next.

---

## Step 1 — Project Scaffold
- [x] Create Vite + React project
- [x] Install Tailwind CSS, Supabase JS client
- [x] Set up .env with Supabase URL and anon key
- [x] Commit: `chore: init vite react project with tailwind and supabase`

**Verify:** `npm run dev` shows blank React app with no errors

---

## Step 2 — Supabase Setup
- [x] Create Supabase project
- [x] Run SQL to create papers table
- [x] Enable Row Level Security
- [x] Add RLS policies (select/insert/update/delete own rows)
- [x] Commit: `chore: supabase schema and RLS policies`

**Verify:** Table visible in Supabase dashboard, RLS enabled

---

## Step 3 — Auth System
- [x] Create AuthContext with session state
- [x] Build Login page (email + password)
- [x] Build Register page
- [x] Add logout button
- [x] Protect app routes — redirect to login if not authenticated
- [x] Commit: `feat: auth — register, login, logout with supabase`

**Verify:** Can register a new user, login, see session, logout clears session

---

## Step 4 — Add Paper (Create)
- [x] Build AddPaperForm component
- [x] POST to Supabase papers table with user_id
- [x] Commit: `feat: add paper form with supabase insert`

**Verify:** Submit form, paper appears in Supabase dashboard

---

## Step 5 — Paper List (Read)
- [x] Build PaperList component
- [x] Fetch papers for current user from Supabase
- [x] Display title, authors, year, status, rating
- [x] Commit: `feat: paper list with supabase select`

**Verify:** Papers show in UI after adding

---

## Step 6 — Update Paper
- [x] Build EditPaperModal component
- [x] PATCH paper in Supabase on save
- [x] Status toggle (Unread → Reading → Done)
- [x] Commit: `feat: edit paper modal with supabase update`

**Verify:** Edit paper, changes persist on refresh

---

## Step 7 — Delete Paper
- [x] Add delete button to each paper card
- [x] DELETE from Supabase on confirm
- [x] Commit: `feat: delete paper with confirmation`

**Verify:** Delete paper, gone from list and Supabase dashboard

---

## Step 8 — Filter + Polish
- [x] Filter by status (All / Unread / Reading / Done)
- [x] Star rating display
- [x] Empty state message
- [x] Commit: `feat: filter by status and star rating display`

**Verify:** Filter buttons update paper list correctly

---

## Step 9 — Deploy
- [x] Connect GitHub repo to Netlify
- [x] Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify env vars
- [x] Auto-deploy on push to main
- [x] Commit: `chore: netlify deployment config`

**Verify:** Live URL loads, auth works, CRUD works on production

---

## Step 10 — Documentation
- [x] README.md with overview, setup, usage, deployment
- [x] ERD diagram
- [x] .env.example committed
- [x] Commit: `docs: readme, erd, env example`
