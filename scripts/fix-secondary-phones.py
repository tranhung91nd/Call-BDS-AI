"""
Fix các row có marker "⚠️ LỖI SĐT: nhiều SĐT trong 1 ô (gốc: X/Y)..."
→ Tách số gốc thành phone (chính) + phone_secondary (phụ)
→ Bỏ dòng marker lỗi khỏi notes (trường hợp 2 số đã xử lý xong)
→ Nếu vẫn còn >2 số sau khi tách → giữ marker với note "còn N số khác"

Usage:
    python3.12 scripts/fix-secondary-phones.py              # dry-run
    python3.12 scripts/fix-secondary-phones.py --execute    # update thật
"""

import json
import re
import sys
import urllib.parse
import urllib.request
import urllib.error

ENV_PATH = "/Users/hungcoaching/bds-ai-call/.env.local"
PHONE_ERROR_PREFIX = "⚠️ LỖI SĐT:"

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

HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
}

# ── Fetch rows có marker "nhiều SĐT trong 1 ô" ─────────────────────────
def fetch_rows():
    pattern = urllib.parse.quote("⚠️ LỖI SĐT: nhiều SĐT trong 1 ô%")
    url = f"{SUPABASE_URL}/rest/v1/customers?select=id,phone,phone_secondary,notes&notes=like.{pattern}&limit=1000"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())

# ── Parse phones từ chuỗi gốc trong notes ──────────────────────────────
def extract_phones(notes):
    """Trả về list các SĐT (dạng clean digits) trích được từ marker 'gốc: ...'."""
    m = re.search(r"gốc:\s*([^\)\n]+)", notes)
    if not m:
        return []
    raw = m.group(1).strip()
    # Tách theo /, ',', ';', và whitespace dài
    parts = re.split(r"[\/,;]+|\s{2,}", raw)
    out = []
    for p in parts:
        digits = re.sub(r"\D", "", p)
        if digits:
            # Nếu thiếu đầu 0 và độ dài 9 → thêm 0
            if len(digits) == 9 and not digits.startswith("0"):
                digits = "0" + digits
            out.append(digits)
    # Dedup giữ thứ tự
    seen = set()
    result = []
    for p in out:
        if p not in seen:
            seen.add(p)
            result.append(p)
    return result

# ── Build new notes (strip marker line nếu đã xử lý xong) ──────────────
def rebuild_notes(notes, leftover_count):
    lines = notes.split("\n")
    # Drop dòng đầu nếu là marker
    if lines and lines[0].startswith(PHONE_ERROR_PREFIX):
        lines = lines[1:]
    # Nếu còn dư SĐT (>2), prepend marker mới
    if leftover_count > 0:
        lines = [
            f"{PHONE_ERROR_PREFIX} còn {leftover_count} SĐT khác chưa lưu — cần xử lý thủ công"
        ] + lines
    return "\n".join(lines).strip()

# ── Update 1 row ───────────────────────────────────────────────────────
def patch_row(row_id, payload):
    url = f"{SUPABASE_URL}/rest/v1/customers?id=eq.{row_id}"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        method="PATCH",
        headers={**HEADERS, "Prefer": "return=minimal"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return True, resp.status, ""
    except urllib.error.HTTPError as e:
        return False, e.code, e.read().decode("utf-8", errors="replace")
    except Exception as e:
        return False, 0, str(e)

# ── Main ───────────────────────────────────────────────────────────────
def main():
    rows = fetch_rows()
    print(f"\nTìm thấy {len(rows)} row có marker 'nhiều SĐT trong 1 ô'")

    plan = []
    for r in rows:
        phones = extract_phones(r["notes"])
        if len(phones) < 2:
            plan.append({
                "id": r["id"],
                "_skip": True,
                "_reason": f"không trích được >=2 SĐT từ marker ({phones})",
            })
            continue
        primary = phones[0]
        secondary = phones[1]
        leftover = len(phones) - 2
        new_notes = rebuild_notes(r["notes"], leftover)
        plan.append({
            "id": r["id"],
            "_old_phone": r["phone"],
            "_old_secondary": r["phone_secondary"],
            "phone": primary,
            "phone_secondary": secondary,
            "notes": new_notes,
            "_leftover": leftover,
        })

    skipped = [p for p in plan if p.get("_skip")]
    actionable = [p for p in plan if not p.get("_skip")]
    print(f"  ├─ Sẽ update:                {len(actionable)}")
    print(f"  ├─ Còn >2 SĐT (giữ marker):  {sum(1 for p in actionable if p['_leftover'])}")
    print(f"  └─ Skip (không parse được):  {len(skipped)}")

    print(f"\n5 row sample sẽ update:")
    for p in actionable[:5]:
        print(f"  • id={p['id'][:8]}... phone={p['_old_phone']:>22} → {p['phone']:>11} + phụ {p['phone_secondary']:>11}"
              f"  leftover={p['_leftover']}")

    if skipped:
        print(f"\n{len(skipped)} row skip:")
        for s in skipped[:3]:
            print(f"  • id={s['id'][:8]}... — {s['_reason']}")

    if "--execute" not in sys.argv:
        print(f"\n💡 Chạy `python3.12 scripts/fix-secondary-phones.py --execute` để update thật.")
        return

    print(f"\n🚀 Bắt đầu PATCH {len(actionable)} row...")
    ok_count = 0
    fail = []
    for i, p in enumerate(actionable):
        payload = {
            "phone": p["phone"],
            "phone_secondary": p["phone_secondary"],
            "notes": p["notes"],
        }
        ok, code, msg = patch_row(p["id"], payload)
        if ok:
            ok_count += 1
            if (i + 1) % 20 == 0:
                print(f"  ✓ {i+1}/{len(actionable)}")
        else:
            fail.append((p["id"], code, msg[:200]))
            print(f"  ✗ id={p['id'][:8]} HTTP {code} {msg[:120]}")
    print(f"\nDONE: {ok_count}/{len(actionable)} updated")
    if fail:
        print(f"⚠️  {len(fail)} lỗi:")
        for r in fail[:3]:
            print(f"   {r}")

if __name__ == "__main__":
    main()
