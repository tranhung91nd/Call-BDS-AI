import { Plus } from "lucide-react"

const SAMPLE = `Xin chào anh/chị {ten}, em là trợ lý ảo của công ty BĐS XYZ.

Em được biết anh/chị từng quan tâm đến dự án {du_an}. Hiện bên em đang có chính sách ưu đãi đặc biệt: chiết khấu lên tới 8%, ân hạn gốc 24 tháng.

Anh/chị có muốn em kết nối chuyên viên tư vấn gửi thông tin chi tiết qua Zalo không ạ?`

export default function ScriptsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kịch bản AI</h1>
          <p className="text-sm text-slate-500">
            Nội dung AI sẽ đọc khi gọi khách. Dùng biến <code className="text-xs bg-slate-100 px-1 rounded">{"{ten}"}</code>, <code className="text-xs bg-slate-100 px-1 rounded">{"{du_an}"}</code>.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-brand text-white hover:bg-brand-dark">
          <Plus size={16} /> Tạo kịch bản
        </button>
      </header>

      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="font-medium mb-2">Mẫu — Mời tư vấn dự án BĐS</div>
        <pre className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded border border-slate-200">
{SAMPLE}
        </pre>
      </div>
    </div>
  )
}
