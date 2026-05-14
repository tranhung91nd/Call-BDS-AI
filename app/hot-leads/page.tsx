import { MessageCircle, Headphones, Check, Flame, Phone, Clock } from "lucide-react"
import { formatPhone, zaloDeepLink } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 0

type HotLead = {
  id: string
  phone: string
  name: string | null
  project_interest: string | null
  last_contact_at: string | null
  recording_url: string | null
  transcript: string | null
}

function formatTime(iso: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default async function HotLeadsPage() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("hot_leads")
    .select("id, phone, name, project_interest, last_contact_at, recording_url, transcript")

  const leads = (data ?? []) as HotLead[]

  return (
    <div className="space-y-5 max-w-5xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Flame size={20} className="text-warn" />
            Lead nóng
            <span className="badge bg-warn-bg text-warn-tx text-xs ml-1">
              {leads.length} cần follow
            </span>
          </h1>
          <p className="page-sub">
            Khách đã được AI xác định là <span className="font-semibold text-ink-2">quan tâm</span> — sale mở Zalo chốt trực tiếp.
          </p>
        </div>
      </header>

      {error && (
        <div className="card p-4 bg-danger-bg border-danger text-danger-tx text-base">
          Lỗi tải data: {error.message}
        </div>
      )}

      {leads.length === 0 && !error ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-lg font-semibold text-ink-1">Chưa có lead nóng nào</div>
          <div className="text-base text-ink-3 mt-1">
            Khi AI xác định khách quan tâm trong chiến dịch, sẽ hiển thị ở đây để sale chốt qua Zalo.
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {leads.map((lead) => (
            <div key={lead.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-ink-1">{lead.name ?? "Khách chưa có tên"}</h3>
                    <span className="text-base text-ink-2 tabular-nums tracking-tight">
                      {formatPhone(lead.phone)}
                    </span>
                    <span className="badge bg-warn-bg text-warn-tx text-xs">Rất quan tâm</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-ink-3 mt-1.5 flex-wrap">
                    {lead.project_interest && (
                      <span>
                        <span className="text-ink-2 font-medium">Dự án:</span> {lead.project_interest}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatTime(lead.last_contact_at)}
                    </span>
                  </div>
                  {lead.transcript && (
                    <div className="mt-3 p-3 bg-surface-2/60 border border-line-1 rounded-[10px] text-base text-ink-2 italic leading-relaxed">
                      <span className="text-ink-3 not-italic mr-1.5">💬</span>
                      &ldquo;{lead.transcript}&rdquo;
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0 min-w-[150px]">
                  <a
                    href={zaloDeepLink(lead.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary btn-sm justify-center"
                    style={{ background: "#0068ff" }}
                  >
                    <MessageCircle size={14} /> Mở Zalo
                  </a>
                  <button
                    className="btn-ghost btn-sm justify-center disabled:opacity-50"
                    disabled={!lead.recording_url}
                  >
                    <Headphones size={14} /> Nghe ghi âm
                  </button>
                  <button className="btn-ghost btn-sm justify-center">
                    <Check size={14} /> Đã chăm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
