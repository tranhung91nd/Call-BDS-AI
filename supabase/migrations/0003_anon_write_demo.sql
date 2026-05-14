-- ════════════════════════════════════════════════════════════════
-- 0003: Cho anon role được INSERT/UPDATE customers + scripts (tạm cho MVP)
--       → Khi có Supabase Auth + login, sẽ thay 'true' bằng 'auth.uid() is not null'
-- ════════════════════════════════════════════════════════════════

-- Customers: anon insert + update
drop policy if exists "anon insert customers" on public.customers;
create policy "anon insert customers" on public.customers
  for insert with check (true);

drop policy if exists "anon update customers" on public.customers;
create policy "anon update customers" on public.customers
  for update using (true) with check (true);

-- Scripts: anon insert + update
drop policy if exists "anon insert scripts" on public.scripts;
create policy "anon insert scripts" on public.scripts
  for insert with check (true);

drop policy if exists "anon update scripts" on public.scripts;
create policy "anon update scripts" on public.scripts
  for update using (true) with check (true);
