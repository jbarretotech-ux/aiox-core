-- SG-1.1 — Schema inicial do Sobra Grana
-- Dinheiro sempre em centavos (integer). RLS ligado em todas as tabelas:
-- o backend usa service_role (ignora RLS); acesso anônimo fica bloqueado por padrão.

create extension if not exists pgcrypto;

create table users (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null unique check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  name text,
  consent_at timestamptz,
  trial_ends_at timestamptz,
  plan_status text not null default 'trial'
    check (plan_status in ('trial', 'active', 'past_due', 'canceled')),
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  psp text not null default 'asaas',
  psp_subscription_id text unique,
  price_cents integer not null default 1990 check (price_cents > 0),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete cascade,
  direction text not null check (direction in ('in', 'out')),
  wa_message_id text unique,
  kind text not null check (kind in ('text', 'audio', 'image', 'template')),
  body text,
  media_path text,
  status text not null default 'received'
    check (status in ('received', 'processing', 'done', 'failed')),
  error text,
  created_at timestamptz not null default now()
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  kind text not null check (kind in ('expense', 'income')),
  amount_cents integer not null check (amount_cents > 0),
  category text not null,
  description text,
  occurred_on date not null default current_date,
  source text not null check (source in ('text', 'audio', 'image', 'cli')),
  message_id uuid references messages (id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  description text not null,
  amount_cents integer check (amount_cents > 0),
  due_on date not null,
  recurrence text not null default 'none' check (recurrence in ('none', 'monthly')),
  status text not null default 'open' check (status in ('open', 'paid')),
  last_reminded_at timestamptz,
  created_at timestamptz not null default now()
);

create table conversation_state (
  user_id uuid primary key references users (id) on delete cascade,
  summary text not null default '',
  updated_at timestamptz not null default now()
);

create table usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users (id) on delete cascade,
  kind text not null check (kind in ('llm', 'stt', 'wa_template')),
  input_tokens integer not null default 0,
  cached_tokens integer not null default 0,
  output_tokens integer not null default 0,
  audio_seconds integer not null default 0,
  cost_micro_usd bigint not null default 0,
  created_at timestamptz not null default now()
);

-- Índices para as consultas mais comuns
create index messages_status_created_idx on messages (status, created_at);
create index transactions_user_date_idx on transactions (user_id, occurred_on) where deleted_at is null;
create index bills_open_due_idx on bills (due_on) where status = 'open';
create index usage_events_user_created_idx on usage_events (user_id, created_at);

-- RLS: ligado em todas as tabelas, sem policies (só service_role acessa por enquanto)
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table messages enable row level security;
alter table transactions enable row level security;
alter table bills enable row level security;
alter table conversation_state enable row level security;
alter table usage_events enable row level security;
