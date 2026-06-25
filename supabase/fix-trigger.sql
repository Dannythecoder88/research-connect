-- =============================================
-- FIX: Replace the broken handle_new_user trigger
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ieznkgihqhoxoowtqiro/sql
-- =============================================

-- Drop the existing broken trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the function with safer logic
-- Handles both: { full_name: "..." } and { first_name: "...", last_name: "..." }
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _full_name TEXT;
  _role TEXT;
BEGIN
  -- Build full_name from metadata (handles both naming conventions)
  _full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NULLIF(
      TRIM(
        COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' ||
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      ),
      ''
    ),
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Safely get role, defaulting to 'student' if missing or invalid
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  IF _role NOT IN ('student', 'researcher', 'admin') THEN
    _role := 'student';
  END IF;

  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    _full_name,
    _role::user_role
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log but don't block user creation
    RAISE WARNING 'handle_new_user failed: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
