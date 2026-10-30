-- Contact and newsletter submissions, replacing Kadence "Database Entry" for forms 11283 and 11281.
-- Only the site's server writes here, with the secret key: RLS is on with no policies,
-- and the anon/authenticated roles have no table privileges.

create table public.contact_submissions (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  idempotency_key        uuid not null unique,          -- one per form render; a resubmit returns the first result
  name                   text not null check (char_length(name) <= 200),
  email                  text not null check (char_length(email) <= 254),
  email_normalized       text generated always as (lower(email)) stored,
  phone                  text not null check (char_length(phone) <= 40),
  company                text check (char_length(company) <= 200),
  message                text check (char_length(message) <= 5000),
  source_path            text check (char_length(source_path) <= 300),
  ip_hash                text,                           -- HMAC of the client IP; cleared after 90 days
  wordpress_relay_status text not null default 'off'
                         check (wordpress_relay_status in ('off', 'pending', 'sent', 'failed', 'skipped')),
  wordpress_relay_attempts int not null default 0,  -- temporary: the WordPress relay is removed after Phase 3b
  notification_status    text not null default 'pending'
                         check (notification_status in ('pending', 'sent', 'failed', 'skipped')),
  notification_attempts  int  not null default 0,
  notification_id        text,                           -- Resend message id
  autoresponse_status    text not null default 'pending'
                         check (autoresponse_status in ('pending', 'sent', 'failed', 'skipped')),
  last_error             text
);

create table public.newsletter_signups (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  idempotency_key        uuid not null unique,
  email                  text not null check (char_length(email) <= 254),
  email_normalized       text generated always as (lower(email)) stored,
  source_path            text check (char_length(source_path) <= 300),
  consent_text           text,                           -- wording shown at signup, once the site shows one (CASL evidence)
  ip_hash                text,
  wordpress_relay_status text not null default 'off'
                         check (wordpress_relay_status in ('off', 'pending', 'sent', 'failed', 'skipped')),
  wordpress_relay_attempts int not null default 0,  -- temporary: the WordPress relay is removed after Phase 3b
  notification_status    text not null default 'pending'
                         check (notification_status in ('pending', 'sent', 'failed', 'skipped')),
  notification_attempts  int  not null default 0,
  notification_id        text,
  autoresponse_status    text not null default 'pending'
                         check (autoresponse_status in ('pending', 'sent', 'failed', 'skipped')),
  last_error             text
);

create index contact_submissions_created_at_idx on public.contact_submissions (created_at);
create index contact_submissions_ip_idx on public.contact_submissions (ip_hash, created_at);
create index contact_submissions_email_idx on public.contact_submissions (email_normalized, created_at);
create index contact_submissions_retry_idx on public.contact_submissions (notification_status, created_at);
create index newsletter_signups_created_at_idx on public.newsletter_signups (created_at);
create index newsletter_signups_ip_idx on public.newsletter_signups (ip_hash, created_at);
create index newsletter_signups_email_idx on public.newsletter_signups (email_normalized, created_at);
create index newsletter_signups_retry_idx on public.newsletter_signups (notification_status, created_at);

alter table public.contact_submissions enable row level security;
alter table public.newsletter_signups enable row level security;
revoke all on table public.contact_submissions from anon, authenticated;
revoke all on table public.newsletter_signups from anon, authenticated;

-- Retention: IP hashes after 90 days, contact submissions after 24 months.
-- Newsletter signups stay until unsubscribe or a provider migration.
create or replace function public.purge_form_data()
returns void
language sql
security definer
set search_path = public
as $$
  update public.contact_submissions set ip_hash = null
    where ip_hash is not null and created_at < now() - interval '90 days';
  update public.newsletter_signups set ip_hash = null
    where ip_hash is not null and created_at < now() - interval '90 days';
  delete from public.contact_submissions
    where created_at < now() - interval '24 months';
$$;

revoke all on function public.purge_form_data() from public, anon, authenticated;

-- Supabase installs pg_cron in pg_catalog (Database → Extensions shows it as enabled)
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('purge-form-data', '17 3 * * *', 'select public.purge_form_data()');
