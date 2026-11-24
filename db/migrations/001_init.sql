-- Step 5: admin sign-in, CRM and products.

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text,
  setup_token_hash text,
  setup_expires_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now()
);

-- id is the sha256 of the cookie token, so a database leak can't be replayed as a cookie.
create table if not exists admin_sessions (
  id text primary key,
  user_id uuid not null references admin_users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists admin_sessions_user_idx on admin_sessions(user_id);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  goal text not null,
  message text,
  offer text,
  page_type text not null default 'other',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'call_booked', 'won', 'lost')),
  -- Channel worked out from the first touch: instagram, tiktok, facebook, google, youtube, email, referral, direct, other.
  source text not null default 'direct',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_page text,
  attribution jsonb,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_created_idx on leads(created_at desc);
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_email_idx on leads(lower(email));

-- Timeline per lead: the form message, notes, status changes and (later) emails.
create table if not exists lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type text not null check (type in ('created', 'note', 'status', 'message_out', 'message_in')),
  body text,
  meta jsonb,
  author_id uuid references admin_users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists lead_events_lead_idx on lead_events(lead_id, created_at);

-- PDFs and video lessons sold or given away on their own sales and landing pages.
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  kind text not null check (kind in ('pdf', 'lesson')),
  access text not null default 'paid' check (access in ('free', 'paid')),
  price_cents integer check (price_cents is null or price_cents >= 0),
  currency text not null default 'CAD',
  status text not null default 'draft' check (status in ('draft', 'published')),
  summary text,
  sales_page jsonb not null default '{}'::jsonb,
  landing_page jsonb not null default '{}'::jsonb,
  file_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
