import type { Item, Occurrence } from "@/types";

interface CalendarViewProps {
  monthDate: Date;
  occurrences: Occurrence[];
  itemsById: Record<string, Item>;
  onSelectDate: (date: string) => void;
}

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function monthCells(monthDate: Date): Date[] {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = new Date(first);
  const weekday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - weekday);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function CalendarView({
  monthDate,
  occurrences,
  itemsById,
  onSelectDate,
}: CalendarViewProps) {
  const cells = monthCells(monthDate);
  const occurrenceMap = new Map<string, Occurrence[]>();
  for (const occurrence of occurrences) {
    const list = occurrenceMap.get(occurrence.date) ?? [];
    list.push(occurrence);
    occurrenceMap.set(occurrence.date, list);
  }

  return (
    <section className="rounded-2xl border bg-white p-4 sm:p-6">
      <div className="mb-3 grid grid-cols-7 text-xs font-bold uppercase text-slate-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="px-2 py-1 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day) => {
          const key = iso(day);
          const dayItems = occurrenceMap.get(key) ?? [];
          const inMonth = day.getMonth() === monthDate.getMonth();
          return (
            <button
              key={key}
              aria-label={`View due items for ${key}`}
              onClick={() => onSelectDate(key)}
              className={`min-h-24 rounded-xl border p-2 text-left ${
                inMonth ? "bg-white" : "bg-slate-50 text-slate-400"
              }`}
            >
              <div className="text-sm font-semibold">{day.getDate()}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {dayItems.slice(0, 4).map((occurrence, idx) => {
                  const item = itemsById[occurrence.itemId];
                  const style =
                    occurrence.status === "paid"
                      ? "border"
                      : occurrence.status === "missed"
                        ? "bg-red-600"
                        : "bg-slate-700";
                  return (
                    <span
                      key={`${occurrence.itemId}-${idx}`}
                      title={item?.name}
                      className={`inline-block h-2 w-2 rounded-full ${style}`}
                      style={{ backgroundColor: occurrence.status === "upcoming" ? item?.color : undefined }}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
