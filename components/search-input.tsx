"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search, X } from "lucide-react"

export function SearchInput() {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const initialQ = params.get("q") ?? ""
  const [value, setValue] = useState(initialQ)

  // Đồng bộ khi URL đổi (nhấn back/forward)
  useEffect(() => {
    setValue(params.get("q") ?? "")
  }, [params])

  // Debounce: 300ms sau khi gõ → push URL mới
  useEffect(() => {
    const current = params.get("q") ?? ""
    const next = value.trim()
    if (next === current) return
    const t = setTimeout(() => {
      const sp = new URLSearchParams(params.toString())
      if (next) sp.set("q", next)
      else sp.delete("q")
      sp.delete("page")
      const qs = sp.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative flex-1 min-w-[220px]">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm theo tên, SĐT, email, địa chỉ..."
        className="w-full pl-9 pr-9 py-2 text-base bg-surface-2 border border-line-2 rounded-[10px] outline-none focus:border-brand-blue focus:bg-surface-1 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-ink-3 hover:bg-surface-3 hover:text-ink-1"
          aria-label="Xoá tìm kiếm"
          title="Xoá"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
