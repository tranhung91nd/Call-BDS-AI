"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Megaphone,
  FileText,
  Flame,
  BarChart3,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/customers", label: "Khách hàng", icon: Users, badge: "1.000" },
  { href: "/campaigns", label: "Chiến dịch", icon: Megaphone },
  { href: "/scripts", label: "Kịch bản", icon: FileText },
  { href: "/hot-leads", label: "Lead nóng", icon: Flame, badge: "2", alert: true },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside
      className="sticky top-0 h-screen w-60 shrink-0 flex flex-col overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRight: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "inset -1px 0 0 rgba(255,255,255,0.65)",
      }}
    >
      {/* Header — logo + brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-line-1 min-h-[62px]">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-[10px] text-white font-bold text-base tracking-wider shadow-logo"
          style={{ background: "linear-gradient(135deg,#4F7BF7 0%,#5B5DEE 100%)" }}
        >
          BD
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className="font-semibold text-md text-ink-1 truncate">BDS AI Call</div>
          <div className="text-xs text-ink-3 truncate">CRM gọi tự động</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <div className="px-[18px] pb-1 pt-2 text-[10.5px] font-semibold tracking-wider uppercase text-ink-3">
          Workspace
        </div>
        {NAV.map(({ href, label, icon: Icon, badge, alert }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative mx-3 my-[2px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] text-base font-medium transition-all duration-150",
                active
                  ? "text-brand-blue-tx shadow-nav-active"
                  : "text-ink-2 hover:bg-[rgba(37,99,235,0.06)] hover:text-ink-1",
              )}
              style={
                active
                  ? { background: "linear-gradient(180deg,#f8fbff 0%,#edf4ff 100%)" }
                  : undefined
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              <span className="flex-1 truncate">{label}</span>
              {badge && (
                <span
                  className={cn(
                    "shrink-0 px-2 py-[1px] text-[10px] font-semibold rounded-full leading-[1.4] tabular-nums",
                    alert
                      ? "bg-danger-bg text-danger-tx"
                      : "bg-brand-blue-bg text-brand-blue-tx",
                  )}
                >
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer — user */}
      <div className="border-t border-line-1 p-3 bg-surface-2/60">
        <div className="flex items-center gap-2.5 p-2 rounded-[10px]">
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue-bg text-brand-blue-tx font-semibold text-xs">
            TH
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="text-sm font-medium text-ink-1 truncate">Trần Hùng</div>
            <div className="flex items-center gap-1.5 text-[10px] text-ink-3 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-ok" />
              <span>Online</span>
              <span className="ml-1 px-1.5 py-[1px] rounded bg-danger-bg text-danger-tx font-semibold tracking-wider uppercase text-[9px]">
                Admin
              </span>
            </div>
          </div>
        </div>
        <button className="mt-1.5 w-full px-3 py-2 text-sm flex items-center justify-center gap-2 bg-surface-1 border border-line-1 rounded-[8px] text-ink-2 hover:bg-danger-bg hover:text-danger-tx hover:border-danger transition-all">
          <LogOut size={13} />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
