"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Script } from "@/lib/types"
import { ModalShell, Field, inputClass } from "./modal-shell"

type ScriptInput = Pick<Script, "id" | "name" | "content" | "ai_voice_id">

const VOICE_OPTIONS = [
  { id: "fpt_banmai", label: "Ban Mai (FPT.AI) - Nữ Bắc, nhẹ nhàng" },
  { id: "fpt_lemina", label: "Lê Minh (FPT.AI) - Nam Bắc, trầm ấm" },
  { id: "fpt_linhsan", label: "Linh San (FPT.AI) - Nữ Nam, trẻ trung" },
  { id: "fpt_giahuy", label: "Gia Huy (FPT.AI) - Nam Nam, năng động" },
  { id: "vbee_hamy", label: "HaMy (VBee) - Nữ Bắc, tự nhiên" },
  { id: "vbee_minh", label: "Minh (VBee) - Nam Bắc" },
  { id: "vbee_legiang", label: "Lê Giang (VBee) - Nữ Nam" },
]

export function ScriptFormModal({
  script,
  onClose,
}: {
  script?: ScriptInput
  onClose: () => void
}) {
  const isEdit = !!script?.id
  const [name, setName] = useState(script?.name ?? "")
  const [content, setContent] = useState(script?.content ?? "")
  const [voiceId, setVoiceId] = useState(script?.ai_voice_id ?? "fpt_banmai")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const save = async () => {
    if (!name.trim() || !content.trim()) {
      setError("Vui lòng nhập tên kịch bản và nội dung")
      return
    }
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const payload = {
      name: name.trim(),
      content: content.trim(),
      ai_voice_id: voiceId,
    }
    const { error: e } = isEdit
      ? await supabase.from("scripts").update(payload).eq("id", script!.id)
      : await supabase.from("scripts").insert(payload)
    setSaving(false)
    if (e) {
      setError(e.message)
      return
    }
    onClose()
    router.refresh()
  }

  return (
    <ModalShell
      title={isEdit ? "Chỉnh sửa kịch bản" : "Tạo kịch bản mới"}
      subtitle="Dùng biến {ten} {du_an} để AI thay tên khách + tên dự án khi gọi"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <button className="btn-ghost btn-sm" onClick={onClose} disabled={saving}>
            Hủy
          </button>
          <button className="btn-primary btn-sm min-w-[88px]" onClick={save} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : isEdit ? "Lưu" : "Tạo"}
          </button>
        </>
      }
    >
      <div className="space-y-3.5">
        <Field label="Tên kịch bản" required>
          <input
            className={inputClass}
            placeholder="Mời tư vấn Vinhomes Ocean Park"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Giọng AI">
          <select
            className={inputClass}
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
          >
            {VOICE_OPTIONS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nội dung AI sẽ đọc" required hint="Tip: Mỗi câu 1 dòng, AI sẽ tạm dừng tự nhiên giữa các câu.">
          <textarea
            className={`${inputClass} font-sans leading-relaxed`}
            rows={10}
            placeholder={`Xin chào anh/chị {ten}, em là trợ lý ảo của công ty BĐS XYZ.\n\nEm được biết anh/chị từng quan tâm đến dự án {du_an}...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Field>

        {error && (
          <div className="text-sm text-danger-tx bg-danger-bg border border-danger rounded-[8px] p-2.5">
            {error}
          </div>
        )}
      </div>
    </ModalShell>
  )
}
