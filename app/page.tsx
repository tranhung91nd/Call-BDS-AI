import { Users, Megaphone, Flame, PhoneCall } from "lucide-react"

const STATS = [
  { label: "Tổng khách hàng", value: "0", icon: Users, hint: "Chưa import" },
  { label: "Chiến dịch đang chạy", value: "0", icon: Megaphone, hint: "Tạo mới ở tab Chiến dịch" },
  { label: "Cuộc gọi hôm nay", value: "0", icon: PhoneCall, hint: "Sẽ cập nhật real-time" },
  { label: "Lead nóng cần follow", value: "0", icon: Flame, hint: "Khách quan tâm chờ Zalo" },
]

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Tổng quan</h1>
        <p className="text-sm text-slate-500">
          Dashboard quản lý chiến dịch AI gọi tự động cho khách bất động sản.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, hint }) => (
          <div
            key={label}
            className="bg-white border border-slate-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">{label}</div>
              <Icon size={18} className="text-brand" />
            </div>
            <div className="mt-2 text-3xl font-semibold">{value}</div>
            <div className="mt-1 text-xs text-slate-400">{hint}</div>
          </div>
        ))}
      </section>

      <section className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="font-semibold mb-2">Bắt đầu nhanh</h2>
        <ol className="list-decimal pl-5 text-sm space-y-1 text-slate-700">
          <li>
            Vào <span className="font-medium">Khách hàng</span> → import CSV 1.000 SĐT.
          </li>
          <li>
            Vào <span className="font-medium">Kịch bản</span> → soạn nội dung AI sẽ đọc.
          </li>
          <li>
            Vào <span className="font-medium">Chiến dịch</span> → tạo chiến dịch, chọn kịch bản + danh sách khách.
          </li>
          <li>
            Bấm <span className="font-medium">Bắt đầu gọi</span> → AI quay số tự động.
          </li>
          <li>
            Vào <span className="font-medium">Lead nóng</span> → bấm Zalo để sale chốt.
          </li>
        </ol>
      </section>
    </div>
  )
}
