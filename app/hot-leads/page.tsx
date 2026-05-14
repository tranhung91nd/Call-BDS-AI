import { MessageCircle, Headphones, Check } from "lucide-react"
import { formatPhone, zaloDeepLink } from "@/lib/utils"

const MOCK = [
  {
    id: "2",
    phone: "0987654321",
    name: "Trần Thị B",
    project: "Masteri Centre Point",
    last_contact_at: "2026-05-14 10:23",
    transcript: "Khách hỏi giá căn 2 phòng ngủ view sông, muốn được tư vấn thêm qua Zalo.",
  },
  {
    id: "5",
    phone: "0934567890",
    name: "Phạm Văn D",
    project: "Vinhomes Ocean Park",
    last_contact_at: "2026-05-14 09:48",
    transcript: "Đang tìm căn 3PN ở khu Lumière, hẹn 14h gọi lại cũng được nhưng prefer Zalo.",
  },
] as const

export default function HotLeadsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          Lead nóng
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
            {MOCK.length} cần follow
          </span>
        </h1>
        <p className="text-sm text-slate-500">
          Khách đã được AI xác định là <span className="font-medium">quan tâm</span> — sale mở Zalo chốt trực tiếp.
        </p>
      </header>

      <div className="grid gap-3">
        {MOCK.map((lead) => (
          <div
            key={lead.id}
            className="bg-white border border-slate-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{lead.name}</span>
                  <span className="font-mono text-sm text-slate-500">{formatPhone(lead.phone)}</span>
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Quan tâm: <span className="font-medium">{lead.project}</span> · {lead.last_contact_at}
                </div>
                <div className="text-sm text-slate-700 mt-2 italic">
                  &ldquo;{lead.transcript}&rdquo;
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <a
                  href={zaloDeepLink(lead.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <MessageCircle size={14} /> Mở Zalo
                </a>
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-slate-300 bg-white hover:bg-slate-50">
                  <Headphones size={14} /> Nghe ghi âm
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-slate-300 bg-white hover:bg-slate-50">
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
