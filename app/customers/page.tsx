import { Upload, Plus } from "lucide-react"
import { CUSTOMER_STATUS_LABEL } from "@/lib/types"

const MOCK_CUSTOMERS = [
  { id: "1", phone: "0912345678", name: "Nguyễn Văn A", project: "Vinhomes Ocean Park", status: "chua_goi" },
  { id: "2", phone: "0987654321", name: "Trần Thị B", project: "Masteri Centre Point", status: "quan_tam" },
  { id: "3", phone: "0901112223", name: "Lê Văn C", project: "Vinhomes Ocean Park", status: "khong_nghe" },
] as const

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Khách hàng</h1>
          <p className="text-sm text-slate-500">
            Quản lý danh sách khách BĐS có SĐT để AI gọi.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white hover:bg-slate-50">
            <Upload size={16} /> Import CSV
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-brand text-white hover:bg-brand-dark">
            <Plus size={16} /> Thêm khách
          </button>
        </div>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-2 font-medium">SĐT</th>
              <th className="px-4 py-2 font-medium">Tên</th>
              <th className="px-4 py-2 font-medium">Dự án quan tâm</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CUSTOMERS.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-mono">{c.phone}</td>
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">{c.project}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-slate-100">
                    {CUSTOMER_STATUS_LABEL[c.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-brand hover:underline text-sm">Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-xs text-slate-400 bg-slate-50 border-t border-slate-200">
          Dữ liệu mẫu — sau khi kết nối Supabase + import CSV sẽ thay bằng data thật.
        </div>
      </div>
    </div>
  )
}
