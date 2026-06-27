-- =============================================
-- MIGRATION: Fix profile save for existing and new accounts
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- =============================================

-- 1. Allow users to create their own public.users row from the client
-- (this is needed if the trigger failed to create it during signup)
DROP POLICY IF EXISTS "Users can insert own record" ON public.users;
CREATE POLICY "Users can insert own record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Backfill public.users for any auth accounts that are missing one
INSERT INTO public.users (id, email, full_name, role)
SELECT
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    NULLIF(TRIM(CONCAT_WS(' ', au.raw_user_meta_data->>'first_name', au.raw_user_meta_data->>'last_name')), ''),
    au.email
  ) AS full_name,
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'student') AS role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Backfill missing student profiles for existing student accounts
INSERT INTO public.student_profiles (user_id, high_school, graduation_year, location, phone)
SELECT
  pu.id,
  NULLIF(au.raw_user_meta_data->>'high_school', ''),
  NULLIF(au.raw_user_meta_data->>'grad_year', '')::INTEGER,
  NULLIF(au.raw_user_meta_data->>'location', ''),
  NULLIF(au.raw_user_meta_data->>'phone', '')
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
LEFT JOIN public.student_profiles sp ON sp.user_id = pu.id
WHERE pu.role = 'student'
  AND sp.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 4. Backfill missing researcher profiles for existing researcher accounts
INSERT INTO public.researcher_profiles (user_id, lab_name, affiliation, email, website, description, lead_researcher)
SELECT
  pu.id,
  COALESCE(NULLIF(au.raw_user_meta_data->>'lab_name', ''), pu.full_name),
  NULLIF(au.raw_user_meta_data->>'affiliation', ''),
  pu.email,
  NULLIF(au.raw_user_meta_data->>'website', ''),
  NULLIF(au.raw_user_meta_data->>'description', ''),
  pu.full_name
FROM public.users pu
JOIN auth.users au ON pu.id = au.id
LEFT JOIN public.researcher_profiles rp ON rp.user_id = pu.id
WHERE pu.role = 'researcher'
  AND rp.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 5. Ensure profile_completion columns exist on both profile tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_profiles' AND column_name = 'profile_completion'
  ) THEN
    ALTER TABLE public.student_profiles ADD COLUMN profile_completion INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'researcher_profiles' AND column_name = 'profile_completion'
  ) THEN
    ALTER TABLE public.researcher_profiles ADD COLUMN profile_completion INTEGER DEFAULT 0;
  END IF;
END $$;

-- 6. Ensure student profile completion calculation function and trigger exist
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion INTEGER := 0;
  profile RECORD;
BEGIN
  SELECT * INTO profile FROM public.student_profiles WHERE id = profile_id;

  IF profile.high_school IS NOT NULL AND profile.high_school != '' THEN completion := completion + 10; END IF;
  IF profile.graduation_year IS NOT NULL THEN completion := completion + 10; END IF;
  IF profile.phone IS NOT NULL AND profile.phone != '' THEN completion := completion + 5; END IF;
  IF profile.location IS NOT NULL AND profile.location != '' THEN completion := completion + 10; END IF;
  IF profile.bio IS NOT NULL AND profile.bio != '' THEN completion := completion + 15; END IF;
  IF profile.why_research IS NOT NULL AND profile.why_research != '' THEN completion := completion + 15; END IF;
  IF profile.resume_url IS NOT NULL AND profile.resume_url != '' THEN completion := completion + 15; END IF;
  IF array_length(profile.skills, 1) > 0 THEN completion := completion + 10; END IF;
  IF array_length(profile.research_interests, 1) > 0 THEN completion := completion + 10; END IF;

  RETURN completion;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sync_student_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion := calculate_profile_completion(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_student_profile_completion ON public.student_profiles;
CREATE TRIGGER update_student_profile_completion
  BEFORE INSERT OR UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION sync_student_profile_completion();

-- 7. Ensure researcher profile completion calculation function and trigger exist
CREATE OR REPLACE FUNCTION calculate_researcher_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion INTEGER := 0;
  profile RECORD;
BEGIN
  SELECT * INTO profile FROM public.researcher_profiles WHERE id = profile_id;

  IF profile.lab_name IS NOT NULL AND profile.lab_name != '' THEN completion := completion + 20; END IF;
  IF profile.affiliation IS NOT NULL AND profile.affiliation != '' THEN completion := completion + 15; END IF;
  IF profile.lead_researcher IS NOT NULL AND profile.lead_researcher != '' THEN completion := completion + 10; END IF;
  IF profile.email IS NOT NULL AND profile.email != '' THEN completion := completion + 10; END IF;
  IF profile.website IS NOT NULL AND profile.website != '' THEN completion := completion + 5; END IF;
  IF profile.description IS NOT NULL AND profile.description != '' THEN completion := completion + 20; END IF;
  IF profile.location IS NOT NULL AND profile.location != '' THEN completion := completion + 10; END IF;
  IF array_length(profile.research_areas, 1) > 0 THEN completion := completion + 10; END IF;

  RETURN completion;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sync_researcher_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion := calculate_researcher_profile_completion(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_researcher_profile_completion ON public.researcher_profiles;
CREATE TRIGGER update_researcher_profile_completion
  BEFORE INSERT OR UPDATE ON public.researcher_profiles
  FOR EACH ROW EXECUTE FUNCTION sync_researcher_profile_completion();

-- 8. Recalculate completion for any existing profiles
UPDATE public.student_profiles
SET profile_completion = calculate_profile_completion(id)
WHERE profile_completion IS NULL OR profile_completion = 0;

UPDATE public.researcher_profiles
SET profile_completion = calculate_researcher_profile_completion(id)
WHERE profile_completion IS NULL OR profile_completion = 0;

-- 9. Make the trigger idempotent so it never fails on duplicate rows
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
  last_name_val := NEW.raw_user_meta_data->>'last_name';
  full_name_val := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NULLIF(TRIM(CONCAT_WS(' ', first_name_val, last_name_val)), ''),
    NEW.email
  );

  INSERT INTO public.users (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, full_name_val, user_role_val)
  ON CONFLICT (id) DO NOTHING;

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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
