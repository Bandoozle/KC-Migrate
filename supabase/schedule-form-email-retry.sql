-- Run once in the Supabase SQL editor, after the migration and after the site is
-- deployed with SUPABASE_URL, SUPABASE_SECRET_KEY and CRON_SECRET set.
--
-- Every 10 minutes it calls the site's retry endpoint, which re-sends notifications
-- that failed (FORMS_EMAIL=test/live) and re-relays submissions WordPress did not
-- accept (while FORMS_WORDPRESS_RELAY is on): up to 5 attempts each, then an alert.
-- Use this instead of a Vercel cron job if the Vercel plan only allows daily crons.
--
-- Replace <CRON_SECRET> with the same value as the Vercel environment variable.

create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'retry-form-email',
  '*/10 * * * *',
  $$
  select net.http_get(
    url := 'https://www.kosick.com/api/forms/retry/',
    headers := jsonb_build_object('Authorization', 'Bearer <CRON_SECRET>')
  );
  $$
);
