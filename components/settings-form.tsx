"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export type SettingRow = {
  key: string
  value: string | null
  is_secret: boolean
}

type Field = {
  key: string
  label: string
  type: "text" | "secret" | "url"
  placeholder?: string
  hint?: string
}

const VBEE_FIELDS: Field[] = [
  {
    key: "vbee_api_url",
    label: "VBee API URL",
    type: "url",
    placeholder: "https://api.vbee.ai/...",
    hint: "Endpoint REST chính xác lấy từ dashboard VBee → Developer / API Docs sau khi đăng ký.",
  },
  {
    key: "vbee_api_key",
    label: "VBee API Key",
    type: "secret",
    placeholder: "Dán API key từ dashboard VBee...",
    hint: "Vào aicall.vbee.ai → Settings → API Keys.",
  },
  {
    key: "vbee_webhook_secret",
    label: "Webhook Secret",
    type: "secret",
    placeholder: "Chuỗi ngẫu nhiên 32+ ký tự",
    hint: "Dùng để verify webhook đến từ VBee chứ không phải attacker giả mạo.",
  },
  {
    key: "vbee_voice_id",
    label: "Voice ID mặc định",
    type: "text",
    placeholder: "hcm-diemmy",
    hint: "Giọng AI mặc định khi tạo kịch bản mới. Vd: hcm-diemmy, hn-hamy.",
  },
]

export function SettingsForm({ initial }: { initial: SettingRow[] }) {
  const initialMap: Record<string, string> = {}
  for (const r of initial) initialMap[r.key] = r.value ?? ""
  const [values, setValues] = useState<Record<string, string>>(initialMap)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const save = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    const supabase = createClient()
    const rows = VBEE_FIELDS.map((f) => ({
      key: f.key,
      value: values[f.key]?.trim() || null,
      is_secret: f.type === "secret",
      updated_at: new Date().toISOString(),
    }))
    const { error: e } = await supabase.from("app_settings").upsert(rows, { onConflict: "key" })
    setSaving(false)
    if (e) {
      setError(e.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[10px] bg-brand-blue-bg text-brand-blue-tx flex items-center justify-center font-bold">
            VB
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink-1">VBee AICall</h2>
            <div className="text-sm text-ink-3">
              Provider gọi tự động bằng AI tiếng Việt. Đăng ký tại{" "}
              <a
                href="https://aicall.vbee.ai"
                target="_blank"
                rel="noreferrer"
                className="text-brand-blue-tx hover:underline"
              >
                aicall.vbee.ai
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {VBEE_FIELDS.map((f) => {
            const isSecret = f.type === "secret"
            const shown = showSecrets[f.key] ?? false
            return (
              <div key={f.key}>
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-1.5">
                  {f.label}
                </div>
                <div className="relative">
                  <input
                    type={isSecret && !shown ? "password" : "text"}
                    className="w-full px-3 py-2 text-base bg-surface-2 border border-line-2 rounded-[10px] outline-none focus:border-brand-blue focus:bg-surface-1 transition-colors pr-10 font-sans"
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  />
                  {isSecret && (
                    <button
                      type="button"
                      onClick={() => setShowSecrets({ ...showSecrets, [f.key]: !shown })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-ink-3 hover:text-ink-1 hover:bg-surface-2 rounded-[6px]"
                      aria-label="Hiện/ẩn"
                    >
                      {shown ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
                {f.hint && <div className="text-xs text-ink-hint mt-1">{f.hint}</div>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-4 flex items-center justify-between gap-3">
        <div className="text-sm text-ink-3">
          {saved && (
            <span className="text-ok-tx flex items-center gap-1.5">
              <Check size={14} /> Đã lưu cấu hình
            </span>
          )}
          {error && <span className="text-danger-tx">Lỗi: {error}</span>}
          {!saved && !error && <span>Cấu hình lưu vào bảng <code className="text-xs bg-surface-2 px-1.5 py-0.5 rounded">app_settings</code> trên Supabase.</span>}
        </div>
        <button className="btn-primary btn-sm min-w-[120px]" onClick={save} disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : "Lưu cấu hình"}
        </button>
      </div>

      <div className="card p-5 bg-warn-bg/30 border-warn">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⚠️</div>
          <div className="text-sm text-ink-2 leading-relaxed">
            <div className="font-semibold text-ink-1 mb-1">Lưu ý bảo mật</div>
            API key đang lưu plain text trong Supabase, anon role read được. <strong>OK cho MVP/demo</strong> nhưng trước khi go-live phải bật Supabase Auth + đổi RLS để chỉ admin đọc được, hoặc move sang Vercel env vars + Server Action.
          </div>
        </div>
      </div>
    </div>
  )
}
