/*
# Fix admin role management with SECURITY DEFINER function

## Problem
The profiles UPDATE/DELETE admin policies use a subquery:
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
But RLS is enforced on that subquery too, creating a circular dependency.
When an admin tries to update another user's role, the subquery may fail
because the admin can only see their own row via the SELECT policy.

## Solution
1. Create a SECURITY DEFINER function `is_admin()` that checks if the
   current user has role = 'admin'. This bypasses RLS so the admin check
   always works correctly.
2. Update the profiles UPDATE and DELETE policies to use `public.is_admin()`
   instead of a subquery on profiles.
3. Create a SECURITY DEFINER function `admin_update_user_role()` so role
   changes go through a server-side function that validates the caller is
   an admin — the frontend calls this RPC instead of direct table updates.
4. Create a SECURITY DEFINER function `admin_delete_user()` that deletes
   both the profile row and the auth.users entry (cascade).

## Security
- `is_admin()` is SECURITY DEFINER, returns boolean. No params, safe.
- `admin_update_user_role()` is SECURITY DEFINER, takes target user_id + new role.
  Validates caller is admin. Prevents self-demotion (can't change own role).
- `admin_delete_user()` is SECURITY DEFINER, takes target user_id.
  Validates caller is admin. Prevents self-deletion. Deletes from auth.users
  which cascades to profiles.
- Revoke execute from anon, grant only to authenticated.
*/

-- ============================================
-- is_admin() helper function
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================
-- admin_update_user_role() — admin changes another user's role
-- ============================================
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id uuid,
  new_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate caller is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: admin access required';
  END IF;

  -- Prevent self-modification
  IF auth.uid() = target_user_id THEN
    RAISE EXCEPTION 'You cannot change your own role';
  END IF;

  -- Validate role value
  IF new_role NOT IN ('admin', 'student') THEN
    RAISE EXCEPTION 'Invalid role: must be admin or student';
  END IF;

  -- Update the profile
  UPDATE profiles SET role = new_role WHERE id = target_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_update_user_role(target_user_id uuid, new_role text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(target_user_id uuid, new_role text) TO authenticated;

-- ============================================
-- admin_delete_user() — admin removes a user account
-- ============================================
CREATE OR REPLACE FUNCTION public.admin_delete_user(
  target_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate caller is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permission denied: admin access required';
  END IF;

  -- Prevent self-deletion
  IF auth.uid() = target_user_id THEN
    RAISE EXCEPTION 'You cannot delete your own account';
  END IF;

  -- Delete from auth.users (cascades to profiles via FK)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_delete_user(target_user_id uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(target_user_id uuid) TO authenticated;

-- ============================================
-- Update profiles policies to use is_admin()
-- ============================================
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin"
ON profiles FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;
CREATE POLICY "profiles_delete_admin"
ON profiles FOR DELETE
TO authenticated
USING (public.is_admin());
