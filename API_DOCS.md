# PaperShelf — API Documentation & Test Cases

All data operations use the **Supabase REST API** (PostgREST).
Base URL: `https://ccqgjkhdeqpazyleuywy.supabase.co/rest/v1`

## Authentication
All requests require these headers:
```
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <USER_JWT_TOKEN>
Content-Type: application/json
```
The anon key is safe to use client-side. Row Level Security (RLS) enforces that users can only access their own data regardless of the key used.

---

## Endpoints

### 1. GET /papers — Read all papers
Returns all papers belonging to the authenticated user.

**Request:**
```
GET /rest/v1/papers?select=*
Headers: apikey, Authorization, Content-Type
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Paper title",
    "authors": "Author names",
    "year": 2024,
    "doi": "https://...",
    "tags": "tag1, tag2",
    "status": "unread|reading|done",
    "notes": "Personal notes",
    "rating": 5,
    "created_at": "2026-06-22T..."
  }
]
```

**Response (anon, no user JWT — 200 OK but empty):**
```json
[]
```
RLS returns empty array for unauthenticated requests — data is invisible, not errored.

---

### 2. POST /papers — Create a paper
Creates a new paper for the authenticated user.

**Request:**
```
POST /rest/v1/papers
Headers: apikey, Authorization, Content-Type
Body:
{
  "title": "Paper Title",
  "authors": "Author Name",
  "year": 2024,
  "doi": "https://arxiv.org/abs/...",
  "tags": "deep learning, CV",
  "status": "unread",
  "notes": "My notes",
  "rating": 4,
  "user_id": "<authenticated-user-uuid>"
}
```

**Response (201 Created):** Returns created paper object

**Response (401 — no valid user JWT):**
```json
{
  "code": "42501",
  "message": "new row violates row-level security policy for table \"papers\""
}
```

---

### 3. PATCH /papers — Update a paper
Updates fields on an existing paper.

**Request:**
```
PATCH /rest/v1/papers?id=eq.<paper-uuid>
Headers: apikey, Authorization, Content-Type
Body:
{
  "status": "done",
  "notes": "Updated notes",
  "rating": 5
}
```

**Response (200 OK):** Returns updated paper object

**Response (unauthorized — trying to update another user's paper):**
```json
[]
```
RLS silently returns empty — cannot update rows you don't own.

---

### 4. DELETE /papers — Delete a paper
Deletes a paper by ID.

**Request:**
```
DELETE /rest/v1/papers?id=eq.<paper-uuid>
Headers: apikey, Authorization, Content-Type
```

**Response (200 OK):** Empty array `[]` — deletion successful

**Response (unauthorized):** Empty array — RLS prevents deletion of other users' papers

---

## AI API Endpoints (Client-side via Anthropic SDK)

### Feature 1: Paper Summarizer
- **Trigger:** User clicks "✨ AI Summary" on a paper card
- **Model:** claude-sonnet-4-6
- **Input:** Paper title, authors, year, tags, notes (~300 tokens)
- **Output:** JSON with summary, keyTopics[], importance (~200 tokens)
- **Cost per call:** ~$0.004
- **Error handling:** Shows error message if API fails, button re-enabled for retry

### Feature 2: Research Gap Finder
- **Trigger:** User clicks "🔍 Gap Finder" button in header
- **Model:** claude-sonnet-4-6
- **Input:** All papers in user's shelf (~800 tokens for 10 papers)
- **Output:** JSON with coveredThemes[], gaps[], recommendations[], assessment (~600 tokens)
- **Cost per call:** ~$0.011
- **Error handling:** Shows error if no papers exist, shows error message if API fails

---

## Test Cases

### Test 1 — GET papers (anonymous) ✅
- **Tool:** Thunder Client
- **Method:** GET
- **URL:** `/rest/v1/papers?select=*`
- **Auth:** Anon key only (no user JWT)
- **Expected:** `200 OK`, response body `[]`
- **Result:** ✅ PASSED — RLS correctly hides all data from unauthenticated requests

### Test 2 — POST paper (unauthorized) ✅
- **Tool:** Thunder Client
- **Method:** POST
- **URL:** `/rest/v1/papers`
- **Auth:** Anon key only (no user JWT)
- **Body:** `{"title": "Test Paper", "status": "unread"}`
- **Expected:** `401` or RLS violation error
- **Result:** ✅ PASSED — `401 Unauthorized`, RLS policy violation returned

### Test 3 — Auth protection (frontend)
- **Method:** Navigate to `papershelf.netlify.app` without logging in
- **Expected:** Redirected to `/login` page
- **Result:** ✅ PASSED — PrivateRoute component redirects unauthenticated users

### Test 4 — Create paper (authenticated)
- **Method:** Login → click Add Paper → fill form → submit
- **Expected:** Paper appears in list immediately
- **Result:** ✅ PASSED — Paper inserted via Supabase client with user JWT

### Test 5 — AI Summary (authenticated)
- **Method:** Hover paper → click ✨ AI Summary → click Generate
- **Expected:** Loading spinner → structured summary appears
- **Result:** ✅ PASSED — Claude API returns valid JSON response

### Test 6 — Research Gap Finder (authenticated)
- **Method:** Click 🔍 Gap Finder → click Analyze
- **Expected:** Loading spinner → full analysis with themes, gaps, recommendations
- **Result:** ✅ PASSED — Claude API analyzes all papers and returns structured analysis

### Test 7 — Delete paper (authenticated)
- **Method:** Hover paper → click Delete → confirm
- **Expected:** Paper removed from list
- **Result:** ✅ PASSED — Paper deleted from Supabase, UI updates immediately

### Test 8 — Filter by status
- **Method:** Click Unread / Reading / Done filter tabs
- **Expected:** Only papers with matching status shown, counts update
- **Result:** ✅ PASSED — Client-side filtering works correctly