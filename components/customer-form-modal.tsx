"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CUSTOMER_STATUS_LABEL, type Customer, type CustomerStatus } from "@/lib/types"
import { ModalShell, Field, inputClass } from "./modal-shell"

type CustomerInput = Pick<
  Customer,
  | "id"
  | "name"
  | "phone"
  | "phone_secondary"
  | "address"
  | "email"
  | "project_interest"
  | "source"
  | "status"
  | "notes"
>

export function CustomerFormModal({
  customer,
  onClose,
}: {
  customer?: CustomerInput
  onClose: () => void
}) {
  const isEdit = !!customer?.id
  const [phone, setPhone] = useState(customer?.phone ?? "")
  const [phoneSecondary, setPhoneSecondary] = useState(customer?.phone_secondary ?? "")
  const [name, setName] = useState(customer?.name ?? "")
  const [address, setAddress] = useState(customer?.address ?? "")
  const [email, setEmail] = useState(customer?.email ?? "")
  const [project, setProject] = useState(customer?.project_interest ?? "")
  const [source, setSource] = useState(customer?.source ?? "")
  const [status, setStatus] = useState<CustomerStatus>(customer?.status ?? "chua_goi")
  const [notes, setNotes] = useState(customer?.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const save = async () => {
    if (!phone.trim()) {
      setError("Vui lòng nhập SĐT")
      return
    }
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const payload = {
      phone: phone.trim(),
      phone_secondary: phoneSecondary.trim() || null,
      name: name.trim() || null,
      address: address.trim() || null,
      email: email.trim() || null,
      project_interest: project.trim() || null,
      source: source.trim() || null,
      status,
      notes: notes.trim() || null,
    }
    const { error: e } = isEdit
      ? await supabase.from("customers").update(payload).eq("id", customer!.id)
      : await supabase.from("customers").insert(payload)
    setSaving(false)
    if (e) {
      setError(e.message)
      return
    }
    onClose()
    router.refresh()
  }

  return (
    <ModalShell
      title={isEdit ? "Sửa khách hàng" : "Thêm khách hàng mới"}
      subtitle={isEdit ? `ID: ${customer!.id.slice(0, 8)}…` : "Nhập thông tin khách mới"}
      onClose={onClose}
      footer={
        <>
          <button className="btn-ghost btn-sm" onClick={onClose} disabled={saving}>
            Hủy
          </button>
          <button className="btn-primary btn-sm min-w-[88px]" onClick={save} disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : isEdit ? "Lưu" : "Thêm"}
          </button>
        </>
      }
    >
      <div className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="SĐT" required>
            <input
              className={inputClass}
              placeholder="0912 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isEdit}
            />
          </Field>
          <Field label="SĐT phụ" hint="Số dự phòng (nếu có).">
            <input
              className={inputClass}
              placeholder="0922 666 636"
              value={phoneSecondary}
              onChange={(e) => setPhoneSecondary(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Tên khách">
          <input
            className={inputClass}
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Địa chỉ" hint="Địa chỉ liên hệ của khách (không bắt buộc).">
          <input
            className={inputClass}
            placeholder="Số 33 ngõ 64, Nguyễn Lương Bằng, Đống Đa, HN"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Field>

        <Field label="Email">
          <input
            className={inputClass}
            type="email"
            placeholder="khachhang@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Dự án quan tâm">
            <input
              className={inputClass}
              placeholder="Vinhomes Ocean Park"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </Field>
          <Field label="Nguồn">
            <input
              className={inputClass}
              placeholder="Lead form FB"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Trạng thái">
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as CustomerStatus)}
          >
            {(Object.keys(CUSTOMER_STATUS_LABEL) as CustomerStatus[]).map((s) => (
              <option key={s} value={s}>
                {CUSTOMER_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Ghi chú" hint="Sale tự nhập, vd: khan hàng, thích hướng Đông...">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Ghi chú nội bộ..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>

        {error && (
          <div className="text-sm text-danger-tx bg-danger-bg border border-danger rounded-[8px] p-2.5">
            {error}
          </div>
        )}
      </div>
    </ModalShell>
  )
}
