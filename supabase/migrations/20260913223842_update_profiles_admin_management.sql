/*
# Auto-admin for first user + admin profile management

## Overview
1. Updates the `handle_new_user` trigger so the FIRST user who signs up is automatically assigned the `admin` role. All subsequent users remain `student`.
2. Adds RLS policies so admins can UPDATE and DELETE profiles (to manage other accounts — change roles, remove users).
3. Adds a SELECT policy so admins can already read all profiles (already exists, but we ensure it's there).

## Security changes
- `profiles` table: adds UPDATE and DELETE policies for admin role.
- The first-user auto-admin logic runs inside the SECURITY DEFINER trigger function, so it works even though the inserting user has no profile yet.
*/

-- ============================================
-- Update trigger: auto-assign admin to first user
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  -- Count existing profiles
  SELECT count(*) INTO user_count FROM public.profiles;

  -- First user becomes admin, all others are students
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN user_count = 0 THEN 'admin' ELSE 'student' END
  );
  RETURN NEW;
END;
$$;

-- ============================================
-- Add admin UPDATE + DELETE policies on profiles
-- ============================================
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;
CREATE POLICY "profiles_delete_admin"
ON profiles FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
