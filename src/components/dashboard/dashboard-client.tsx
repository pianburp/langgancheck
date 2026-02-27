"use client";

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { DayDrawer } from "@/components/dashboard/day-drawer";
import { ItemForm } from "@/components/dashboard/item-form";
import { UpcomingSidebar } from "@/components/dashboard/upcoming-sidebar";
import { UpgradeDialog } from "@/components/dashboard/upgrade-dialog";
import { FREE_ITEM_LIMIT } from "@/lib/constants";
import { getOccurrencesForMonth } from "@/lib/schedule";
import { loadItems, loadPlan, saveItems, savePlan } from "@/lib/storage";
import type { Item, PlanTier } from "@/types";

function useInitialItems(): [
  Item[],
  Dispatch<SetStateAction<Item[]>>
] {
  const [items, setItems] = useState<Item[]>(() => loadItems());
  return [items, setItems];
}

function useInitialPlan(): [PlanTier, (plan: PlanTier) => void] {
  const [plan, setPlanState] = useState<PlanTier>(() => loadPlan());
  const setPlan = (next: PlanTier) => {
    setPlanState(next);
    savePlan(next);
  };
  return [plan, setPlan];
}

export function DashboardClient() {
  const [items, setItems] = useInitialItems();
  const [plan, setPlan] = useInitialPlan();
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [formNonce, setFormNonce] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const occurrences = useMemo(
    () =>
      getOccurrencesForMonth(
        items,
        monthDate.getFullYear(),
        monthDate.getMonth()
      ),
    [items, monthDate]
  );

  const itemsById = useMemo(
    () => Object.fromEntries(items.map((item) => [item.id, item])),
    [items]
  );

  const dayOccurrences = useMemo(
    () => occurrences.filter((o) => o.date === selectedDate),
    [occurrences, selectedDate]
  );

  const monthlyTotal = useMemo(
    () =>
      occurrences
        .filter((o) => o.status !== "paid")
        .reduce((acc, curr) => acc + curr.amount, 0),
    [occurrences]
  );

  function persist(next: Item[]) {
    setItems(next);
    saveItems(next);
  }

  function onAddClick() {
    if (plan === "free" && items.length >= FREE_ITEM_LIMIT) {
      setUpgradeOpen(true);
      return;
    }
    setEditItem(null);
    setFormNonce((n) => n + 1);
    setFormOpen(true);
  }

  function onSave(item: Item) {
    const exists = items.some((candidate) => candidate.id === item.id);
    const next = exists
      ? items.map((candidate) => (candidate.id === item.id ? item : candidate))
      : [...items, item];
    persist(next);
  }

  function onMarkPaid(itemId: string, date: string) {
    const next = items.map((item) => {
      if (item.id !== itemId) return item;
      if (item.type === "bnpl") {
        const paid = item.installmentsPaid + 1;
        const totalInstallments = item.totalInstallments ?? paid;
        return {
          ...item,
          installmentsPaid: Math.min(paid, totalInstallments),
          isActive: paid >= totalInstallments ? false : item.isActive,
        };
      }
      if (item.paidDates.includes(date)) return item;
      return { ...item, paidDates: [...item.paidDates, date] };
    });
    persist(next);
  }

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <header className="mb-6 rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">GajiGuard Dashboard</h1>
            <p className="text-sm text-slate-600">
              Plan: <span className="font-semibold uppercase">{plan}</span> · {items.length} items
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const next = new Date(monthDate);
                next.setMonth(next.getMonth() - 1);
                setMonthDate(next);
              }}
              className="rounded-xl border px-3 py-2 text-sm font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setMonthDate(new Date())}
              className="rounded-xl border px-3 py-2 text-sm font-semibold"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                const next = new Date(monthDate);
                next.setMonth(next.getMonth() + 1);
                setMonthDate(next);
              }}
              className="rounded-xl border px-3 py-2 text-sm font-semibold"
            >
              Next
            </button>
            <button
              type="button"
              onClick={onAddClick}
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white"
            >
              + Quick Add
            </button>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
        <CalendarView
          monthDate={monthDate}
          occurrences={occurrences}
          itemsById={itemsById}
          onSelectDate={(date) => setSelectedDate(date)}
        />
        <UpcomingSidebar
          monthlyTotal={monthlyTotal}
          occurrences={occurrences}
          itemsById={itemsById}
        />
      </section>

      {items.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-dashed bg-white p-6 text-center">
          <p className="text-lg font-semibold">Add your first subscription or BNPL item</p>
          <button
            type="button"
            onClick={onAddClick}
            className="mt-3 rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white"
          >
            Add item
          </button>
        </section>
      ) : null}

      <ItemForm
        key={`${editItem?.id ?? "new"}-${formNonce}`}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={onSave}
        editItem={editItem}
      />
      <DayDrawer
        open={Boolean(selectedDate)}
        date={selectedDate}
        occurrences={dayOccurrences}
        itemsById={itemsById}
        onClose={() => setSelectedDate(null)}
        onMarkPaid={onMarkPaid}
        onEdit={(item) => {
          setEditItem(item);
          setFormNonce((n) => n + 1);
          setFormOpen(true);
        }}
      />
      <UpgradeDialog
        open={upgradeOpen}
        itemCount={items.length}
        onClose={() => setUpgradeOpen(false)}
        onUpgrade={() => {
          setPlan("pro");
          setUpgradeOpen(false);
        }}
      />
    </main>
  );
}
