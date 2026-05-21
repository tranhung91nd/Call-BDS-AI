"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Filter, X } from "lucide-react"

const OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "chua_goi", label: "Chưa gọi" },
  { value: "da_goi", label: "Đã gọi" },
  { value: "quan_tam", label: "Quan tâm" },
  { value: "khong_quan_tam", label: "Không quan tâm" },
  { value: "goi_lai", label: "Gọi lại sau" },
  { value: "khong_nghe", label: "Không nghe máy" },
]

export function StatusFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const current = params.get("status") ?? ""

  const apply = (next: string) => {
    const sp = new URLSearchParams(params.toString())
    if (next) sp.set("status", next)
    else sp.delete("status")
    // Reset page khi đổi filter
    sp.delete("page")
    const qs = sp.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="relative inline-flex items-center">
      <Filter
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
      />
      <select
        value={current}
        onChange={(e) => apply(e.target.value)}
        className={
          current
            ? "appearance-none pl-7 pr-8 py-1.5 text-sm bg-brand-blue-bg border border-brand-blue/40 text-brand-blue-tx font-medium rounded-[10px] outline-none focus:border-brand-blue cursor-pointer"
            : "appearance-none pl-7 pr-8 py-1.5 text-sm bg-surface-1 border border-line-2 text-ink-2 rounded-[10px] outline-none hover:bg-surface-2 cursor-pointer"
        }
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {current ? (
        <button
          type="button"
          onClick={() => apply("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-brand-blue-tx hover:bg-brand-blue/10 rounded-full"
          aria-label="Bỏ lọc"
          title="Bỏ lọc"
        >
          <X size={11} />
        </button>
      ) : (
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ink-3 pointer-events-none"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}
