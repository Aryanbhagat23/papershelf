-- PaperShelf — Supabase SQL Setup
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Create papers table
CREATE TABLE papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  authors TEXT,
  year INTEGER,
  doi TEXT,
  tags TEXT,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'reading', 'done')),
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own papers

-- SELECT: users can read their own papers
CREATE POLICY "Users can view own papers"
  ON papers FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: users can add papers (user_id must match their own)
CREATE POLICY "Users can insert own papers"
  ON papers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: users can update their own papers
CREATE POLICY "Users can update own papers"
  ON papers FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: users can delete their own papers
CREATE POLICY "Users can delete own papers"
  ON papers FOR DELETE
  USING (auth.uid() = user_id);
