-- INSTRUCTIONS:
-- 1. Sign Up on the website with:
--    Email: admin@dpnc.in
--    Password: priyanka
--
-- 2. Run this script in Supabase SQL Editor to grant Admin privileges.

update profiles
set role = 'admin'
where email = 'admin@dpnc.in';

-- Verify the update
select email, role from profiles where email = 'admin@dpnc.in';
