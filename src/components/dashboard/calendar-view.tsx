import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toLocalDateKey } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Item, Occurrence } from "@/lib/domain/types";

interface CalendarViewProps {
  monthDate: Date;
  occurrences: Occurrence[];
  itemsById: Record<string, Item>;
  onSelectDate: (date: string) => void;
}

function iso(date: Date): string {
  return toLocalDateKey(date);
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

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const today = iso(new Date());

  return (
    <Card className="overflow-hidden border">
      <CardHeader className="border-b bg-muted/40 px-4 py-3">
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div 
              key={day} 
              className="py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7">
          {cells.map((day) => {
            const key = iso(day);
            const dayItems = occurrenceMap.get(key) ?? [];
            const inMonth = day.getMonth() === monthDate.getMonth();
            const isToday = key === today;

            return (
              <button
                key={key}
                onClick={() => onSelectDate(key)}
                className={cn(
                  "relative min-h-[100px] border-b border-r p-2 text-left transition-colors duration-150",
                  "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  !inMonth && "bg-muted/30 text-muted-foreground/60",
                  day.getDay() === 0 && "border-r-0"
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center text-sm",
                    isToday && "rounded-full bg-foreground font-medium text-background"
                  )}
                >
                  {day.getDate()}
                </span>
                {dayItems.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dayItems.slice(0, 5).map((occurrence, idx) => {
                      const item = itemsById[occurrence.itemId];
                      const isPaid = occurrence.status === "paid";
                      const isMissed = occurrence.status === "missed";
                      
                      return (
                        <span
                          key={`${occurrence.itemId}-${idx}`}
                          title={item?.name}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isPaid && "bg-muted-foreground/30",
                            isMissed && "bg-destructive",
                            !isPaid && !isMissed && "bg-foreground/70"
                          )}
                          style={{
                            backgroundColor: !isPaid && !isMissed ? item?.color : undefined,
                          }}
                        />
                      );
                    })}
                    {dayItems.length > 5 && (
                      <span className="text-[10px] leading-none text-muted-foreground">
                        +{dayItems.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
