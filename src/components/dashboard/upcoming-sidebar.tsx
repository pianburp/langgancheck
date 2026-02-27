import { formatRM, formatRelativeDate, formatShortDate } from "@/lib/format";
import type { Item, Occurrence } from "@/types";

interface UpcomingSidebarProps {
  monthlyTotal: number;
  occurrences: Occurrence[];
  itemsById: Record<string, Item>;
}

export function UpcomingSidebar({
  monthlyTotal,
  occurrences,
  itemsById,
}: UpcomingSidebarProps) {
  const upcoming = occurrences.filter((o) => o.status !== "paid").slice(0, 10);
  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border bg-gradient-to-br from-teal-700 to-teal-500 p-4 text-white">
        <p className="text-sm uppercase tracking-wide text-teal-100">This Month</p>
        <p className="mt-1 text-3xl font-bold">{formatRM(monthlyTotal)}</p>
      </section>
      <section className="rounded-2xl border bg-white p-4">
        <h2 className="text-lg font-bold">Upcoming</h2>
        <div className="mt-3 space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-600">Nothing due in this range.</p>
          ) : null}
          {upcoming.map((occurrence, idx) => {
            const item = itemsById[occurrence.itemId];
            if (!item) return null;
            return (
              <div key={`${occurrence.itemId}-${idx}`} className="rounded-xl border bg-slate-50 p-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-600">
                  {formatRM(occurrence.amount)} · {formatShortDate(occurrence.date)}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {formatRelativeDate(occurrence.date)}
                </p>
                {item.type === "bnpl" && item.totalInstallments ? (
                  <p className="mt-1 text-xs font-semibold text-teal-700">
                    {item.installmentsPaid}/{item.totalInstallments} paid
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
