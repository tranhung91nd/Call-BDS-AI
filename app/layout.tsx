import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Sidebar } from "@/components/sidebar"

// Đặt server function ở Singapore (gần Supabase SG) — giảm latency từ ~250ms → ~30ms/query
export const preferredRegion = ["sin1"]

export const metadata: Metadata = {
  title: "BDS AI Call",
  description: "CRM gọi tự động bằng AI cho dịch vụ Bất động sản",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <div className="md:grid md:grid-cols-[240px_1fr] min-h-screen">
          <Sidebar />
          <main className="px-4 py-4 md:px-7 md:py-6 overflow-x-hidden">{children}</main>
        </div>
      </body>
    </html>
  )
}
