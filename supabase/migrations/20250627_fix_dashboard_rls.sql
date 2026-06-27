-- Migration: Fix student dashboard and messaging RLS
-- Created: 2025-06-27

-- SECURITY DEFINER helper: listing IDs the current student has applied to
CREATE OR REPLACE FUNCTION get_student_applied_listing_ids()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT a.listing_id FROM public.applications a
  WHERE a.student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SECURITY DEFINER helper: researcher IDs the current student has applied to
CREATE OR REPLACE FUNCTION get_student_applied_researcher_ids()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT rl.researcher_id FROM public.research_listings rl
  JOIN public.applications a ON rl.id = a.listing_id
  WHERE a.student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow students to see listings they applied to, even if the position is closed
DROP POLICY IF EXISTS "Students can see listings they applied to" ON public.research_listings;
CREATE POLICY "Students can see listings they applied to" ON public.research_listings
  FOR SELECT USING (
    id IN (SELECT get_student_applied_listing_ids())
  );

-- Allow students to see researcher profiles for listings they applied to
DROP POLICY IF EXISTS "Students can see researcher profiles of applied listings" ON public.researcher_profiles;
CREATE POLICY "Students can see researcher profiles of applied listings" ON public.researcher_profiles
  FOR SELECT USING (
    id IN (SELECT get_student_applied_researcher_ids())
  );
