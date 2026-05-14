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
