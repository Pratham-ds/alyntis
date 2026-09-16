/*
# Create inquiry and school demo request tables

1. New Tables
- `inquiries` — general contact form submissions from the Contact page
  - id (uuid, PK)
  - name (text, not null)
  - email (text, not null)
  - phone (text)
  - organization (text)
  - designation (text)
  - city (text)
  - interest (text) — School Partnership / Alyntis Platform / Student Programs / Technology Partnership / Other
  - message (text)
  - created_at (timestamptz)
- `school_demo_requests` — school demo request form submissions from the Request Demo page
  - id (uuid, PK)
  - school_name (text, not null)
  - city (text)
  - board (text)
  - contact_person (text, not null)
  - designation (text)
  - phone (text)
  - email (text, not null)
  - num_students (text)
  - classes (text)
  - interested_programs (text)
  - preferred_date (text)
  - message (text)
  - created_at (timestamptz)

2. Security
- Enable RLS on both tables.
- Both tables allow anon + authenticated INSERT only (public forms).
- No SELECT/UPDATE/DELETE for anon — only INSERT (form submissions are write-only from the frontend).
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization text,
  designation text,
  city text,
  interest text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries"
ON inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE TABLE IF NOT EXISTS school_demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  city text,
  board text,
  contact_person text NOT NULL,
  designation text,
  phone text,
  email text NOT NULL,
  num_students text,
  classes text,
  interested_programs text,
  preferred_date text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE school_demo_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_demo_requests" ON school_demo_requests;
CREATE POLICY "anon_insert_demo_requests"
ON school_demo_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);
