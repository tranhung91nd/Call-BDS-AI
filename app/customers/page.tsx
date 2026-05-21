import { Upload, Search, Filter, AlertTriangle } from "lucide-react"
import { formatPhone, detectPhoneError } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import type { Customer } from "@/lib/types"
import { AddCustomerButton, EditCustomerButton } from "@/components/customer-actions"

export const revalidate = 0

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

export default async function CustomersPage() {
  const supabase = createClient()
  const SELECT_COLS =
    "id, phone, phone_secondary, name, address, email, project_interest, source, status, notes, created_at"

  // PostgREST default max-rows = 1000. Fetch theo batch để lấy đủ data hiện tại (~2k row).
  const PAGE_SIZE = 1000
  const MAX_PAGES = 5 // hard cap an toàn (5k row), pha sau làm pagination thật
  const first = await supabase
    .from("customers")
    .select(SELECT_COLS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1)

  let customers = first.data ?? []
  const error = first.error
  const count = first.count
  if (!error && count && customers.length < count) {
    const totalPages = Math.min(MAX_PAGES, Math.ceil(count / PAGE_SIZE))
    const restRanges: [number, number][] = []
    for (let p = 1; p < totalPages; p++) {
      restRanges.push([p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE - 1])
    }
    const rest = await Promise.all(
      restRanges.map(([from, to]) =>
        supabase
          .from("customers")
          .select(SELECT_COLS)
          .order("created_at", { ascending: false })
          .range(from, to),
      ),
    )
    for (const r of rest) {
      if (r.data) customers = customers.concat(r.data)
    }
  }

  const rows = customers as Pick<
    Customer,
    | "id"
    | "phone"
    | "phone_secondary"
    | "name"
    | "address"
    | "email"
    | "project_interest"
    | "source"
    | "status"
    | "notes"
  >[]
  const totalCount = count ?? rows.length

  return (
    <div className="space-y-5 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Khách hàng</h1>
          <p className="page-sub">
            Quản lý danh sách khách BĐS có SĐT để AI gọi.{" "}
            {error
              ? "(lỗi tải data)"
              : totalCount > rows.length
                ? `Hiện có ${totalCount.toLocaleString("vi-VN")} khách — hiển thị ${rows.length.toLocaleString("vi-VN")} dòng đầu.`
                : `Hiện có ${totalCount.toLocaleString("vi-VN")} khách.`}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost btn-sm" disabled title="Sẽ làm ở pha tiếp theo">
            <Upload size={14} /> Import CSV
          </button>
          <AddCustomerButton />
        </div>
      </header>

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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line-2 bg-surface-2/40">
                <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-ink-1 w-14">STT</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Tên khách</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">SĐT</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1 min-w-[220px]">Địa chỉ</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Email</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Dự án quan tâm</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1 min-w-[200px]">Ghi chú</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-ink-3 text-base">
                    {error ? `Lỗi: ${error.message}` : "Chưa có khách nào — chạy SQL seed 0002 hoặc Import CSV để thêm."}
                  </td>
                </tr>
              ) : (
                rows.map((c, idx) => {
                  const err = detectPhoneError(c.notes)
                  return (
                    <tr
                      key={c.id}
                      className={
                        err.isError
                          ? "border-b border-danger/30 last:border-0 bg-danger-bg/40 hover:bg-danger-bg/60 transition-colors"
                          : "border-b border-line-1 last:border-0 hover:bg-surface-2/60 transition-colors"
                      }
                    >
                      <td className="px-3 py-3 text-sm text-ink-3 tabular-nums">{idx + 1}</td>
                      <td className="px-4 py-3 text-base text-ink-1 font-medium">
                        {c.name || <span className="text-ink-hint">—</span>}
                      </td>
                      <td
                        className={
                          err.isError
                            ? "px-4 py-3 text-base tabular-nums tracking-tight"
                            : "px-4 py-3 text-base tabular-nums tracking-tight"
                        }
                        title={err.isError ? c.phone : undefined}
                      >
                        <div className={err.isError ? "text-danger-tx font-semibold" : "text-ink-1 font-medium"}>
                          {err.isError ? c.phone : formatPhone(c.phone)}
                        </div>
                        {c.phone_secondary && (
                          <div className="text-xs text-ink-3 mt-0.5 flex items-center gap-1">
                            <span className="text-ink-hint">+</span>
                            {formatPhone(c.phone_secondary)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-2 max-w-[280px]">
                        {c.address ? (
                          <span className="line-clamp-2" title={c.address}>
                            {c.address}
                          </span>
                        ) : (
                          <span className="text-ink-hint">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-2">
                        {c.email ? (
                          <span className="truncate block max-w-[180px]" title={c.email}>
                            {c.email}
                          </span>
                        ) : (
                          <span className="text-ink-hint">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-base text-ink-2">
                        {c.project_interest || <span className="text-ink-hint">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={STATUS_BADGE[c.status] ?? "b-gray"}>
                          {STATUS_LABEL[c.status] ?? c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm max-w-[280px]">
                        {err.isError ? (
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[8px] bg-danger text-white text-xs font-semibold">
                              <AlertTriangle size={11} strokeWidth={2.2} />
                              LỖI SĐT
                            </div>
                            <div
                              className="text-danger-tx font-medium line-clamp-2"
                              title={err.errorMsg ?? undefined}
                            >
                              {err.errorMsg}
                            </div>
                            {err.cleanNote && (
                              <div className="text-ink-3 line-clamp-2" title={err.cleanNote}>
                                {err.cleanNote}
                              </div>
                            )}
                          </div>
                        ) : c.notes ? (
                          <span className="text-ink-2 line-clamp-2" title={c.notes}>
                            {c.notes}
                          </span>
                        ) : (
                          <span className="text-ink-hint">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <EditCustomerButton customer={c} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
