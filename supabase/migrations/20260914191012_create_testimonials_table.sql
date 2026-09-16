/*
# Create testimonials table and storage bucket

## What this does
Creates a testimonials feature where admins can write testimonials
(quotes from students, parents, or school partners) including the
person's name, role/organization, a photo, and the testimonial text.
These appear on the public homepage.

## New Tables
- `testimonials`
  - `id` (uuid, primary key)
  - `name` (text, not null) — the person's name
  - `role` (text) — e.g. "Parent", "Student", "Principal at XYZ School"
  - `quote` (text, not null) — the testimonial text
  - `photo_url` (text) — URL to the person's photo (stored in Supabase Storage)
  - `rating` (int, default 5) — star rating 1-5
  - `is_published` (boolean, default true) — admin can unpublish without deleting
  - `sort_order` (int, default 0) — controls display order
  - `created_at` (timestamptz)

## Storage
- Creates a public storage bucket `testimonials` for uploading photos.
- Policies: anyone can read photos; only authenticated users can upload/manage.

## Security
- RLS enabled on `testimonials`.
- SELECT: public (anon + authenticated) can read published testimonials.
- INSERT/UPDATE/DELETE: only admins (via is_admin() function).
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  quote text NOT NULL,
  photo_url text,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_select_public" ON testimonials;
CREATE POLICY "testimonials_select_public"
ON testimonials FOR SELECT
TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS "testimonials_insert_admin" ON testimonials;
CREATE POLICY "testimonials_insert_admin"
ON testimonials FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "testimonials_update_admin" ON testimonials;
CREATE POLICY "testimonials_update_admin"
ON testimonials FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "testimonials_delete_admin" ON testimonials;
CREATE POLICY "testimonials_delete_admin"
ON testimonials FOR DELETE
TO authenticated
USING (public.is_admin());

-- Storage bucket for testimonial photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "testimonials_bucket_read_public" ON storage.objects;
CREATE POLICY "testimonials_bucket_read_public"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'testimonials');

DROP POLICY IF EXISTS "testimonials_bucket_insert_admin" ON storage.objects;
CREATE POLICY "testimonials_bucket_insert_admin"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonials' AND public.is_admin());

DROP POLICY IF EXISTS "testimonials_bucket_update_admin" ON storage.objects;
CREATE POLICY "testimonials_bucket_update_admin"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'testimonials' AND public.is_admin())
WITH CHECK (bucket_id = 'testimonials' AND public.is_admin());

DROP POLICY IF EXISTS "testimonials_bucket_delete_admin" ON storage.objects;
CREATE POLICY "testimonials_bucket_delete_admin"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonials' AND public.is_admin());
