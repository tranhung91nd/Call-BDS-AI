"use client"

import { Plus, Edit2 } from "lucide-react"
import { useState } from "react"
import { ScriptFormModal } from "./script-form-modal"
import type { Script } from "@/lib/types"

type ScriptInput = Pick<Script, "id" | "name" | "content" | "ai_voice_id">

export function AddScriptButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="btn-primary btn-sm" onClick={() => setOpen(true)}>
        <Plus size={14} /> Tạo kịch bản
      </button>
      {open && <ScriptFormModal onClose={() => setOpen(false)} />}
    </>
  )
}

export function EditScriptButton({ script }: { script: ScriptInput }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="btn-ghost btn-sm" onClick={() => setOpen(true)}>
        <Edit2 size={13} /> Chỉnh sửa
      </button>
      {open && <ScriptFormModal script={script} onClose={() => setOpen(false)} />}
    </>
  )
}
