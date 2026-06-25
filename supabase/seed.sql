-- ===========================================
-- Research Connect - Seed Data
-- ===========================================
-- Run this after schema.sql to populate demo data
-- Note: In production, users would be created through auth.users
-- This seed data is for development/demo purposes

-- ===========================================
-- RESOURCES
-- ===========================================

INSERT INTO public.resources (title, content, icon, category, sort_order) VALUES
(
  'Cold Email Templates',
  'Writing a cold email to a professor can feel intimidating, but a well-crafted message can open doors.',
  'Mail',
  'getting-started',
  1
),
(
  'Interview Preparation',
  'If a researcher invites you for an interview, congratulations! Here is how to prepare.',
  'MessageSquare',
  'getting-started',
  2
),
(
  'Research Etiquette',
  'Working in a research environment has its own culture. Here are the unwritten rules.',
  'BookOpen',
  'professional-development',
  3
),
(
  'Professional Communication',
  'Communicating professionally is a skill that will serve you throughout your career.',
  'PenTool',
  'professional-development',
  4
),
(
  'Finding Your Research Interests',
  'Not sure what you want to research? Here is how to explore.',
  'Compass',
  'exploration',
  5
),
(
  'What to Expect in a Research Lab',
  'Starting in a research lab can feel overwhelming. Here is what to realistically expect.',
  'Building',
  'getting-started',
  6
);

-- ===========================================
-- FAQs
-- ===========================================

INSERT INTO public.faqs (question, answer, sort_order) VALUES
(
  'Who can use Research Connect?',
  'Research Connect is designed for high school students looking for research opportunities, and for professors, labs, startups, and organizations who want to mentor and work with motivated young researchers.',
  1
),
(
  'Is there a cost to use the platform?',
  'Research Connect is completely free for both students and researchers. Our mission is to democratize access to research opportunities for high school students.',
  2
),
(
  'How do I apply for a research position?',
  'Create a student profile, browse available opportunities, and use the Easy Apply button to submit your profile along with a brief cover message explaining your interest.',
  3
),
(
  'What if I have no prior research experience?',
  'That is perfectly fine! Many positions are designed for beginners. Focus on highlighting your academic interests, relevant coursework, and eagerness to learn in your profile.',
  4
),
(
  'How are labs and researchers verified?',
  'All researcher and lab accounts go through an admin verification process before they can post positions. This ensures the safety and legitimacy of every opportunity on the platform.',
  5
),
(
  'Can I apply to multiple positions?',
  'Absolutely! You can apply to as many positions as you would like. Use the Save feature to bookmark positions you are interested in and apply when you are ready.',
  6
);

-- ===========================================
-- NOTE: User-related seed data
-- ===========================================
-- To create test users, use the Supabase Dashboard or the auth API:
--
-- 1. Create a student user via Supabase Auth
-- 2. Their profile will auto-populate in public.users via the trigger
-- 3. Then manually insert student_profile data:
--
-- INSERT INTO public.student_profiles (user_id, high_school, graduation_year, location, bio, why_research, skills, research_interests, profile_completion)
-- VALUES (
--   'USER_UUID_HERE',
--   'Guilderland High School',
--   2027,
--   'Guilderland, NY',
--   'I am a junior passionate about AI and computational biology.',
--   'I want to contribute to solving real-world problems through scientific inquiry.',
--   ARRAY['Python', 'Data Analysis', 'Research Writing', 'Communication'],
--   ARRAY['cs_ai', 'biology']::research_category[],
--   72
-- );
--
-- For researcher profiles:
-- INSERT INTO public.researcher_profiles (user_id, lab_name, affiliation, lead_researcher, email, website, description, research_areas, location, verification_status)
-- VALUES (
--   'USER_UUID_HERE',
--   'RPI Artificial Intelligence Lab',
--   'Rensselaer Polytechnic Institute',
--   'Dr. Jane Smith',
--   'jsmith@rpi.edu',
--   'https://ai.rpi.edu',
--   'Our lab focuses on NLP, ML, and AI safety research.',
--   ARRAY['cs_ai', 'physics']::research_category[],
--   'Troy, NY',
--   'verified'
-- );
