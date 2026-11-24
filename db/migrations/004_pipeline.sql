-- Lead pipeline: call, follow up, book, close, plus nurture and past clients.

alter table leads drop constraint if exists leads_status_check;
update leads set status = case status
  when 'contacted' then 'follow_up'
  when 'call_booked' then 'booked'
  when 'won' then 'closed'
  when 'lost' then 'not_qualified'
  else status end;
alter table leads add constraint leads_status_check check (status in (
  'new', 'no_answer', 'follow_up', 'booked', 'booked_follow_up', 'closed', 'not_qualified', 'nurture', 'past_client'));

-- Counters Zack bumps from the card or the profile.
alter table leads add column if not exists calls integer not null default 0;
alter table leads add column if not exists follow_ups integer not null default 0;
alter table leads add column if not exists booked_follow_ups integer not null default 0;
-- Money: what a client pays per month, and what the deal could be worth before it closes.
alter table leads add column if not exists monthly_cents integer;
alter table leads add column if not exists deal_cents integer;
-- Profile picture, resized in the browser: photo for the profile, thumb for cards and lists.
alter table leads add column if not exists photo text;
alter table leads add column if not exists photo_thumb text;
alter table leads add column if not exists instagram text;
alter table leads add column if not exists next_follow_up date;
alter table leads add column if not exists last_contact_at timestamptz;
alter table leads add column if not exists stage_changed_at timestamptz not null default now();
alter table leads add column if not exists closed_at timestamptz;

alter table lead_events drop constraint if exists lead_events_type_check;
alter table lead_events add constraint lead_events_type_check check (type in (
  'created', 'note', 'status', 'message_out', 'message_in', 'call', 'follow_up', 'update'));
create index if not exists lead_events_type_idx on lead_events(type, created_at);
