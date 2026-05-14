-- ════════════════════════════════════════════════════════════════
-- 0002: Cho anon role được SELECT (tạm cho demo UI, sẽ siết khi có auth)
--       + seed 5 khách + 1 kịch bản + 1 chiến dịch + 2 lead nóng
-- ════════════════════════════════════════════════════════════════

-- ── Anon SELECT policies (idempotent: drop trước rồi tạo lại) ──
drop policy if exists "anon read customers" on public.customers;
create policy "anon read customers" on public.customers
  for select using (true);

drop policy if exists "anon read scripts" on public.scripts;
create policy "anon read scripts" on public.scripts
  for select using (true);

drop policy if exists "anon read campaigns" on public.campaigns;
create policy "anon read campaigns" on public.campaigns
  for select using (true);

drop policy if exists "anon read camp_cust" on public.campaign_customers;
create policy "anon read camp_cust" on public.campaign_customers
  for select using (true);

drop policy if exists "anon read call_logs" on public.call_logs;
create policy "anon read call_logs" on public.call_logs
  for select using (true);

-- ── Seed dữ liệu mẫu ──
-- 1 kịch bản mẫu
insert into public.scripts (id, name, content, ai_voice_id)
values (
  '11111111-1111-1111-1111-111111111111',
  'Mời tư vấn Vinhomes Ocean Park',
  'Xin chào anh/chị {ten}, em là trợ lý ảo của công ty BĐS XYZ. Em được biết anh/chị từng quan tâm đến dự án {du_an}. Hiện bên em đang có chính sách ưu đãi đặc biệt: chiết khấu lên tới 8%, ân hạn gốc 24 tháng. Anh/chị có muốn em kết nối chuyên viên tư vấn gửi thông tin chi tiết qua Zalo không ạ?',
  'fpt_banmai'
)
on conflict (id) do nothing;

-- 1 chiến dịch đang chạy
insert into public.campaigns (id, name, script_id, status, started_at)
values (
  '22222222-2222-2222-2222-222222222222',
  'Đợt 1 - Vinhomes Ocean Park',
  '11111111-1111-1111-1111-111111111111',
  'running',
  now() - interval '2 hours'
)
on conflict (id) do nothing;

-- 5 khách hàng (mix trạng thái)
insert into public.customers (phone, name, project_interest, source, status, last_contact_at) values
  ('0912345678', 'Nguyễn Văn A', 'Vinhomes Ocean Park',  'Lead form FB',   'chua_goi',       null),
  ('0987654321', 'Trần Thị B',   'Masteri Centre Point', 'Lead form FB',   'quan_tam',       now() - interval '15 minutes'),
  ('0901112223', 'Lê Văn C',     'Vinhomes Ocean Park',  'Sự kiện 04/2026','khong_nghe',     now() - interval '1 hour'),
  ('0922334455', 'Phạm Thị D',   'Lumi Hà Nội',          'Lead form FB',   'goi_lai',        now() - interval '30 minutes'),
  ('0934567890', 'Hoàng Văn E',  'Vinhomes Ocean Park',  'Landing page',   'quan_tam',       now() - interval '5 minutes')
on conflict do nothing;

-- 2 call_logs cho 2 khách quan_tâm (để bảng "Lead nóng" hiển thị)
insert into public.call_logs (customer_id, campaign_id, started_at, ended_at, duration_sec, transcript, ai_intent)
select
  c.id,
  '22222222-2222-2222-2222-222222222222',
  c.last_contact_at,
  c.last_contact_at + interval '1 minute 47 seconds',
  107,
  'Khách hỏi giá căn 2 phòng ngủ view sông, muốn được tư vấn thêm qua Zalo.',
  'quan_tam'
from public.customers c
where c.phone = '0987654321'
  and not exists (select 1 from public.call_logs cl where cl.customer_id = c.id);

insert into public.call_logs (customer_id, campaign_id, started_at, ended_at, duration_sec, transcript, ai_intent)
select
  c.id,
  '22222222-2222-2222-2222-222222222222',
  c.last_contact_at,
  c.last_contact_at + interval '2 minutes 12 seconds',
  132,
  'Đang tìm căn 3PN ở khu Lumière, hẹn gọi lại nhưng prefer Zalo. Cần gửi bảng giá ngay.',
  'quan_tam'
from public.customers c
where c.phone = '0934567890'
  and not exists (select 1 from public.call_logs cl where cl.customer_id = c.id);
