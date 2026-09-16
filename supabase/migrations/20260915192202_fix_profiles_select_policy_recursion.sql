/*
# Fix profiles SELECT policy — remove recursive subquery

## Problem
The profiles_select_own_or_admin policy uses an EXISTS subquery
that directly queries the profiles table. Since RLS is enabled on
profiles, this subquery itself triggers RLS evaluation, creating
infinite recursion. This causes the profile query to fail after
sign-in, so the user gets stuck on "Please wait..." and never
redirects to the dashboard.

## Fix
Replace the recursive EXISTS subquery with a call to is_admin(),
which is a SECURITY DEFINER function that bypasses RLS. This
breaks the recursion while keeping the same access control logic:
users can read their own profile, and admins can read all profiles.

## Security changes
- profiles_select_own_or_admin policy rewritten to use is_admin()
  instead of a direct subquery on profiles.
*/

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;

CREATE POLICY "profiles_select_own_or_admin"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());
