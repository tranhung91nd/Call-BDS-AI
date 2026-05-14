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
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/customers", label: "Khách hàng", icon: Users },
  { href: "/campaigns", label: "Chiến dịch", icon: Megaphone },
  { href: "/scripts", label: "Kịch bản", icon: FileText },
  { href: "/hot-leads", label: "Lead nóng", icon: Flame },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white">
      <div className="p-4 border-b border-slate-200">
        <div className="font-semibold text-lg">BDS AI Call</div>
        <div className="text-xs text-slate-500">CRM gọi tự động</div>
      </div>
      <nav className="p-2 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                active
                  ? "bg-brand text-white"
                  : "text-slate-700 hover:bg-slate-100",
              )}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
