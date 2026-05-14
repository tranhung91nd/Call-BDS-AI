import "./globals.css"
import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"

export const metadata: Metadata = {
  title: "BDS AI Call",
  description: "CRM gọi tự động bằng AI cho dịch vụ Bất động sản",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 max-w-7xl">{children}</main>
        </div>
      </body>
    </html>
  )
}
