-- Run once in an ACTIVE Supabase project's SQL editor. No public/client access.
begin;
create table if not exists public.rmg_inquiries (
  id uuid primary key,
  payload_hash text not null,
  name text not null check (length(name) <= 120),
  email text not null check (length(email) <= 254),
  message text not null check (length(message) <= 4000),
  preview jsonb,
  email_preview boolean not null default false,
  preview_emailed boolean not null default false,
  created_at timestamptz not null default now(),
  notified_at timestamptz,
  notification_attempts integer not null default 0,
  next_notification_attempt_at timestamptz default now()
);
alter table public.rmg_inquiries add column if not exists notification_attempts integer not null default 0;
alter table public.rmg_inquiries add column if not exists next_notification_attempt_at timestamptz default now();
create index if not exists rmg_inquiries_notifications_due on public.rmg_inquiries(next_notification_attempt_at)
where notification_attempts < 5;
create table if not exists public.rmg_rate_limits (
  rate_key text not null,
  bucket timestamptz not null default date_trunc('hour', now()),
  count integer not null default 1,
  primary key (rate_key, bucket)
);
create table if not exists public.rmg_event_counts (
  day date not null default current_date,
  event text not null,
  count bigint not null default 1,
  primary key(day, event)
);
alter table public.rmg_inquiries enable row level security;
alter table public.rmg_rate_limits enable row level security;
alter table public.rmg_event_counts enable row level security;
revoke all on public.rmg_inquiries, public.rmg_rate_limits, public.rmg_event_counts from public, anon, authenticated;
grant all on public.rmg_inquiries, public.rmg_rate_limits, public.rmg_event_counts to service_role;

create or replace function public.rmg_accept_inquiry(p_id uuid, p_hash text, p_rate_key text, p_recipient_key text, p_name text, p_email text, p_message text, p_preview jsonb, p_email_preview boolean)
returns text language plpgsql security invoker set search_path = public as $$
declare prior_hash text; prior_notified timestamptz; prior_preview boolean; used integer;
begin
  -- Serialize retries so duplicate requests create just one durable lead.
  perform pg_advisory_xact_lock(hashtextextended(p_id::text, 0));
  select payload_hash, notified_at, preview_emailed into prior_hash, prior_notified, prior_preview from rmg_inquiries where id = p_id;
  if found then
    if prior_hash <> p_hash then return 'conflict'; end if;
    if prior_notified is not null and (not p_email_preview or prior_preview) then
      if prior_preview then return 'existing_preview_sent'; else return 'existing_sent'; end if;
    end if;
    return 'existing';
  end if;
  delete from rmg_rate_limits where bucket < now() - interval '48 hours';
  insert into rmg_rate_limits(rate_key) values (p_rate_key)
    on conflict (rate_key, bucket) do update set count = rmg_rate_limits.count + 1 returning count into used;
  if used > 5 then return 'limited'; end if;
  -- Shared recipient cap stops distributed requests generating unlimited copies.
  insert into rmg_rate_limits(rate_key) values (p_recipient_key)
    on conflict (rate_key, bucket) do update set count = rmg_rate_limits.count + 1 returning count into used;
  if used > 3 then return 'limited'; end if;
  insert into rmg_inquiries(id, payload_hash, name, email, message, preview, email_preview)
    values (p_id, p_hash, p_name, p_email, p_message, p_preview, p_email_preview);
  insert into rmg_event_counts(event) values ('inquiry_received')
    on conflict(day, event) do update set count = rmg_event_counts.count + 1;
  return 'saved';
end $$;

create or replace function public.rmg_count_event(p_event text, p_rate_key text)
returns void language plpgsql security invoker set search_path = public as $$
declare used integer;
begin
  if p_event not in ('page_view','preview_started','preview_saved','preview_shared','preview_booking','portfolio_viewed','booking_opened','booking_completed') then return; end if;
  delete from rmg_rate_limits where bucket < now() - interval '48 hours';
  insert into rmg_rate_limits(rate_key) values (p_rate_key)
    on conflict(rate_key,bucket) do update set count = rmg_rate_limits.count + 1 returning count into used;
  if used > 120 then return; end if;
  insert into rmg_event_counts(event) values (p_event)
    on conflict(day,event) do update set count = rmg_event_counts.count + 1;
end $$;
create or replace function public.rmg_claim_notifications(p_id uuid default null, p_limit integer default 10)
returns setof public.rmg_inquiries language plpgsql security invoker set search_path = public as $$
begin
  return query
  with due as (
    select id from rmg_inquiries
    where (p_id is null or id = p_id)
      and notification_attempts < 5
      and next_notification_attempt_at <= now()
      and (notified_at is null or (email_preview and not preview_emailed))
    order by created_at
    limit least(greatest(p_limit, 1), 10)
    for update skip locked
  )
  update rmg_inquiries r set
    notification_attempts = r.notification_attempts + 1,
    next_notification_attempt_at = now() + interval '5 minutes'
  from due where r.id = due.id returning r.*;
end $$;
revoke all on function public.rmg_claim_notifications(uuid,integer) from public, anon, authenticated;
grant execute on function public.rmg_claim_notifications(uuid,integer) to service_role;
revoke all on function public.rmg_accept_inquiry(uuid,text,text,text,text,text,text,jsonb,boolean) from public, anon, authenticated;
revoke all on function public.rmg_count_event(text,text) from public, anon, authenticated;
grant execute on function public.rmg_accept_inquiry(uuid,text,text,text,text,text,text,jsonb,boolean) to service_role;
grant execute on function public.rmg_count_event(text,text) to service_role;
commit;
