# Lead delivery setup and operations

The Next.js `/api/leads` route validates and stores inquiries in Supabase before showing receipt. Resend then accepts an owner notification; the customer's optional concept copy uses a separate idempotency key. A provider receipt means accepted for delivery, not confirmed inbox arrival. No secrets are sent to the browser.

## Activation

1. Choose an active Supabase project. Use a dedicated project for this site rather than sharing another app's backend.
2. Apply `supabase/rmg-inquiries.sql`. It creates isolated tables with RLS, no anon/authenticated privileges, and service-role-only RPCs.
3. Set all variables in `.env.example` in the Vercel project. Generate long random rate-limit and CRON_SECRET values. Vercel authenticates its cron requests with CRON_SECRET. Use a verified Resend sender domain. No additional paid service is required by the code, but verify the selected providers' plan limits before provisioning.
4. Redeploy and send an explicitly authorized test inquiry. Confirm one row, one owner notification, the optional concept copy, and unchanged row count on retry. Confirm DNT/GPC produces no analytics events.

Missing environment variables, paused storage, invalid provider setup, and network failures never produce a false delivery success. An inquiry already stored returns success even if notification is temporarily unavailable, and logs only its reference. Inspect pending notifications below. A daily authenticated job at `/api/cron/notifications` retries up to ten pending inquiries, with parallel delivery and a 30-second function budget. The schedule in `vercel.json` uses one daily invocation. Browser retries reuse the request UUID while the payload is unchanged; the database checks its payload hash and serializes concurrent duplicates. The database leases claimed notification records for five minutes, caps automatic attempts at five, and persists owner and customer-copy outcomes independently. Already-confirmed owner notifications are skipped during customer-copy retries. Resend keys reduce duplicate notification sends within its provider retention window. A provider success followed by a database outage is inherently ambiguous: retry outside the provider idempotency retention window can duplicate a notification. Delivery is at-least-once, not exactly-once.

## Operations

In Supabase SQL editor (owner access only):

```sql
-- Inquiries needing notification attention. Contact these people manually or retry delivery.
select id, name, email, created_at from public.rmg_inquiries
where notified_at is null or (email_preview and not preview_emailed)
order by created_at;
-- Exhausted retries need owner attention; investigate before resetting attempts.
select id, notification_attempts, next_notification_attempt_at
from public.rmg_inquiries
where notification_attempts >= 5
  and (notified_at is null or (email_preview and not preview_emailed));
-- Actual persisted inquiries and anonymous interaction totals.
select day, event, count from public.rmg_event_counts order by day desc, event;
```

Server-confirmed `inquiry_received` counts are written in the same transaction as the lead. Other counts are browser interaction signals, not independently verified bookings or unique visitors. A booking-completed event should fire only after Cal.com's confirmed callback. No analytics payload accepts names, emails, URLs, query strings, preview contents, or user identifiers. A daily HMAC of Vercel's trusted IP header is used only for hourly abuse limits (5 new inquiries/IP/hour, 3 inquiries/recipient/hour, and 120 analytics events/IP/hour). Rate rows are purged after 48 hours during subsequent requests. A shared local bucket applies outside Vercel; adapt the trusted IP source before deploying to another host.

Periodically remove inquiry records that no longer serve a business purpose and honor deletion requests. Optional concept emails contain shareable concept URLs; anyone with a URL can view the included concept. Uploaded logos are not stored by this delivery flow. There is no automatic newsletter subscription.

Limits: the daily job processes at most ten pending records per run, so a sustained delivery outage creates a backlog. Monitor pending rows and exhausted attempts. Authenticated owner-triggered calls to the same cron endpoint can drain additional batches after resolving the provider issue; never expose CRON_SECRET in URLs or browser code. The initial notification attempt and each retry have bounded provider timeouts; a function interruption releases its lease after five minutes. Honeypot, same-origin checks, strict bounds and shared database rate limits reduce abuse but are not bot-proof. Cross-site checks are defense-in-depth; non-browser clients can forge Origin. Enable provider firewall protection if traffic warrants it. No server-side filesystem is used as persistent storage.
