import { formatRM } from "@/lib/format";
import type { Item, Occurrence } from "@/types";

interface DayDrawerProps {
  date: string | null;
  open: boolean;
  occurrences: Occurrence[];
  itemsById: Record<string, Item>;
  onClose: () => void;
  onMarkPaid: (itemId: string, date: string) => void;
  onEdit: (item: Item) => void;
}

export function DayDrawer({
  date,
  open,
  occurrences,
  itemsById,
  onClose,
  onMarkPaid,
  onEdit,
}: DayDrawerProps) {
  if (!open || !date) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Due on {date}</h2>
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-1 text-sm">
            Close
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {occurrences.length === 0 ? (
            <p className="rounded-xl border border-dashed p-4 text-slate-600">Nothing due on this day.</p>
          ) : null}
          {occurrences.map((occurrence, idx) => {
            const item = itemsById[occurrence.itemId];
            if (!item) return null;
            return (
              <div key={`${occurrence.itemId}-${idx}`} className="rounded-xl border p-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-600">
                  {formatRM(occurrence.amount)} · {item.type.toUpperCase()}
                </p>
                <p className="mt-1 text-xs font-medium uppercase text-slate-500">{occurrence.status}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onMarkPaid(item.id, date)}
                    disabled={occurrence.status === "paid"}
                    className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    Mark as paid
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="rounded-lg border px-3 py-2 text-sm font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
