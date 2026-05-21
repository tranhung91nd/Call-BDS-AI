-- ════════════════════════════════════════════════════════════════
-- 0007: Thêm trường SĐT phụ (phone_secondary)
--       Dùng cho data có nhiều SĐT trong 1 ô (vd "0983.../0922...")
-- ════════════════════════════════════════════════════════════════

alter table public.customers
  add column if not exists phone_secondary text;
