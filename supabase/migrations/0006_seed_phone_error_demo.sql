-- ════════════════════════════════════════════════════════════════
-- 0006: Seed 2 row demo có SĐT lỗi
--       Khi script import Royal chạy, các SĐT bẩn sẽ tự gắn marker này
-- ════════════════════════════════════════════════════════════════

insert into public.customers (phone, name, address, email, project_interest, source, status, notes) values
  (
    '0983393988/0922666636',
    'Phạm Hương Lan',
    'P5 C12 Khu TT Kim Liên, Đống Đa, Hà Nội',
    null,
    'Royal City',
    'Royal City - R1',
    'chua_goi',
    '⚠️ LỖI SĐT: nhiều số trong 1 ô (0983393988/0922666636) — cần tách thủ công' || E'\n' || 'R1 · căn 612 · 181m² · TN-ĐB'
  ),
  (
    '99335819',
    'Công ty CP Công nghệ và Phân phối Toàn Cầu',
    'P67F1 TT nhà máy Trần Hưng Đạo, Đồng Nhân, HN',
    null,
    'Royal City',
    'Royal City - R2',
    'chua_goi',
    '⚠️ LỖI SĐT: số chỉ 8 chữ số (thiếu mã vùng / đầu 0)' || E'\n' || 'R2 · căn 1804 · 109m² · ĐN-TB'
  )
on conflict do nothing;
