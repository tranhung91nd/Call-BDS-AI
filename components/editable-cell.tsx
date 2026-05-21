"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, X, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatPhone, detectPhoneError } from "@/lib/utils"
import { CUSTOMER_STATUS_LABEL, type CustomerStatus } from "@/lib/types"

type Option = { value: string; label: string }

type Props = {
  rowId: string
  field: string
  value: string | null
  placeholder?: string
  emptyLabel?: string
  multiline?: boolean
  type?: "text" | "email" | "tel"
  options?: Option[]
  // Format/render là string flag để truyền được qua Server → Client Component.
  formatAs?: "phone"
  renderAs?: "status-badge" | "notes-with-error"
  className?: string
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  chua_goi: "b-gray",
  da_goi: "b-blue",
  quan_tam: "b-green",
  khong_quan_tam: "b-red",
  goi_lai: "b-amber",
  khong_nghe: "b-purple",
}

function formatValueByFlag(v: string, flag?: "phone"): string {
  if (flag === "phone") return formatPhone(v)
  return v
}

function renderByFlag(v: string | null, flag?: "status-badge" | "notes-with-error", emptyLabel = "—") {
  if (flag === "status-badge") {
    if (!v) return <span className="text-ink-hint">{emptyLabel}</span>
    const cls = STATUS_BADGE_CLASS[v] ?? "b-gray"
    const label = CUSTOMER_STATUS_LABEL[v as CustomerStatus] ?? v
    return <span className={cls}>{label}</span>
  }
  if (flag === "notes-with-error") {
    if (!v) return <span className="text-ink-hint">{emptyLabel}</span>
    const e = detectPhoneError(v)
    if (!e.isError) {
      return <span className="text-ink-2 line-clamp-2" title={v}>{v}</span>
    }
    return (
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[8px] bg-danger text-white text-xs font-semibold">
          <AlertTriangle size={11} strokeWidth={2.2} />
          LỖI SĐT
        </div>
        <div className="text-danger-tx font-medium line-clamp-2" title={e.errorMsg ?? undefined}>
          {e.errorMsg}
        </div>
        {e.cleanNote && (
          <div className="text-ink-3 line-clamp-2" title={e.cleanNote}>
            {e.cleanNote}
          </div>
        )}
      </div>
    )
  }
  return null
}

export function EditableCell({
  rowId,
  field,
  value,
  placeholder = "—",
  emptyLabel = "—",
  multiline = false,
  type = "text",
  options,
  formatAs,
  renderAs,
  className = "",
}: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localValue, setLocalValue] = useState(value)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [editing])

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

  const save = async (overrideValue?: string) => {
    const raw = overrideValue !== undefined ? overrideValue : draft
    const next = raw.trim() || null
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
      if (e.code === "23505" || /unique|duplicate/i.test(e.message)) {
        setError("SĐT đã tồn tại ở khách khác")
      } else {
        setError(e.message)
      }
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
        {options ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            className={baseInput}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              save(e.target.value)
            }}
            onKeyDown={onKeyDown}
            onBlur={() => !saving && cancelEdit()}
            disabled={saving}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={`${baseInput} resize-y min-h-[80px]`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => save()}
            disabled={saving}
            placeholder={placeholder}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            className={baseInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => save()}
            disabled={saving}
            placeholder={placeholder}
            type={type}
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
        {multiline && !error && (
          <div className="mt-1 text-[10px] text-ink-hint">⌘/Ctrl + Enter để lưu · Esc huỷ</div>
        )}
      </div>
    )
  }

  let display: React.ReactNode
  if (renderAs) {
    display = renderByFlag(localValue, renderAs, emptyLabel)
  } else if (localValue) {
    display = formatValueByFlag(localValue, formatAs)
  } else {
    display = <span className="text-ink-hint">{emptyLabel}</span>
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      className={`group/cell text-left w-full px-2 py-1 -mx-2 -my-1 rounded-[6px] hover:bg-brand-blue-bg/60 cursor-text transition-colors ${className}`}
      title="Click để sửa"
    >
      {display}
    </button>
  )
}
