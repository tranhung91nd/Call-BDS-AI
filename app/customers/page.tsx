import Link from "next/link"
import { Upload, Search, Filter, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
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

const PAGE_SIZE = 100

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = createClient()
  const SELECT_COLS =
    "id, phone, phone_secondary, name, address, email, project_interest, source, status, notes, created_at"

  const page = Math.max(1, Number(searchParams.page) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: customers, error, count } = await supabase
    .from("customers")
    .select(SELECT_COLS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  const rows = (customers ?? []) as Pick<
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
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  return (
    <div className="space-y-5 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Khách hàng</h1>
          <p className="page-sub">
            Quản lý danh sách khách BĐS có SĐT để AI gọi.{" "}
            {error
              ? "(lỗi tải data)"
              : `Tổng ${totalCount.toLocaleString("vi-VN")} khách · Trang ${currentPage}/${totalPages}.`}
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
                      <td className="px-3 py-3 text-sm text-ink-3 tabular-nums">{from + idx + 1}</td>
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
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} pageSize={PAGE_SIZE} from={from} shown={rows.length} />
        )}
      </div>
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  from,
  shown,
}: {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  from: number
  shown: number
}) {
  const pages = buildPageList(currentPage, totalPages)
  const showStart = from + 1
  const showEnd = from + shown
  return (
    <div className="border-t border-line-1 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
      <div className="text-xs text-ink-3 tabular-nums">
        Hiển thị <span className="text-ink-1 font-semibold">{showStart.toLocaleString("vi-VN")}–{showEnd.toLocaleString("vi-VN")}</span>{" "}
        / {totalCount.toLocaleString("vi-VN")} khách
      </div>
      <nav className="flex items-center gap-1 flex-wrap">
        <PageLink page={currentPage - 1} disabled={currentPage <= 1} label="Trước" icon="prev" />
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`gap-${idx}`} className="px-2 text-ink-3 text-sm">
              …
            </span>
          ) : (
            <PageLink key={p} page={p} active={p === currentPage} label={String(p)} />
          ),
        )}
        <PageLink page={currentPage + 1} disabled={currentPage >= totalPages} label="Sau" icon="next" />
      </nav>
    </div>
  )
}

function PageLink({
  page,
  label,
  active,
  disabled,
  icon,
}: {
  page: number
  label: string
  active?: boolean
  disabled?: boolean
  icon?: "prev" | "next"
}) {
  const base =
    "inline-flex items-center justify-center min-w-[34px] h-8 px-2.5 rounded-[8px] text-sm font-medium transition-colors tabular-nums"
  if (disabled) {
    return (
      <span className={`${base} text-ink-hint border border-line-1 opacity-50 cursor-not-allowed select-none`}>
        {icon === "prev" && <ChevronLeft size={14} className="mr-0.5" />}
        {label}
        {icon === "next" && <ChevronRight size={14} className="ml-0.5" />}
      </span>
    )
  }
  return (
    <Link
      href={`/customers?page=${page}`}
      className={
        active
          ? `${base} bg-brand-blue text-white shadow-sm`
          : `${base} text-ink-2 border border-line-2 bg-surface-1 hover:bg-surface-2 hover:text-ink-1`
      }
      aria-current={active ? "page" : undefined}
    >
      {icon === "prev" && <ChevronLeft size={14} className="mr-0.5" />}
      {label}
      {icon === "next" && <ChevronRight size={14} className="ml-0.5" />}
    </Link>
  )
}

// Sinh list các số trang để render: luôn show trang đầu, cuối, hiện tại ± 1, các trang khác là "…"
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const out: (number | "…")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) out.push("…")
  for (let p = start; p <= end; p++) out.push(p)
  if (end < total - 1) out.push("…")
  out.push(total)
  return out
}
