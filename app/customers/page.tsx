import Link from "next/link"
import { Upload, Search, Filter, ChevronLeft, ChevronRight, Mail } from "lucide-react"
import { detectPhoneError } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import type { Customer } from "@/lib/types"
import { AddCustomerButton, EditCustomerButton } from "@/components/customer-actions"
import { EditableCell } from "@/components/editable-cell"
import { StatusFilter } from "@/components/status-filter"

const VALID_STATUSES = new Set([
  "chua_goi",
  "da_goi",
  "quan_tam",
  "khong_quan_tam",
  "goi_lai",
  "khong_nghe",
])

export const revalidate = 0

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "chua_goi", label: "Chưa gọi" },
  { value: "da_goi", label: "Đã gọi" },
  { value: "quan_tam", label: "Quan tâm" },
  { value: "khong_quan_tam", label: "Không quan tâm" },
  { value: "goi_lai", label: "Gọi lại sau" },
  { value: "khong_nghe", label: "Không nghe máy" },
]
const STATUS_LABEL_MAP: Record<string, string> = Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]))

const PAGE_SIZE = 100

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string }
}) {
  const supabase = createClient()
  const SELECT_COLS =
    "id, phone, phone_secondary, name, address, email, project_interest, source, status, notes, created_at"

  const page = Math.max(1, Number(searchParams.page) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const statusFilter = searchParams.status && VALID_STATUSES.has(searchParams.status) ? searchParams.status : null

  let query = supabase
    .from("customers")
    .select(SELECT_COLS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)
  if (statusFilter) query = query.eq("status", statusFilter)

  const { data: customers, error, count } = await query

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
              : statusFilter
                ? `Lọc theo ${STATUS_LABEL_MAP[statusFilter] ?? statusFilter}: ${totalCount.toLocaleString("vi-VN")} khách · Trang ${currentPage}/${totalPages}.`
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
        <StatusFilter />
        <button className="btn-ghost btn-sm" disabled title="Sẽ làm sau">
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
                <th className="text-center px-2 py-3 text-xs font-bold uppercase tracking-wider text-ink-1 w-12">@</th>
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
                        <EditableCell
                          rowId={c.id}
                          field="name"
                          value={c.name}
                          placeholder="Nguyễn Văn A"
                        />
                      </td>
                      <td className="px-4 py-3 text-base tabular-nums tracking-tight" title={err.isError ? c.phone : undefined}>
                        <EditableCell
                          rowId={c.id}
                          field="phone"
                          value={c.phone}
                          placeholder="0912 345 678"
                          type="tel"
                          className={err.isError ? "text-danger-tx font-semibold" : "text-ink-1 font-medium"}
                          formatAs={err.isError ? undefined : "phone"}
                        />
                        <div className="text-xs text-ink-3 mt-0.5 flex items-center gap-1">
                          <span className="text-ink-hint">+</span>
                          <EditableCell
                            rowId={c.id}
                            field="phone_secondary"
                            value={c.phone_secondary}
                            placeholder="0922 666 636"
                            emptyLabel="thêm SĐT phụ"
                            type="tel"
                            formatAs="phone"
                            className="text-ink-3"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-2 max-w-[280px]">
                        <EditableCell
                          rowId={c.id}
                          field="address"
                          value={c.address}
                          placeholder="Số nhà, đường, quận, thành phố"
                        />
                      </td>
                      <td className="px-2 py-3 text-center w-12">
                        {c.email ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-blue-bg text-brand-blue-tx cursor-help"
                            title={c.email}
                          >
                            <Mail size={13} strokeWidth={2} />
                          </span>
                        ) : (
                          <span className="text-ink-hint" title="Chưa có email">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-base text-ink-2">
                        <EditableCell
                          rowId={c.id}
                          field="project_interest"
                          value={c.project_interest}
                          placeholder="Royal City"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <EditableCell
                          rowId={c.id}
                          field="status"
                          value={c.status}
                          options={STATUS_OPTIONS}
                          renderAs="status-badge"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm max-w-[280px]">
                        <EditableCell
                          rowId={c.id}
                          field="notes"
                          value={c.notes}
                          placeholder="Ghi chú nội bộ — sale tự nhập..."
                          multiline
                          renderAs="notes-with-error"
                        />
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            from={from}
            shown={rows.length}
            statusFilter={statusFilter}
          />
        )}
      </div>
    </div>
  )
}

function buildPageHref(page: number, statusFilter: string | null) {
  const sp = new URLSearchParams()
  sp.set("page", String(page))
  if (statusFilter) sp.set("status", statusFilter)
  return `/customers?${sp.toString()}`
}

function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  from,
  shown,
  statusFilter,
}: {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
  from: number
  shown: number
  statusFilter: string | null
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
        <PageLink href={buildPageHref(currentPage - 1, statusFilter)} disabled={currentPage <= 1} label="Trước" icon="prev" />
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`gap-${idx}`} className="px-2 text-ink-3 text-sm">
              …
            </span>
          ) : (
            <PageLink key={p} href={buildPageHref(p, statusFilter)} active={p === currentPage} label={String(p)} />
          ),
        )}
        <PageLink href={buildPageHref(currentPage + 1, statusFilter)} disabled={currentPage >= totalPages} label="Sau" icon="next" />
      </nav>
    </div>
  )
}

function PageLink({
  href,
  label,
  active,
  disabled,
  icon,
}: {
  href: string
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
      href={href}
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
