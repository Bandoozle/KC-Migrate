-- Resend message id of the visitor auto-response, alongside notification_id.
-- Run before deploying code that sets FORMS_EMAIL=test or live.

alter table public.contact_submissions add column if not exists autoresponse_id text;
alter table public.newsletter_signups add column if not exists autoresponse_id text;
