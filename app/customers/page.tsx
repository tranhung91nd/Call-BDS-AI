import { Upload, Plus, Search, Filter, Phone } from "lucide-react"
import { formatPhone } from "@/lib/utils"

const MOCK = [
  { id: "1", phone: "0912345678", name: "Nguyễn Văn A", project: "Vinhomes Ocean Park", status: "chua_goi", source: "Lead form FB" },
  { id: "2", phone: "0987654321", name: "Trần Thị B", project: "Masteri Centre Point", status: "quan_tam", source: "Lead form FB" },
  { id: "3", phone: "0901112223", name: "Lê Văn C", project: "Vinhomes Ocean Park", status: "khong_nghe", source: "Sự kiện 04/2026" },
  { id: "4", phone: "0922334455", name: "Phạm Thị D", project: "Lumi Hà Nội", status: "goi_lai", source: "Lead form FB" },
  { id: "5", phone: "0934567890", name: "Hoàng Văn E", project: "Vinhomes Ocean Park", status: "quan_tam", source: "Landing page" },
  { id: "6", phone: "0945678901", name: "Vũ Thị F", project: "Masteri Centre Point", status: "khong_quan_tam", source: "Lead form FB" },
] as const

const STATUS_BADGE: Record<string, string> = {
  chua_goi: "b-gray",
  da_goi: "b-blue",
  quan_tam: "b-green",
  khong_quan_tam: "b-red",
  goi_lai: "b-amber",
  khong_nghe: "b-purple",
}

const STATUS_LABEL: Record<string, string> = {
  chua_goi: "Chưa gọi",
  da_goi: "Đã gọi",
  quan_tam: "Quan tâm",
  khong_quan_tam: "Không quan tâm",
  goi_lai: "Gọi lại sau",
  khong_nghe: "Không nghe máy",
}

export default function CustomersPage() {
  return (
    <div className="space-y-5 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Khách hàng</h1>
          <p className="page-sub">Quản lý danh sách khách BĐS có SĐT để AI gọi.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost btn-sm">
            <Upload size={14} /> Import CSV
          </button>
          <button className="btn-primary btn-sm">
            <Plus size={14} /> Thêm khách
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="card p-3 flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            placeholder="Tìm theo SĐT hoặc tên..."
            className="w-full pl-9 pr-3 py-2 text-base bg-surface-2 border border-line-2 rounded-[10px] outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        <button className="btn-ghost btn-sm">
          <Filter size={14} /> Trạng thái
        </button>
        <button className="btn-ghost btn-sm">
          <Filter size={14} /> Dự án
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line-2 bg-surface-2/40">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">SĐT</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Tên khách</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Dự án quan tâm</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Nguồn</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK.map((c) => (
                <tr key={c.id} className="border-b border-line-1 last:border-0 hover:bg-surface-2/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-base tabular-nums text-ink-1">{formatPhone(c.phone)}</td>
                  <td className="px-4 py-3 text-base text-ink-1 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-base text-ink-2">{c.project}</td>
                  <td className="px-4 py-3 text-sm text-ink-3">{c.source}</td>
                  <td className="px-4 py-3">
                    <span className={STATUS_BADGE[c.status]}>{STATUS_LABEL[c.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center gap-1.5 text-brand-blue-tx hover:underline text-sm font-medium">
                      <Phone size={12} /> Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 text-xs text-ink-hint bg-surface-2/40 border-t border-line-1">
          Dữ liệu mẫu — sau khi kết nối Supabase + import CSV sẽ thay bằng data thật.
        </div>
      </div>
    </div>
  )
}
