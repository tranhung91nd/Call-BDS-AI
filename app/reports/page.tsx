import { Phone, PhoneCall, Flame, DollarSign, TrendingUp, BarChart3 } from "lucide-react"

const KPI = [
  { label: "Tổng cuộc gọi", value: "0", sub: "30 ngày qua", icon: PhoneCall, accent: "blue" },
  { label: "Tỷ lệ kết nối", value: "0%", sub: "Bắt máy / tổng gọi", icon: Phone, accent: "green" },
  { label: "Tỷ lệ quan tâm", value: "0%", sub: "Lead nóng / kết nối", icon: Flame, accent: "amber" },
  { label: "Chi phí / lead", value: "0đ", sub: "VBee bill / lead nóng", icon: DollarSign, accent: "purple" },
]

const ACCENT: Record<string, string> = {
  blue: "bg-brand-blue-bg text-brand-blue-tx",
  green: "bg-ok-bg text-ok-tx",
  amber: "bg-warn-bg text-warn-tx",
  purple: "bg-purple-bg text-purple-tx",
}

export default function ReportsPage() {
  return (
    <div className="space-y-5 max-w-6xl">
      <header>
        <h1 className="page-title">Báo cáo</h1>
        <p className="page-sub">Hiệu suất chiến dịch AI gọi tự động.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {KPI.map(({ label, value, sub, icon: Icon, accent }) => (
          <div key={label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className="kpi-label">{label}</div>
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${ACCENT[accent]}`}>
                <Icon size={16} strokeWidth={1.8} />
              </div>
            </div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-note">{sub}</div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-blue" />
              Xu hướng kết nối 30 ngày
            </h3>
            <span className="badge b-gray text-xs">Chưa có data</span>
          </div>
          <div className="h-48 bg-surface-2/60 border border-dashed border-line-2 rounded-[12px] flex items-center justify-center text-ink-3 text-base">
            Biểu đồ sẽ hiện sau khi chạy chiến dịch đầu tiên
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title flex items-center gap-2">
              <BarChart3 size={16} className="text-brand-blue" />
              So sánh kịch bản (A/B)
            </h3>
            <span className="badge b-gray text-xs">Chưa có data</span>
          </div>
          <div className="h-48 bg-surface-2/60 border border-dashed border-line-2 rounded-[12px] flex items-center justify-center text-ink-3 text-base">
            Test ít nhất 2 kịch bản trên cùng segment để thấy chênh lệch
          </div>
        </section>
      </div>
    </div>
  )
}
