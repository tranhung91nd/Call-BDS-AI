import { Upload, Search, Filter } from "lucide-react"
import { formatPhone } from "@/lib/utils"
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
  const { data: customers, error } = await supabase
    .from("customers")
    .select("id, phone, name, project_interest, source, status, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  const rows = (customers ?? []) as Pick<
    Customer,
    "id" | "phone" | "name" | "project_interest" | "source" | "status" | "notes"
  >[]

  return (
    <div className="space-y-5 max-w-7xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">Khách hàng</h1>
          <p className="page-sub">
            Quản lý danh sách khách BĐS có SĐT để AI gọi. {error ? "(lỗi tải data)" : `Hiện có ${rows.length} khách.`}
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
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Dự án quan tâm</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Nguồn</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1 min-w-[200px]">Ghi chú</th>
                <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-1"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-ink-3 text-base">
                    {error ? `Lỗi: ${error.message}` : "Chưa có khách nào — chạy SQL seed 0002 hoặc Import CSV để thêm."}
                  </td>
                </tr>
              ) : (
                rows.map((c, idx) => (
                  <tr key={c.id} className="border-b border-line-1 last:border-0 hover:bg-surface-2/60 transition-colors">
                    <td className="px-3 py-3 text-sm text-ink-3 tabular-nums">{idx + 1}</td>
                    <td className="px-4 py-3 text-base text-ink-1 font-medium">
                      {c.name || <span className="text-ink-hint">—</span>}
                    </td>
                    <td className="px-4 py-3 text-base tabular-nums tracking-tight text-ink-1 font-medium">
                      {formatPhone(c.phone)}
                    </td>
                    <td className="px-4 py-3 text-base text-ink-2">
                      {c.project_interest || <span className="text-ink-hint">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-3">
                      {c.source || <span className="text-ink-hint">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={STATUS_BADGE[c.status] ?? "b-gray"}>
                        {STATUS_LABEL[c.status] ?? c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-2 max-w-[280px]">
                      {c.notes ? (
                        <span className="line-clamp-2" title={c.notes}>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
