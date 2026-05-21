import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string) {
  const clean = phone.replace(/\D/g, "")
  if (clean.length === 10) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`
  }
  return phone
}

export function zaloDeepLink(phone: string) {
  const clean = phone.replace(/\D/g, "")
  return `https://zalo.me/${clean}`
}

// Convention: notes bắt đầu "⚠️ LỖI SĐT: <chi tiết>\n<note thường>"
// → UI render row báo đỏ + badge "LỖI SĐT"
export const PHONE_ERROR_PREFIX = "⚠️ LỖI SĐT:"

export function detectPhoneError(notes: string | null): {
  isError: boolean
  errorMsg: string | null
  cleanNote: string | null
} {
  if (!notes) return { isError: false, errorMsg: null, cleanNote: null }
  if (!notes.startsWith(PHONE_ERROR_PREFIX)) {
    return { isError: false, errorMsg: null, cleanNote: notes }
  }
  const firstLineEnd = notes.indexOf("\n")
  const headLine = firstLineEnd === -1 ? notes : notes.slice(0, firstLineEnd)
  const rest = firstLineEnd === -1 ? "" : notes.slice(firstLineEnd + 1).trim()
  const errorMsg = headLine.slice(PHONE_ERROR_PREFIX.length).trim()
  return {
    isError: true,
    errorMsg: errorMsg || "Không xác định",
    cleanNote: rest || null,
  }
}
