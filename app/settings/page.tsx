import { createClient } from "@/lib/supabase/server"
import { SettingsForm, type SettingRow } from "@/components/settings-form"

export const revalidate = 0

export default async function SettingsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from("app_settings")
    .select("key, value, is_secret")
    .order("key")

  const rows = (data ?? []) as SettingRow[]

  return (
    <div className="space-y-5 max-w-3xl">
      <header>
        <h1 className="page-title">Cài đặt</h1>
        <p className="page-sub">Cấu hình API key + endpoint của các provider gọi AI và messaging.</p>
      </header>

      <SettingsForm initial={rows} />
    </div>
  )
}
