"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Props = {
  rowId: string
  field: "name" | "phone_secondary" | "address" | "email" | "project_interest"
  value: string | null
  placeholder?: string
  className?: string
  emptyLabel?: string
  multiline?: boolean
  formatValue?: (v: string) => string  // hiển thị format khác lúc đọc (vd SĐT)
}

export function EditableCell({
  rowId,
  field,
  value,
  placeholder = "—",
  className = "",
  emptyLabel = "—",
  multiline = false,
  formatValue,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localValue, setLocalValue] = useState(value)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [editing])

  // Đồng bộ khi prop value thay đổi từ server (router.refresh)
  useEffect(() => {
    setLocalValue(value)
    setDraft(value ?? "")
  }, [value])

  const startEdit = () => {
    setError(null)
    setDraft(localValue ?? "")
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setError(null)
    setDraft(localValue ?? "")
  }

  const save = async () => {
    const next = draft.trim() || null
    if (next === (localValue ?? null)) {
      setEditing(false)
      return
    }
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { error: e } = await supabase
      .from("customers")
      .update({ [field]: next })
      .eq("id", rowId)
    setSaving(false)
    if (e) {
      setError(e.message)
      return
    }
    setLocalValue(next)
    setEditing(false)
    router.refresh()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      cancelEdit()
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      save()
    } else if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      save()
    }
  }

  if (editing) {
    const baseInput =
      "w-full px-2 py-1 text-base bg-surface-1 border border-brand-blue rounded-[6px] outline-none focus:ring-2 focus:ring-brand-blue/30"
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={`${baseInput} resize-none min-h-[60px]`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={save}
            disabled={saving}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={baseInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={save}
            disabled={saving}
            placeholder={placeholder}
            type={field === "email" ? "email" : "text"}
          />
        )}
        {saving && (
          <Loader2 size={14} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-ink-3" />
        )}
        {error && (
          <div className="absolute z-10 mt-1 left-0 right-0 px-2 py-1 text-xs text-danger-tx bg-danger-bg border border-danger rounded-[6px] flex items-center gap-1">
            <X size={11} /> {error}
          </div>
        )}
      </div>
    )
  }

  const display = localValue
    ? formatValue
      ? formatValue(localValue)
      : localValue
    : null

  return (
    <button
      type="button"
      onClick={startEdit}
      className={`group/cell text-left w-full px-2 py-1 -mx-2 -my-1 rounded-[6px] hover:bg-brand-blue-bg/60 cursor-text transition-colors ${className}`}
      title="Click để sửa"
    >
      {display ?? <span className="text-ink-hint group-hover/cell:text-ink-3">{emptyLabel}</span>}
    </button>
  )
}
