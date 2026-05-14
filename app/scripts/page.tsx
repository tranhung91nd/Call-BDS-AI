import { Plus, FileText, Copy, Edit2, Mic } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 0

function formatDate(iso: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return "Hôm nay"
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export default async function ScriptsPage() {
  const supabase = createClient()

  const { data: scripts } = await supabase
    .from("scripts")
    .select("id, name, content, ai_voice_id, created_at")
    .order("created_at", { ascending: false })

  const items = scripts ?? []

  // Đếm số chiến dịch dùng mỗi kịch bản
  const usageMap = new Map<string, number>()
  if (items.length) {
    const { data: camps } = await supabase
      .from("campaigns")
      .select("script_id")
      .in(
        "script_id",
        items.map((s) => s.id),
      )
    for (const c of camps ?? []) {
      if (c.script_id) usageMap.set(c.script_id, (usageMap.get(c.script_id) ?? 0) + 1)
    }
  }

  const sample = items[0]

  return (
    <div className="space-y-5 max-w-6xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Kịch bản AI</h1>
          <p className="page-sub">
            Nội dung AI sẽ đọc khi gọi khách. Dùng biến{" "}
            <code className="text-xs bg-surface-2 border border-line-1 px-1.5 py-0.5 rounded">{"{ten}"}</code>{" "}
            <code className="text-xs bg-surface-2 border border-line-1 px-1.5 py-0.5 rounded">{"{du_an}"}</code>{" "}
            để tự động cá nhân hoá.
          </p>
        </div>
        <button className="btn-primary btn-sm">
          <Plus size={14} /> Tạo kịch bản
        </button>
      </header>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-lg font-semibold text-ink-1">Chưa có kịch bản</div>
          <div className="text-base text-ink-3 mt-1">
            Tạo kịch bản đầu tiên để AI có nội dung gọi khách.
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {items.map((s) => (
              <div key={s.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 shrink-0 rounded-[10px] bg-brand-blue-bg text-brand-blue-tx flex items-center justify-center">
                    <FileText size={16} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base text-ink-1 leading-tight">{s.name}</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-ink-3">
                      <Mic size={11} /> {s.ai_voice_id ?? "Chưa chọn giọng"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-3 pt-3 border-t border-line-1">
                  <span>
                    Dùng <span className="text-ink-1 font-semibold">{usageMap.get(s.id) ?? 0}</span> chiến dịch
                  </span>
                  <span>Lần cuối: {formatDate(s.created_at)}</span>
                </div>
              </div>
            ))}
          </div>

          {sample && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="section-title">{sample.name}</h3>
                  <div className="text-xs text-ink-3 mt-0.5">Xem trước nội dung AI sẽ đọc</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost btn-sm">
                    <Copy size={13} /> Copy
                  </button>
                  <button className="btn-ghost btn-sm">
                    <Edit2 size={13} /> Chỉnh sửa
                  </button>
                </div>
              </div>
              <pre className="text-base text-ink-2 whitespace-pre-wrap bg-surface-2/60 p-4 rounded-[12px] border border-line-1 leading-relaxed font-sans">
{sample.content}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}
