const METRICS = [
  { label: "Tổng cuộc gọi", value: "0", sub: "Trong 30 ngày qua" },
  { label: "Tỷ lệ kết nối", value: "0%", sub: "Khách bắt máy / tổng gọi" },
  { label: "Tỷ lệ quan tâm", value: "0%", sub: "Lead nóng / kết nối thành công" },
  { label: "Chi phí / lead nóng", value: "0đ", sub: "VBee bill / số lead quan tâm" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Báo cáo</h1>
        <p className="text-sm text-slate-500">
          Hiệu suất chiến dịch AI gọi tự động.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500">{m.label}</div>
            <div className="mt-2 text-3xl font-semibold">{m.value}</div>
            <div className="mt-1 text-xs text-slate-400">{m.sub}</div>
          </div>
        ))}
      </section>

      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="text-sm text-slate-500">
          Biểu đồ chi tiết sẽ hiện ở đây sau khi có dữ liệu thật từ Supabase.
        </div>
      </section>
    </div>
  )
}
