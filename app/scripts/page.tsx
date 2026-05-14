import { Plus, FileText, Copy, Edit2, Mic } from "lucide-react"

const SAMPLE = `Xin chào anh/chị {ten}, em là trợ lý ảo của công ty BĐS XYZ.

Em được biết anh/chị từng quan tâm đến dự án {du_an}. Hiện bên em đang có chính sách ưu đãi đặc biệt: chiết khấu lên tới 8%, ân hạn gốc 24 tháng.

Anh/chị có muốn em kết nối chuyên viên tư vấn gửi thông tin chi tiết qua Zalo không ạ?`

const SCRIPTS = [
  { id: "1", name: "Mời tư vấn Vinhomes Ocean Park", voice: "Nữ Bắc - HàMy", used: 1, last: "Hôm nay" },
  { id: "2", name: "Mời tư vấn Masteri Centre Point", voice: "Nam Bắc - Minh", used: 0, last: "—" },
  { id: "3", name: "Chăm khách cũ - remarketing", voice: "Nữ Nam - Linh", used: 1, last: "20/04/2026" },
]

export default function ScriptsPage() {
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

      {/* Script list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {SCRIPTS.map((s) => (
          <div key={s.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 shrink-0 rounded-[10px] bg-brand-blue-bg text-brand-blue-tx flex items-center justify-center">
                <FileText size={16} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base text-ink-1 leading-tight">{s.name}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-ink-3">
                  <Mic size={11} /> {s.voice}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-ink-3 pt-3 border-t border-line-1">
              <span>
                Dùng <span className="text-ink-1 font-semibold">{s.used}</span> chiến dịch
              </span>
              <span>Lần cuối: {s.last}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sample preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="section-title">Mẫu — Mời tư vấn dự án BĐS</h3>
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
{SAMPLE}
        </pre>
      </div>
    </div>
  )
}
