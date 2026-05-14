import { Plus, Play } from "lucide-react"

const MOCK = [
  { id: "1", name: "Đợt 1 - Vinhomes Ocean Park", status: "draft", customers: 0, called: 0 },
] as const

const STATUS_LABEL: Record<string, string> = {
  draft: "Nháp",
  running: "Đang chạy",
  paused: "Tạm dừng",
  done: "Hoàn tất",
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Chiến dịch</h1>
          <p className="text-sm text-slate-500">
            Mỗi chiến dịch = 1 đợt AI gọi 1 danh sách khách với 1 kịch bản.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-brand text-white hover:bg-brand-dark">
          <Plus size={16} /> Tạo chiến dịch
        </button>
      </header>

      <div className="grid gap-4">
        {MOCK.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-slate-500 mt-1">
                {c.customers} khách · đã gọi {c.called} ·{" "}
                <span className="font-medium">{STATUS_LABEL[c.status]}</span>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
              <Play size={14} /> Bắt đầu gọi
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
