-- BDS AI Call: schema khởi tạo
-- Chạy trên Supabase SQL Editor sau khi tạo project mới.

create extension if not exists "pgcrypto";

-- =========================================================
-- customers: danh sách khách BĐS
-- =========================================================
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  name text,
  source text,
  project_interest text,
  status text not null default 'chua_goi'
    check (status in ('chua_goi','da_goi','quan_tam','khong_quan_tam','goi_lai','khong_nghe')),
  do_not_call boolean not null default false,
  last_contact_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- Mỗi SĐT là 1 khách duy nhất (chuẩn hoá: chỉ giữ chữ số)
create unique index if not exists customers_phone_uidx
  on public.customers (regexp_replace(phone, '\D', '', 'g'));

create index if not exists customers_status_idx on public.customers (status);
create index if not exists customers_dnc_idx on public.customers (do_not_call);

-- =========================================================
-- scripts: kịch bản AI sẽ đọc
-- =========================================================
create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  ai_voice_id text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- campaigns: chiến dịch gọi 1 batch khách
-- =========================================================
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  script_id uuid references public.scripts(id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft','running','paused','done')),
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

-- Bảng nối campaign <-> customer (1 KH có thể vào nhiều chiến dịch)
create table if not exists public.campaign_customers (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  queued_at timestamptz not null default now(),
  primary key (campaign_id, customer_id)
);

-- =========================================================
-- call_logs: log mỗi cuộc gọi do AI thực hiện
-- =========================================================
create table if not exists public.call_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  provider text not null default 'vbee',
  provider_call_id text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_sec integer,
  recording_url text,
  transcript text,
  ai_intent text
    check (ai_intent is null or ai_intent in ('quan_tam','khong_quan_tam','goi_lai','khong_nghe')),
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists call_logs_customer_idx on public.call_logs (customer_id);
create index if not exists call_logs_campaign_idx on public.call_logs (campaign_id);
create index if not exists call_logs_intent_idx on public.call_logs (ai_intent);

-- =========================================================
-- View: lead nóng (khách quan tâm, sale cần follow Zalo)
-- =========================================================
create or replace view public.hot_leads as
select
  c.id,
  c.phone,
  c.name,
  c.project_interest,
  c.last_contact_at,
  cl.recording_url,
  cl.transcript
from public.customers c
left join lateral (
  select recording_url, transcript
  from public.call_logs
  where customer_id = c.id and ai_intent = 'quan_tam'
  order by started_at desc
  limit 1
) cl on true
where c.status = 'quan_tam'
order by c.last_contact_at desc nulls last;

-- =========================================================
-- RLS: bật mặc định, sale đã đăng nhập đọc/ghi
-- =========================================================
alter table public.customers enable row level security;
alter table public.scripts enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_customers enable row level security;
alter table public.call_logs enable row level security;

create policy "authed read customers" on public.customers
  for select using (auth.role() = 'authenticated');
create policy "authed write customers" on public.customers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authed read scripts" on public.scripts
  for select using (auth.role() = 'authenticated');
create policy "authed write scripts" on public.scripts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authed read campaigns" on public.campaigns
  for select using (auth.role() = 'authenticated');
create policy "authed write campaigns" on public.campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authed read camp_cust" on public.campaign_customers
  for select using (auth.role() = 'authenticated');
create policy "authed write camp_cust" on public.campaign_customers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authed read call_logs" on public.call_logs
  for select using (auth.role() = 'authenticated');
create policy "authed write call_logs" on public.call_logs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
