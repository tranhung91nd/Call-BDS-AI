export type CustomerStatus =
  | "chua_goi"
  | "da_goi"
  | "quan_tam"
  | "khong_quan_tam"
  | "goi_lai"
  | "khong_nghe"

export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  chua_goi: "Chưa gọi",
  da_goi: "Đã gọi",
  quan_tam: "Quan tâm",
  khong_quan_tam: "Không quan tâm",
  goi_lai: "Gọi lại sau",
  khong_nghe: "Không nghe máy",
}

export type Customer = {
  id: string
  phone: string
  name: string | null
  source: string | null
  project_interest: string | null
  status: CustomerStatus
  do_not_call: boolean
  last_contact_at: string | null
  notes: string | null
  created_at: string
}

export type Campaign = {
  id: string
  name: string
  script_id: string | null
  status: "draft" | "running" | "paused" | "done"
  started_at: string | null
  finished_at: string | null
  created_at: string
}

export type Script = {
  id: string
  name: string
  content: string
  ai_voice_id: string | null
  created_at: string
}

export type CallLog = {
  id: string
  customer_id: string
  campaign_id: string | null
  started_at: string
  duration_sec: number | null
  recording_url: string | null
  transcript: string | null
  ai_intent: CustomerStatus | null
  raw_response: unknown
}
