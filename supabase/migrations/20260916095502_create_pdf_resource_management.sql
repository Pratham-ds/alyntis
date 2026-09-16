/*
# PDF Resource Management — extend project_resources + create course_resources

## What this does
1. Extends the existing `project_resources` table with new columns for
   file-based PDF resources (category, file_path, file_name, file_size,
   mime_type, created_by, updated_at). The existing `url` column remains
   for backward compatibility with existing external-URL resources.
2. Creates a new `course_resources` table with the same structure for
   course-level PDF resources.
3. Creates a private Supabase Storage bucket `alyntis-resources` for PDFs.
4. Sets up RLS policies:
   - Students (authenticated) can SELECT resources.
   - Only admins can INSERT/UPDATE/DELETE resources.
   - Storage: only authenticated users can read; only admins can upload/manage.

## New Columns on project_resources (all nullable, preserves existing rows)
- category text — Manual, Reference, Datasheet, Circuit Diagram, Worksheet,
  Safety Guide, Tutorial, Other
- file_path text — path in the alyntis-resources bucket
- file_name text — original uploaded filename
- file_size bigint — file size in bytes
- mime_type text — always application/pdf for uploads
- created_by uuid — admin who uploaded
- updated_at timestamptz

## New Table: course_resources
- id uuid PK
- course_id uuid NOT NULL FK to courses
- title text NOT NULL
- description text
- category text
- file_path text
- file_name text
- file_size bigint
- mime_type text
- url text — for external links (optional)
- resource_type text NOT NULL DEFAULT 'pdf' — 'pdf' | 'link'
- sort_order int DEFAULT 0
- created_by uuid
- created_at timestamptz DEFAULT now()
- updated_at timestamptz DEFAULT now()

## Storage
- Private bucket `alyntis-resources`
- Paths: resources/courses/{course_id}/{uuid}.pdf, resources/projects/{project_id}/{uuid}.pdf

## Security
- RLS enabled on course_resources
- RLS already enabled on project_resources
- Storage policies: authenticated read, admin-only write
*/

-- Extend project_resources with new columns
ALTER TABLE project_resources ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE project_resources ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE project_resources ADD COLUMN IF NOT EXISTS file_name text;
ALTER TABLE project_resources ADD COLUMN IF NOT EXISTS file_size bigint;
ALTER TABLE project_resources ADD COLUMN IF NOT EXISTS mime_type text;
ALTER TABLE project_resources ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE project_resources ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create course_resources table
CREATE TABLE IF NOT EXISTS course_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  file_path text,
  file_name text,
  file_size bigint,
  mime_type text,
  url text,
  resource_type text NOT NULL DEFAULT 'pdf',
  sort_order int NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;

-- RLS: course_resources — students can read, admin can write
DROP POLICY IF EXISTS "course_resources_select_authenticated" ON course_resources;
CREATE POLICY "course_resources_select_authenticated"
ON course_resources FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "course_resources_insert_admin" ON course_resources;
CREATE POLICY "course_resources_insert_admin"
ON course_resources FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "course_resources_update_admin" ON course_resources;
CREATE POLICY "course_resources_update_admin"
ON course_resources FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "course_resources_delete_admin" ON course_resources;
CREATE POLICY "course_resources_delete_admin"
ON course_resources FOR DELETE
TO authenticated
USING (public.is_admin());

-- RLS: project_resources — add admin-only write policies
-- (SELECT already exists for authenticated; we add INSERT/UPDATE/DELETE)
DROP POLICY IF EXISTS "project_resources_insert_admin" ON project_resources;
CREATE POLICY "project_resources_insert_admin"
ON project_resources FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "project_resources_update_admin" ON project_resources;
CREATE POLICY "project_resources_update_admin"
ON project_resources FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Ensure SELECT exists for authenticated users
DROP POLICY IF EXISTS "project_resources_select_authenticated" ON project_resources;
CREATE POLICY "project_resources_select_authenticated"
ON project_resources FOR SELECT
TO authenticated
USING (true);

-- Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('alyntis-resources', 'alyntis-resources', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: authenticated can read, admin can write
DROP POLICY IF EXISTS "resources_bucket_read_authenticated" ON storage.objects;
CREATE POLICY "resources_bucket_read_authenticated"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'alyntis-resources');

DROP POLICY IF EXISTS "resources_bucket_insert_admin" ON storage.objects;
CREATE POLICY "resources_bucket_insert_admin"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'alyntis-resources' AND public.is_admin());

DROP POLICY IF EXISTS "resources_bucket_update_admin" ON storage.objects;
CREATE POLICY "resources_bucket_update_admin"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'alyntis-resources' AND public.is_admin())
WITH CHECK (bucket_id = 'alyntis-resources' AND public.is_admin());

DROP POLICY IF EXISTS "resources_bucket_delete_admin" ON storage.objects;
CREATE POLICY "resources_bucket_delete_admin"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'alyntis-resources' AND public.is_admin());

-- Index for sorting
CREATE INDEX IF NOT EXISTS idx_course_resources_course ON course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_project_resources_project ON project_resources(project_id);
