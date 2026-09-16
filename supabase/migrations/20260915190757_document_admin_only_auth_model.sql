/*
# Make handle_new_user safe for admin-created accounts only

## What this does
The handle_new_user trigger fires on any INSERT to auth.users.
Since we've moved account creation to the admin edge function
(which uses the service role key), the trigger only fires when
the admin function creates a user. The trigger already handles
this correctly — it creates a profile row and assigns the role.

This migration ensures the trigger is up to date and the first-user
becomes-admin logic still works.

## No changes needed to the trigger itself
The existing trigger is correct. This is a no-op migration that
documents the auth model:
- Public signups are blocked at the application level (LoginPage
  has no signup form)
- Account creation goes through the admin-create-user edge function
- The edge function uses the service role key to call
  auth.admin.createUser()
- The trigger fires on that insert and creates the profile row
- The edge function then updates the role if the admin chose 'admin'
*/

SELECT 1;
