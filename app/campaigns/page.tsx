import { Plus, Play, Pause, MoreHorizontal, Users, Phone, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 0

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  draft: { cls: "b-gray", label: "Nháp" },
  running: { cls: "b-green", label: "Đang chạy" },
  paused: { cls: "b-amber", label: "Tạm dừng" },
  done: { cls: "b-blue", label: "Hoàn tất" },
}

function formatDateTime(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default async function CampaignsPage() {
  const supabase = createClient()

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, name, status, started_at, script:scripts(name)")
    .order("created_at", { ascending: false })

  const ids = (campaigns ?? []).map((c) => c.id)

  // Đếm số khách + cuộc gọi + lead nóng per campaign
  const stats = new Map<string, { total: number; called: number; interested: number }>()
  if (ids.length) {
    const [{ data: cust }, { data: logs }] = await Promise.all([
      supabase
        .from("campaign_customers")
        .select("campaign_id, customer_id")
        .in("campaign_id", ids),
      supabase
        .from("call_logs")
        .select("campaign_id, customer_id, ai_intent")
        .in("campaign_id", ids),
    ])
    for (const id of ids) stats.set(id, { total: 0, called: 0, interested: 0 })
    for (const row of cust ?? []) {
      const s = stats.get(row.campaign_id)!
      s.total += 1
    }
    const calledSet = new Set<string>()
    for (const row of logs ?? []) {
      if (!row.campaign_id) continue
      const s = stats.get(row.campaign_id)
      if (!s) continue
      const key = `${row.campaign_id}::${row.customer_id}`
      if (!calledSet.has(key)) {
        s.called += 1
        calledSet.add(key)
      }
      if (row.ai_intent === "quan_tam") s.interested += 1
    }
    // Nếu chưa có campaign_customers nào nhưng đã có call_logs (như seed demo),
    // dùng số khách distinct trong call_logs làm tổng để hiển thị số liệu hợp lý.
    for (const id of ids) {
      const s = stats.get(id)!
      if (s.total === 0 && s.called > 0) s.total = s.called
    }
  }

  return (
    <div className="space-y-5 max-w-6xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Chiến dịch</h1>
          <p className="page-sub">Mỗi chiến dịch = 1 đợt AI gọi 1 danh sách khách với 1 kịch bản.</p>
        </div>
        <button className="btn-primary btn-sm">
          <Plus size={14} /> Tạo chiến dịch
        </button>
      </header>

      {!campaigns || campaigns.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-2">📣</div>
          <div className="text-lg font-semibold text-ink-1">Chưa có chiến dịch</div>
          <div className="text-base text-ink-3 mt-1">
            Tạo chiến dịch đầu tiên: chọn kịch bản + danh sách khách → bấm Bắt đầu gọi.
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {campaigns.map((c) => {
            const badge = STATUS_BADGE[c.status] ?? STATUS_BADGE.draft
            const s = stats.get(c.id) ?? { total: 0, called: 0, interested: 0 }
            const progress = s.total ? Math.round((s.called / s.total) * 100) : 0
            const scriptName = Array.isArray(c.script) ? c.script[0]?.name : (c.script as { name?: string } | null)?.name
            const started = formatDateTime(c.started_at)
            return (
              <div key={c.id} className="card p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[280px]">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-ink-1">{c.name}</h3>
                      <span className={badge.cls}>{badge.label}</span>
                    </div>
                    <div className="text-sm text-ink-3">
                      Kịch bản: <span className="text-ink-2 font-medium">{scriptName ?? "—"}</span>
                      {started && <span className="ml-3">· Bắt đầu {started}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.status === "draft" && (
                      <button className="btn-green btn-sm">
                        <Play size={13} /> Bắt đầu gọi
                      </button>
                    )}
                    {c.status === "running" && (
                      <button className="btn-ghost btn-sm">
                        <Pause size={13} /> Tạm dừng
                      </button>
                    )}
                    <button className="btn-ghost btn-sm !px-2.5">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Stat icon={Users} label="Tổng khách" value={s.total.toLocaleString()} />
                  <Stat
                    icon={Phone}
                    label="Đã gọi"
                    value={`${s.called.toLocaleString()} / ${s.total.toLocaleString()}`}
                  />
                  <Stat icon={Flame} label="Lead nóng" value={s.interested.toLocaleString()} accent="amber" />
                </div>

                {s.total > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-ink-3 mb-1.5">
                      <span>Tiến độ</span>
                      <span className="tabular-nums">{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-line-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-blue transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users
  label: string
  value: string
  accent?: "amber"
}) {
  return (
    <div className="bg-surface-2/60 rounded-[10px] p-2.5 flex items-center gap-2.5">
      <div
        className={
          accent === "amber"
            ? "w-8 h-8 rounded-[8px] flex items-center justify-center bg-warn-bg text-warn-tx"
            : "w-8 h-8 rounded-[8px] flex items-center justify-center bg-brand-blue-bg text-brand-blue-tx"
        }
      >
        <Icon size={14} strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-ink-3 leading-tight">{label}</div>
        <div className="text-md font-semibold text-ink-1 tabular-nums truncate">{value}</div>
      </div>
    </div>
  )
}
