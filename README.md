# BDS AI Call

CRM gọi tự động bằng AI cho dịch vụ Bất động sản. AI quay số 1.000 khách, phân loại quan tâm/không, đẩy lead nóng cho sale chốt qua Zalo.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind
- **Supabase** (Postgres + Auth + RLS)
- **VBee AICall** (voice AI tiếng Việt, ~500–800đ/phút)
- Deploy: Vercel

## Setup lần đầu

```bash
cd /Users/hungcoaching/bds-ai-call
npm install
cp .env.example .env.local
# Điền NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY vào .env.local
npm run dev
# Mở http://localhost:3000
```

## Tạo project Supabase

1. Vào https://supabase.com → New project (region: Singapore).
2. Mở **SQL Editor** → paste nội dung [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) → Run.
3. Vào **Project Settings → API** → copy `URL` + `anon public key` vào `.env.local`.

## Tích hợp VBee AICall

1. Đăng ký tài khoản: https://aicall.vbee.ai
2. Tạo bot tiếng Việt + chọn giọng đọc.
3. Lấy API key → điền `VBEE_API_KEY` vào `.env.local`.
4. Cấu hình webhook về `<domain>/api/webhooks/vbee` để nhận kết quả gọi (sẽ làm ở pha 2).

## Pipeline khách

```
chua_goi → da_goi → quan_tam   → (lead nóng, sale follow Zalo)
                  → khong_quan_tam
                  → goi_lai
                  → khong_nghe
```

## Roadmap

- **Pha 1 (MVP, ~2 tuần)**: import CSV, list khách, list chiến dịch, bảng lead nóng (mở Zalo tay). *Đang ở pha này.*
- **Pha 2 (~2 tuần)**: webhook VBee, auto chia batch theo giờ, ghi âm/transcript.
- **Pha 3**: A/B test kịch bản, drip nurture cho `goi_lai`.

## ⚠️ Lưu ý pháp lý

Nghị định 91/2020/NĐ-CP: cuộc gọi quảng cáo cần khách opt-in. Khuyến nghị:
- Chỉ gọi data đã từng tương tác (form, sự kiện, sale đã chăm).
- Đăng ký brandname thay vì số lạ.
- Script có opt-out (bấm phím để dừng nhận tin).
