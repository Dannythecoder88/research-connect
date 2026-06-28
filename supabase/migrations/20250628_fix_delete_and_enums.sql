-- =============================================
-- FIX: Allow researchers to delete their own listings
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ieznkgihqhoxoowtqiro/sql
-- =============================================

-- 1. Add missing DELETE policy for research_listings
DROP POLICY IF EXISTS "Researchers can delete own listings" ON public.research_listings;
CREATE POLICY "Researchers can delete own listings" ON public.research_listings
  FOR DELETE USING (
    researcher_id IN (SELECT id FROM public.researcher_profiles WHERE user_id = auth.uid())
  );
