import { Users, Megaphone, Flame, PhoneCall, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 0

const STEPS = [
  { i: 1, t: "Import 1.000 SĐT", d: "Tab Khách hàng → upload CSV", href: "/customers" },
  { i: 2, t: "Soạn kịch bản AI", d: "Tab Kịch bản → biến {ten} {du_an}", href: "/scripts" },
  { i: 3, t: "Tạo chiến dịch", d: "Chọn kịch bản + danh sách khách", href: "/campaigns" },
  { i: 4, t: "Bấm Bắt đầu gọi", d: "AI quay số tự động, ghi log", href: "/campaigns" },
  { i: 5, t: "Sale chốt qua Zalo", d: "Tab Lead nóng → mở Zalo deep-link", href: "/hot-leads" },
]

export default async function HomePage() {
  const supabase = createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = today.toISOString()

  const [customers, runningCamps, callsToday, hotLeads] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("campaigns").select("id", { count: "exact", head: true }).eq("status", "running"),
    supabase.from("call_logs").select("id", { count: "exact", head: true }).gte("started_at", todayIso),
    supabase.from("hot_leads").select("id", { count: "exact", head: true }),
  ])

  const fmt = (n: number | null) => (n ?? 0).toLocaleString("vi-VN")

  const KPI = [
    { label: "Tổng khách hàng", value: fmt(customers.count), icon: Users, hint: customers.count ? "Đã import vào DB" : "Chưa import danh sách" },
    { label: "Chiến dịch đang chạy", value: fmt(runningCamps.count), icon: Megaphone, hint: "Tạo mới ở tab Chiến dịch" },
    { label: "Cuộc gọi hôm nay", value: fmt(callsToday.count), icon: PhoneCall, hint: "Cập nhật real-time" },
    { label: "Lead nóng cần follow", value: fmt(hotLeads.count), icon: Flame, hint: "Khách quan tâm chờ Zalo", accent: "amber" },
  ]

  const hasData = (customers.count ?? 0) > 0

  return (
    <div className="space-y-6 max-w-6xl">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="page-title">Tổng quan</h1>
          <p className="page-sub">Dashboard quản lý chiến dịch AI gọi tự động cho khách bất động sản.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/campaigns" className="btn-ghost btn-sm">
            <Megaphone size={14} /> Chiến dịch
          </Link>
          <Link href="/customers" className="btn-primary btn-sm">
            <Sparkles size={14} /> Bắt đầu nhanh
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {KPI.map(({ label, value, icon: Icon, hint, accent }) => (
          <div key={label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className="kpi-label">{label}</div>
              <div
                className={
                  accent === "amber"
                    ? "w-8 h-8 rounded-[10px] flex items-center justify-center bg-warn-bg text-warn-tx"
                    : "w-8 h-8 rounded-[10px] flex items-center justify-center bg-brand-blue-bg text-brand-blue-tx"
                }
              >
                <Icon size={16} strokeWidth={1.8} />
              </div>
            </div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-note">{hint}</div>
          </div>
        ))}
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Bắt đầu nhanh</h2>
          <span className="text-xs text-ink-3">5 bước</span>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
          {STEPS.map(({ i, t, d, href }) => (
            <Link
              key={i}
              href={href}
              className="group relative p-3 rounded-[12px] bg-surface-2 border border-line-1 hover:border-brand-blue hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center">
                  {i}
                </div>
                <ArrowRight
                  size={14}
                  className="text-ink-3 group-hover:text-brand-blue-tx transition-colors"
                />
              </div>
              <div className="text-base font-semibold text-ink-1">{t}</div>
              <div className="text-xs text-ink-3 mt-1">{d}</div>
            </Link>
          ))}
        </ol>
      </section>

      {!hasData && (
        <section className="card p-6 text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-lg font-semibold text-ink-1">Chưa có dữ liệu</div>
          <div className="text-base text-ink-3 mt-1 mb-4">
            Chạy SQL migration 0002 trên Supabase để có 5 khách + 2 lead nóng mẫu, hoặc Import CSV để bắt đầu.
          </div>
          <Link href="/customers" className="btn-primary btn-sm inline-flex">
            <Users size={14} /> Import danh sách khách
          </Link>
        </section>
      )}
    </div>
  )
}
