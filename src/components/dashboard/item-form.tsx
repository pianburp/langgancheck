"use client";

import { useMemo, useState } from "react";
import { CATEGORY_OPTIONS, ITEM_COLORS } from "@/lib/constants";
import type { BillingCycle, Category, Item, ItemType } from "@/types";

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  editItem: Item | null;
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type ItemDraft = {
  type: ItemType;
  name: string;
  amount: string;
  billingCycle: BillingCycle;
  billingDay: string;
  startDate: string;
  category: Category;
  color: string;
  notes: string;
  totalInstallments: string;
  installmentsPaid: string;
};

function toDraft(editItem: Item | null): ItemDraft {
  return {
    type: editItem?.type ?? ("subscription" as ItemType),
    name: editItem?.name ?? "",
    amount: String(editItem?.amount ?? 0),
    billingCycle: editItem?.billingCycle ?? ("monthly" as BillingCycle),
    billingDay: String(editItem?.billingDay ?? 1),
    startDate: editItem?.startDate ?? todayDate(),
    category: editItem?.category ?? "other",
    color: editItem?.color ?? ITEM_COLORS[0],
    notes: editItem?.notes ?? "",
    totalInstallments: String(editItem?.totalInstallments ?? 6),
    installmentsPaid: String(editItem?.installmentsPaid ?? 0),
  };
}

export function ItemForm({ open, onClose, onSave, editItem }: ItemFormProps) {
  const [draft, setDraft] = useState(() => toDraft(editItem));
  const { type } = draft;

  const cycleOptions = useMemo(() => {
    if (type === "bnpl") return ["weekly", "biweekly", "monthly"] as const;
    return ["weekly", "monthly", "yearly"] as const;
  }, [type]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold">{editItem ? "Edit item" : "Add item"}</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setDraft((prev) => ({ ...prev, type: "subscription" }))}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              type === "subscription" ? "bg-white" : "text-slate-600"
            }`}
          >
            Subscription
          </button>
          <button
            type="button"
            onClick={() => setDraft((prev) => ({ ...prev, type: "bnpl" }))}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              type === "bnpl" ? "bg-white" : "text-slate-600"
            }`}
          >
            BNPL
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <label className="block text-sm font-medium">
            Name
            <input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
              maxLength={100}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Amount (RM)
            <input
              value={draft.amount}
              onChange={(e) => setDraft((prev) => ({ ...prev, amount: e.target.value }))}
              type="number"
              min="0.01"
              max="99999.99"
              step="0.01"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium">
              Billing cycle
              <select
                value={draft.billingCycle}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, billingCycle: e.target.value as BillingCycle }))
                }
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
              >
                {cycleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Billing day
              <input
                value={draft.billingDay}
                onChange={(e) => setDraft((prev) => ({ ...prev, billingDay: e.target.value }))}
                type="number"
                min="1"
                max="31"
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
              />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Start date
            <input
              value={draft.startDate}
              onChange={(e) => setDraft((prev) => ({ ...prev, startDate: e.target.value }))}
              type="date"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
            />
          </label>
          {type === "bnpl" ? (
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Total installments
                <input
                  value={draft.totalInstallments}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, totalInstallments: e.target.value }))
                  }
                  type="number"
                  min="1"
                  max="120"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                />
              </label>
              <label className="block text-sm font-medium">
                Installments paid
                <input
                  value={draft.installmentsPaid}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, installmentsPaid: e.target.value }))
                  }
                  type="number"
                  min="0"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
                />
              </label>
            </div>
          ) : null}
          <label className="block text-sm font-medium">
            Category
            <select
              value={draft.category}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, category: e.target.value as Category }))
              }
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div>
            <p className="text-sm font-medium">Color</p>
            <div className="mt-2 flex gap-2">
              {ITEM_COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, color: swatch }))}
                  aria-label={`Select ${swatch}`}
                  className={`h-8 w-8 rounded-full border-2 ${
                    draft.color === swatch ? "border-slate-900" : "border-transparent"
                  }`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>
          <label className="block text-sm font-medium">
            Notes
            <input
              value={draft.notes}
              onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
              maxLength={500}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => {
              const parsedAmount = Number(draft.amount);
              const parsedBillingDay = Number(draft.billingDay);
              const parsedTotal = Number(draft.totalInstallments);
              const parsedPaid = Number(draft.installmentsPaid);
              if (!draft.name.trim() || parsedAmount <= 0) return;
              if (parsedBillingDay < 1 || parsedBillingDay > 31) return;

              onSave({
                id: editItem?.id ?? makeId(),
                type: draft.type,
                name: draft.name.trim(),
                amount: parsedAmount,
                currency: "MYR",
                billingCycle: draft.billingCycle,
                billingDay: parsedBillingDay,
                startDate: draft.startDate,
                category: draft.category as Item["category"],
                color: draft.color,
                notes: draft.notes.trim(),
                isActive: true,
                totalInstallments: draft.type === "bnpl" ? parsedTotal : null,
                installmentsPaid: draft.type === "bnpl" ? parsedPaid : 0,
                paidDates: editItem?.paidDates ?? [],
              });
              onClose();
            }}
            className="flex-1 rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white"
          >
            {editItem ? "Save changes" : "Add item"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
