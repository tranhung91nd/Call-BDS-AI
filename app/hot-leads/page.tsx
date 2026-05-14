import { MessageCircle, Headphones, Check, Flame, Phone, Clock } from "lucide-react"
import { formatPhone, zaloDeepLink } from "@/lib/utils"

const MOCK = [
  {
    id: "2",
    phone: "0987654321",
    name: "Trần Thị B",
    project: "Masteri Centre Point",
    last_contact_at: "14/05/2026 10:23",
    duration: "1:47",
    transcript: "Khách hỏi giá căn 2 phòng ngủ view sông, muốn được tư vấn thêm qua Zalo.",
    priority: "hot",
  },
  {
    id: "5",
    phone: "0934567890",
    name: "Phạm Văn D",
    project: "Vinhomes Ocean Park",
    last_contact_at: "14/05/2026 09:48",
    duration: "2:12",
    transcript: "Đang tìm căn 3PN ở khu Lumière, hẹn 14h gọi lại cũng được nhưng prefer Zalo.",
    priority: "hot",
  },
  {
    id: "8",
    phone: "0967123456",
    name: "Lê Thị G",
    project: "Vinhomes Ocean Park",
    last_contact_at: "14/05/2026 08:30",
    duration: "1:24",
    transcript: "Quan tâm chính sách thanh toán dài hạn, muốn nhận bảng giá chi tiết.",
    priority: "warm",
  },
] as const

const PRIO_BG: Record<string, string> = {
  hot: "bg-warn-bg text-warn-tx",
  warm: "bg-brand-blue-bg text-brand-blue-tx",
}

const PRIO_LABEL: Record<string, string> = {
  hot: "Rất quan tâm",
  warm: "Có quan tâm",
}

export default function HotLeadsPage() {
  return (
    <div className="space-y-5 max-w-5xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Flame size={20} className="text-warn" />
            Lead nóng
            <span className="badge bg-warn-bg text-warn-tx text-xs ml-1">{MOCK.length} cần follow</span>
          </h1>
          <p className="page-sub">
            Khách đã được AI xác định là <span className="font-semibold text-ink-2">quan tâm</span> — sale mở Zalo chốt trực tiếp.
          </p>
        </div>
      </header>

      <div className="grid gap-3">
        {MOCK.map((lead) => (
          <div key={lead.id} className="card p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[280px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-ink-1">{lead.name}</h3>
                  <span className="font-mono text-base text-ink-2 tabular-nums">
                    {formatPhone(lead.phone)}
                  </span>
                  <span className={`badge ${PRIO_BG[lead.priority]} text-xs`}>{PRIO_LABEL[lead.priority]}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="text-ink-2 font-medium">Dự án:</span> {lead.project}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {lead.last_contact_at}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> {lead.duration}
                  </span>
                </div>
                <div className="mt-3 p-3 bg-surface-2/60 border border-line-1 rounded-[10px] text-base text-ink-2 italic leading-relaxed">
                  <span className="text-ink-3 not-italic mr-1.5">💬</span>
                  &ldquo;{lead.transcript}&rdquo;
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0 min-w-[150px]">
                <a
                  href={zaloDeepLink(lead.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary btn-sm justify-center"
                  style={{ background: "#0068ff" }}
                >
                  <MessageCircle size={14} /> Mở Zalo
                </a>
                <button className="btn-ghost btn-sm justify-center">
                  <Headphones size={14} /> Nghe ghi âm
                </button>
                <button className="btn-ghost btn-sm justify-center">
                  <Check size={14} /> Đã chăm
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
