"use client"

import { Plus, Pencil } from "lucide-react"
import { useState } from "react"
import { CustomerFormModal } from "./customer-form-modal"
import type { Customer } from "@/lib/types"

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

export function AddCustomerButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="btn-primary btn-sm" onClick={() => setOpen(true)}>
        <Plus size={14} /> Thêm khách
      </button>
      {open && <CustomerFormModal onClose={() => setOpen(false)} />}
    </>
  )
}

export function EditCustomerButton({ customer }: { customer: CustomerInput }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-brand-blue-tx hover:underline text-sm font-medium"
      >
        <Pencil size={12} /> Sửa
      </button>
      {open && <CustomerFormModal customer={customer} onClose={() => setOpen(false)} />}
    </>
  )
}
