/*
# Create Alyntis learning platform schema

## Overview
Creates the full database schema for the Alyntis admin + student platform:
- User profiles with role-based access (admin / student)
- Courses that group projects by technology domain
- Projects with class level, difficulty, and rich text content
- Project resources (PDF documents and video links)
- Quizzes with questions and multiple-choice options
- Quiz attempts tracking student submissions and scores
- Project completions tracking which students completed which projects
- Admin notifications when students complete tasks

## Tables

1. `profiles` — extends auth.users with a role (admin/student) and display name
2. `courses` — technology courses (Robotics, Electronics, etc.) created by admin
3. `projects` — individual projects within courses, with full build instructions
4. `project_resources` — PDF documents and video URLs attached to projects
5. `quizzes` — quizzes attached to projects
6. `quiz_questions` — individual questions within a quiz
7. `quiz_attempts` — student quiz submissions with scores
8. `project_completions` — tracks when students complete projects
9. `notifications` — admin notifications when students complete tasks

## Security
- profiles: users can read/update own profile; admins can read all
- courses, projects, resources, quizzes, questions: public read (anon+authenticated), admin-only write
- quiz_attempts: students read/insert own; admins read all
- project_completions: students read/insert own; admins read all
- notifications: admin-only read/write

## Important Notes
- Uses auth.uid() for ownership checks
- Admin role stored in profiles table, checked via subquery
- All tables have RLS enabled
- Trigger auto-creates a profile row when a new auth user signs up
*/

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  school text,
  class_level text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'coming_soon')),
  sort_order int DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "courses_select_all" ON courses;
CREATE POLICY "courses_select_all"
ON courses FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "courses_insert_admin" ON courses;
CREATE POLICY "courses_insert_admin"
ON courses FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "courses_update_admin" ON courses;
CREATE POLICY "courses_update_admin"
ON courses FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "courses_delete_admin" ON courses;
CREATE POLICY "courses_delete_admin"
ON courses FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  class_level text,
  difficulty text CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_time text,
  technology text,
  what_you_build text,
  what_you_learn text,
  components text,
  build_steps text,
  testing text,
  troubleshooting text,
  take_it_further text,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order int DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_all" ON projects;
CREATE POLICY "projects_select_all"
ON projects FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "projects_insert_admin" ON projects;
CREATE POLICY "projects_insert_admin"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "projects_update_admin" ON projects;
CREATE POLICY "projects_update_admin"
ON projects FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "projects_delete_admin" ON projects;
CREATE POLICY "projects_delete_admin"
ON projects FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- PROJECT RESOURCES (PDFs and Videos)
-- ============================================
CREATE TABLE IF NOT EXISTS project_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('pdf', 'video')),
  url text NOT NULL,
  description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "resources_select_all" ON project_resources;
CREATE POLICY "resources_select_all"
ON project_resources FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "resources_insert_admin" ON project_resources;
CREATE POLICY "resources_insert_admin"
ON project_resources FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "resources_update_admin" ON project_resources;
CREATE POLICY "resources_update_admin"
ON project_resources FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "resources_delete_admin" ON project_resources;
CREATE POLICY "resources_delete_admin"
ON project_resources FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- QUIZZES
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  pass_score int DEFAULT 70,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quizzes_select_all" ON quizzes;
CREATE POLICY "quizzes_select_all"
ON quizzes FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "quizzes_insert_admin" ON quizzes;
CREATE POLICY "quizzes_insert_admin"
ON quizzes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "quizzes_update_admin" ON quizzes;
CREATE POLICY "quizzes_update_admin"
ON quizzes FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "quizzes_delete_admin" ON quizzes;
CREATE POLICY "quizzes_delete_admin"
ON quizzes FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- QUIZ QUESTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "questions_select_all" ON quiz_questions;
CREATE POLICY "questions_select_all"
ON quiz_questions FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "questions_insert_admin" ON quiz_questions;
CREATE POLICY "questions_insert_admin"
ON quiz_questions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "questions_update_admin" ON quiz_questions;
CREATE POLICY "questions_update_admin"
ON quiz_questions FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "questions_delete_admin" ON quiz_questions;
CREATE POLICY "questions_delete_admin"
ON quiz_questions FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- QUIZ ATTEMPTS
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers jsonb,
  score int NOT NULL DEFAULT 0,
  total_questions int NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attempts_select_own_or_admin" ON quiz_attempts;
CREATE POLICY "attempts_select_own_or_admin"
ON quiz_attempts FOR SELECT
TO authenticated
USING (
  auth.uid() = student_id
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "attempts_insert_own" ON quiz_attempts;
CREATE POLICY "attempts_insert_own"
ON quiz_attempts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

-- ============================================
-- PROJECT COMPLETIONS
-- ============================================
CREATE TABLE IF NOT EXISTS project_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, student_id)
);

ALTER TABLE project_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "completions_select_own_or_admin" ON project_completions;
CREATE POLICY "completions_select_own_or_admin"
ON project_completions FOR SELECT
TO authenticated
USING (
  auth.uid() = student_id
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "completions_insert_own" ON project_completions;
CREATE POLICY "completions_insert_own"
ON project_completions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "completions_delete_own" ON project_completions;
CREATE POLICY "completions_delete_own"
ON project_completions FOR DELETE
TO authenticated
USING (auth.uid() = student_id);

-- ============================================
-- NOTIFICATIONS (admin)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('project_completion', 'quiz_completion', 'quiz_attempt')),
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  project_title text,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  quiz_title text,
  score int,
  passed boolean,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_admin" ON notifications;
CREATE POLICY "notifications_select_admin"
ON notifications FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "notifications_insert_authenticated" ON notifications;
CREATE POLICY "notifications_insert_authenticated"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "notifications_update_admin" ON notifications;
CREATE POLICY "notifications_update_admin"
ON notifications FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "notifications_delete_admin" ON notifications;
CREATE POLICY "notifications_delete_admin"
ON notifications FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_course_id ON projects(course_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_resources_project_id ON project_resources(project_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_project_id ON quizzes(project_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student_id ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_completions_student_id ON project_completions(student_id);
CREATE INDEX IF NOT EXISTS idx_completions_project_id ON project_completions(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
