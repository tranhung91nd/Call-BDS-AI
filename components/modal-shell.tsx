"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

export function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
  size = "md",
}: {
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "md" | "lg"
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onEsc)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onEsc)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const maxW = size === "lg" ? "max-w-2xl" : "max-w-md"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className={`bg-surface-1 rounded-[18px] shadow-xl w-full ${maxW} max-h-[90vh] flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-line-1">
          <div>
            <h3 className="text-lg font-semibold text-ink-1">{title}</h3>
            {subtitle && <div className="text-xs text-ink-3 mt-0.5">{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-[8px] flex items-center justify-center text-ink-3 hover:bg-surface-2 hover:text-ink-1 transition-colors"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-line-1 bg-surface-2/40 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-1.5">
        {label} {required && <span className="text-danger-tx">*</span>}
      </div>
      {children}
      {hint && <div className="text-xs text-ink-hint mt-1">{hint}</div>}
    </label>
  )
}

export const inputClass =
  "w-full px-3 py-2 text-base bg-surface-2 border border-line-2 rounded-[10px] outline-none focus:border-brand-blue focus:bg-surface-1 transition-colors"
