-- ════════════════════════════════════════════════════════════════
-- 0004: Bảng app_settings (key-value) lưu cấu hình API các provider
--       (VBee, FPT, Stringee, Zalo OA...) — sẽ siết quyền khi có auth
-- ════════════════════════════════════════════════════════════════

create table if not exists public.app_settings (
  key text primary key,
  value text,
  is_secret boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.app_settings enable row level security;

drop policy if exists "anon read app_settings" on public.app_settings;
create policy "anon read app_settings" on public.app_settings
  for select using (true);

drop policy if exists "anon write app_settings" on public.app_settings;
create policy "anon write app_settings" on public.app_settings
  for all using (true) with check (true);

-- Khoá mặc định cho VBee — chưa có value, user nhập trên UI Cài đặt
insert into public.app_settings (key, value, is_secret) values
  ('vbee_api_url',       'https://callbot-prod.vbee.vn/api/v1', false),
  ('vbee_api_key',       null, true),
  ('vbee_webhook_secret',null, true),
  ('vbee_voice_id',      'hcm-diemmy', false)
on conflict (key) do nothing;
