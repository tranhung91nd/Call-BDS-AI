import { Plus, Play, Pause, MoreHorizontal, Users, Phone, Flame } from "lucide-react"

const MOCK = [
  {
    id: "1",
    name: "Đợt 1 - Vinhomes Ocean Park",
    script: "Mời tư vấn Vinhomes",
    status: "running",
    total: 250,
    called: 87,
    interested: 12,
    started: "14/05/2026 09:00",
  },
  {
    id: "2",
    name: "Đợt 2 - Masteri Centre Point",
    script: "Mời tư vấn Masteri",
    status: "draft",
    total: 180,
    called: 0,
    interested: 0,
    started: null,
  },
  {
    id: "3",
    name: "Đợt remarketing Q1/2026",
    script: "Chăm khách cũ",
    status: "done",
    total: 540,
    called: 540,
    interested: 38,
    started: "01/04/2026 10:00",
  },
]

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  draft: { cls: "b-gray", label: "Nháp" },
  running: { cls: "b-green", label: "Đang chạy" },
  paused: { cls: "b-amber", label: "Tạm dừng" },
  done: { cls: "b-blue", label: "Hoàn tất" },
}

export default function CampaignsPage() {
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

      <div className="grid gap-3">
        {MOCK.map((c) => {
          const badge = STATUS_BADGE[c.status]
          const progress = c.total ? Math.round((c.called / c.total) * 100) : 0
          return (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-ink-1">{c.name}</h3>
                    <span className={badge.cls}>{badge.label}</span>
                  </div>
                  <div className="text-sm text-ink-3">
                    Kịch bản: <span className="text-ink-2 font-medium">{c.script}</span>
                    {c.started && <span className="ml-3">· Bắt đầu {c.started}</span>}
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

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Stat icon={Users} label="Tổng khách" value={c.total.toLocaleString()} />
                <Stat icon={Phone} label="Đã gọi" value={`${c.called.toLocaleString()} / ${c.total.toLocaleString()}`} />
                <Stat icon={Flame} label="Lead nóng" value={c.interested.toLocaleString()} accent="amber" />
              </div>

              {/* Progress */}
              {c.total > 0 && (
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
