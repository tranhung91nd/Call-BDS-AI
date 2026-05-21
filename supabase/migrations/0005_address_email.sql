-- ════════════════════════════════════════════════════════════════
-- 0005: Thêm 2 trường địa chỉ + email cho customers
--       (chuẩn bị import data Royal City — có cả địa chỉ liên hệ và email chủ)
-- ════════════════════════════════════════════════════════════════

alter table public.customers
  add column if not exists address text,
  add column if not exists email text;
