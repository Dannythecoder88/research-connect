-- =============================================
-- FIX: Profile completion triggers crash on INSERT because they
-- query the table for a row that doesn't exist yet (BEFORE INSERT).
-- This rewrites both trigger functions to compute completion
-- directly from the NEW record instead of re-querying the table.
-- Also re-applies handle_new_user() with EXCEPTION handling so
-- a trigger failure can never block signup again.
--
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ieznkgihqhoxoowtqiro/sql
-- =============================================

-- 1. Fix student profile completion trigger to use NEW directly
CREATE OR REPLACE FUNCTION sync_student_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion INTEGER := 0;
BEGIN
  IF NEW.high_school IS NOT NULL AND NEW.high_school != '' THEN completion := completion + 10; END IF;
  IF NEW.graduation_year IS NOT NULL THEN completion := completion + 10; END IF;
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN completion := completion + 5; END IF;
  IF NEW.location IS NOT NULL AND NEW.location != '' THEN completion := completion + 10; END IF;
  IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN completion := completion + 15; END IF;
  IF NEW.why_research IS NOT NULL AND NEW.why_research != '' THEN completion := completion + 15; END IF;
  IF NEW.resume_url IS NOT NULL AND NEW.resume_url != '' THEN completion := completion + 15; END IF;
  IF array_length(NEW.skills, 1) > 0 THEN completion := completion + 10; END IF;
  IF array_length(NEW.research_interests, 1) > 0 THEN completion := completion + 10; END IF;

  NEW.profile_completion := completion;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Fix researcher profile completion trigger to use NEW directly
CREATE OR REPLACE FUNCTION sync_researcher_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion INTEGER := 0;
BEGIN
  IF NEW.lab_name IS NOT NULL AND NEW.lab_name != '' THEN completion := completion + 20; END IF;
  IF NEW.affiliation IS NOT NULL AND NEW.affiliation != '' THEN completion := completion + 15; END IF;
  IF NEW.lead_researcher IS NOT NULL AND NEW.lead_researcher != '' THEN completion := completion + 10; END IF;
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN completion := completion + 10; END IF;
  IF NEW.website IS NOT NULL AND NEW.website != '' THEN completion := completion + 5; END IF;
  IF NEW.description IS NOT NULL AND NEW.description != '' THEN completion := completion + 20; END IF;
  IF NEW.location IS NOT NULL AND NEW.location != '' THEN completion := completion + 10; END IF;
  IF array_length(NEW.research_areas, 1) > 0 THEN completion := completion + 10; END IF;

  NEW.profile_completion := completion;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Re-attach the triggers (idempotent)
DROP TRIGGER IF EXISTS update_student_profile_completion ON public.student_profiles;
CREATE TRIGGER update_student_profile_completion
  BEFORE INSERT OR UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION sync_student_profile_completion();

DROP TRIGGER IF EXISTS update_researcher_profile_completion ON public.researcher_profiles;
CREATE TRIGGER update_researcher_profile_completion
  BEFORE INSERT OR UPDATE ON public.researcher_profiles
  FOR EACH ROW EXECUTE FUNCTION sync_researcher_profile_completion();

-- 4. Harden handle_new_user so a trigger error can never block signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val user_role;
  full_name_val TEXT;
  first_name_val TEXT;
  last_name_val TEXT;
BEGIN
  user_role_val := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student');

  first_name_val := NEW.raw_user_meta_data->>'first_name';
  last_name_val  := NEW.raw_user_meta_data->>'last_name';
  full_name_val  := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NULLIF(TRIM(CONCAT_WS(' ', first_name_val, last_name_val)), ''),
    NEW.email
  );

  -- Insert public.users row
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, full_name_val, user_role_val)
  ON CONFLICT (id) DO NOTHING;

  -- Insert role-specific profile
  IF user_role_val = 'student' THEN
    INSERT INTO public.student_profiles (
      user_id, high_school, graduation_year, location, phone
    ) VALUES (
      NEW.id,
      NULLIF(NEW.raw_user_meta_data->>'high_school', ''),
      NULLIF(NEW.raw_user_meta_data->>'grad_year', '')::INTEGER,
      NULLIF(NEW.raw_user_meta_data->>'location', ''),
      NULLIF(NEW.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  IF user_role_val = 'researcher' THEN
    INSERT INTO public.researcher_profiles (
      user_id, lab_name, affiliation, email, website, description, lead_researcher
    ) VALUES (
      NEW.id,
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'lab_name', ''), full_name_val),
      NULLIF(NEW.raw_user_meta_data->>'affiliation', ''),
      NEW.email,
      NULLIF(NEW.raw_user_meta_data->>'website', ''),
      NULLIF(NEW.raw_user_meta_data->>'description', ''),
      full_name_val
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- Log but never block auth signup
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Re-attach the auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
