"""
Import data Royal City (file Excel 6 sheet R1-R6) vào Supabase customers.

Chiến lược:
- Group theo SĐT clean (chỉ digits) → 1 chủ = 1 row, dù sở hữu nhiều căn
- SĐT lỗi (bẩn / không hợp lệ) vẫn import, gắn marker "⚠️ LỖI SĐT:" trong notes
- Notes liệt kê tất cả các căn của chủ (R<x> · căn <mã> · <m²> · <hướng>)
- Idempotent: dùng on_conflict=phone (unique partial index theo regex digits)

Usage:
    python3.12 scripts/import-royal.py              # dry-run, in summary
    python3.12 scripts/import-royal.py --execute    # insert thật lên Supabase
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from collections import defaultdict

EXCEL_PATH = "/Users/hungcoaching/Desktop/ROYAL CITY.xls"
ENV_PATH = "/Users/hungcoaching/bds-ai-call/.env.local"
BATCH_SIZE = 200
PHONE_ERROR_PREFIX = "⚠️ LỖI SĐT:"
SOURCE_BASE = "Royal City"
PROJECT = "Royal City"

# ── Load env ───────────────────────────────────────────────────────────
def load_env():
    env = {}
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env

ENV = load_env()
SUPABASE_URL = ENV["NEXT_PUBLIC_SUPABASE_URL"]
ANON_KEY = ENV["NEXT_PUBLIC_SUPABASE_ANON_KEY"]

# ── Parse Excel ────────────────────────────────────────────────────────
def parse_excel():
    import xlrd
    book = xlrd.open_workbook(EXCEL_PATH)
    rows = []
    for i in range(6):  # 6 sheet đầu: R1-R6
        sheet = book.sheet_by_index(i)
        building = sheet.name.split("_")[0]  # "R1", "R2"...
        for r in range(4, sheet.nrows):
            owner = str(sheet.cell_value(r, 4)).strip()
            phone_raw = str(sheet.cell_value(r, 5)).strip()
            if not owner or not phone_raw:
                continue
            rows.append({
                "building": building,
                "unit": str(sheet.cell_value(r, 1)).replace(".0", "").strip(),
                "area": sheet.cell_value(r, 2),
                "orient": str(sheet.cell_value(r, 3)).strip(),
                "name": owner,
                "phone_raw": phone_raw,
                "address": str(sheet.cell_value(r, 6)).strip(),
                "email": str(sheet.cell_value(r, 7)).strip() if sheet.ncols > 7 else "",
            })
    return rows

# ── Normalize phone + detect error ─────────────────────────────────────
def normalize_phone(raw):
    """Return (phone_to_insert, phone_key_for_grouping, error_msg_or_None)."""
    s = raw.replace(" ", "").replace("\xa0", "")
    # Có nhiều SĐT trong 1 ô?
    if re.search(r"[/,;]", s) or re.search(r"\d{10,}\D+\d{4,}", s):
        # Lấy số đầu tiên có vẻ là SĐT VN (10 chữ số bắt đầu 0)
        m = re.search(r"0\d{9,10}", s)
        if m:
            primary = m.group(0)
            return primary, primary, f"nhiều SĐT trong 1 ô (gốc: {raw}) — đã lấy số đầu"
        return raw, re.sub(r"\D", "", raw) or raw, f"nhiều SĐT trong 1 ô (gốc: {raw})"
    # Có dấu chấm thập phân kiểu "9.9950901" hay "99335819.0"?
    if "." in s:
        clean = re.sub(r"\D", "", s)
        if 9 <= len(clean) <= 11:
            return clean, clean, f"SĐT có ký tự lạ (gốc: {raw})"
        return raw, clean or raw, f"SĐT có ký tự lạ + sai độ dài (gốc: {raw})"
    clean = re.sub(r"\D", "", s)
    if not clean:
        return raw, raw, "SĐT trống / chỉ có ký tự lạ"
    # Số nước ngoài (>11 chữ số, không bắt đầu 0)
    if len(clean) > 11:
        return raw, clean, f"SĐT quá dài {len(clean)} chữ số (có thể số nước ngoài)"
    # Sai độ dài
    if len(clean) not in (10, 11):
        return raw, clean, f"SĐT chỉ {len(clean)} chữ số (thiếu / sai mã vùng)"
    # Không bắt đầu 0
    if not clean.startswith("0"):
        return clean, clean, f"SĐT không bắt đầu 0 (gốc: {raw})"
    # OK
    return clean, clean, None

# ── Build rows for Supabase ────────────────────────────────────────────
def build_customer_rows():
    excel_rows = parse_excel()
    # Group theo phone_key
    groups = defaultdict(list)
    for r in excel_rows:
        ph_insert, ph_key, err = normalize_phone(r["phone_raw"])
        r["_phone_insert"] = ph_insert
        r["_phone_key"] = ph_key
        r["_phone_error"] = err
        groups[ph_key].append(r)

    customers = []
    for key, items in groups.items():
        # Pick best fields (row đầu tiên có data)
        def first_non_empty(field):
            for it in items:
                v = str(it.get(field, "")).strip()
                if v and v.lower() not in ("không có", "k có", "kc", "không", "nan"):
                    return v
            return None

        name = first_non_empty("name")
        address = first_non_empty("address")
        email = first_non_empty("email")
        # Validate email format đơn giản
        if email and "@" not in email:
            email = None

        # Lấy SĐT để insert: ưu tiên số đã clean hợp lệ
        phone = items[0]["_phone_insert"]
        error_msg = items[0]["_phone_error"]
        # Nếu chủ có nhiều căn ở các sheet khác nhau → tổng hợp building
        buildings = sorted({it["building"] for it in items})

        # Build notes
        note_lines = []
        if error_msg:
            note_lines.append(f"{PHONE_ERROR_PREFIX} {error_msg}")
        for it in items:
            area = it["area"]
            area_str = f"{area}m²" if isinstance(area, (int, float)) and area > 0 else "—"
            note_lines.append(
                f"{it['building']} · căn {it['unit']} · {area_str} · {it['orient'] or '—'}"
            )

        customers.append({
            "phone": phone,
            "name": name,
            "address": address,
            "email": email,
            "project_interest": PROJECT,
            "source": f"{SOURCE_BASE} - {', '.join(buildings)}",
            "status": "chua_goi",
            "notes": "\n".join(note_lines),
        })
    return customers, excel_rows

# ── Print summary ──────────────────────────────────────────────────────
def print_summary(customers, raw_rows):
    total_raw = len(raw_rows)
    total_cust = len(customers)
    with_error = sum(1 for c in customers if c["notes"].startswith(PHONE_ERROR_PREFIX))
    with_email = sum(1 for c in customers if c["email"])
    multi_unit = sum(1 for c in customers if c["notes"].count("· căn ") > 1)

    print(f"\n{'='*60}")
    print(f"PARSE SUMMARY — Royal City")
    print(f"{'='*60}")
    print(f"Tổng dòng Excel (6 sheet R1-R6):  {total_raw:>6}")
    print(f"Sau khi group theo SĐT:           {total_cust:>6}  ← sẽ insert")
    print(f"  ├─ Có >1 căn (chủ multi-unit):  {multi_unit:>6}")
    print(f"  ├─ Có lỗi SĐT (báo đỏ):         {with_error:>6}")
    print(f"  └─ Có email:                    {with_email:>6}")
    print(f"\n5 row đầu (sample):")
    for c in customers[:5]:
        print(f"  • {c['name'][:30]:30}  {c['phone'][:25]:25}  {c['notes'].split(chr(10))[0][:55]}")
    print(f"\n5 row lỗi SĐT (sample):")
    errs = [c for c in customers if c["notes"].startswith(PHONE_ERROR_PREFIX)][:5]
    for c in errs:
        first_line = c["notes"].split("\n")[0]
        print(f"  • {(c['name'] or '?')[:30]:30}  '{c['phone']}'  → {first_line[:60]}")

# ── Insert batch via Supabase REST ─────────────────────────────────────
def insert_batch(batch):
    url = f"{SUPABASE_URL}/rest/v1/customers"
    body = json.dumps(batch).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json",
            # ignore-duplicates: nếu trùng phone (unique partial index) → bỏ qua
            "Prefer": "return=minimal,resolution=ignore-duplicates",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return True, resp.status, ""
    except urllib.error.HTTPError as e:
        return False, e.code, e.read().decode("utf-8", errors="replace")
    except Exception as e:
        return False, 0, str(e)

def execute_insert(customers):
    total = len(customers)
    print(f"\n🚀 Bắt đầu insert {total} row vào Supabase (batch {BATCH_SIZE})...")
    success = 0
    failed_batches = []
    for i in range(0, total, BATCH_SIZE):
        batch = customers[i:i+BATCH_SIZE]
        ok, code, msg = insert_batch(batch)
        if ok:
            success += len(batch)
            print(f"  ✓ Batch {i//BATCH_SIZE + 1}/{(total + BATCH_SIZE - 1)//BATCH_SIZE}  "
                  f"({i+1}–{i+len(batch)})  HTTP {code}")
        else:
            failed_batches.append((i, code, msg[:300]))
            print(f"  ✗ Batch {i//BATCH_SIZE + 1}  HTTP {code}  {msg[:200]}")
    print(f"\n{'='*60}")
    print(f"DONE: {success}/{total} row inserted")
    if failed_batches:
        print(f"⚠️  {len(failed_batches)} batch lỗi:")
        for idx, code, msg in failed_batches[:3]:
            print(f"   batch start={idx} HTTP {code} {msg[:200]}")

# ── Main ───────────────────────────────────────────────────────────────
def main():
    customers, raw_rows = build_customer_rows()
    print_summary(customers, raw_rows)

    if "--execute" in sys.argv:
        execute_insert(customers)
    else:
        print(f"\n💡 Chạy `python3.12 scripts/import-royal.py --execute` để insert thật.")

if __name__ == "__main__":
    main()
